-- Create orders through one atomic, server-authoritative transaction.
-- The client supplies only market, customer details, variant IDs and quantities.
create or replace function public.create_order_secure(
  p_market text,
  p_customer jsonb,
  p_items jsonb
)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := auth.uid();
  v_currency text;
  v_shipping_fee bigint;
  v_free_threshold bigint;
  v_subtotal bigint := 0;
  v_shipping bigint := 0;
  v_total bigint;
  v_order_id uuid;
  v_order_code text;
  v_item jsonb;
  v_variant_id uuid;
  v_quantity integer;
  v_product_id text;
  v_base_price bigint;
  v_unit_price bigint;
  v_line_total bigint;
  v_discount numeric;
  v_snapshot jsonb;
  v_customer jsonb;
  v_settings record;
  v_variant record;
  v_sku text;
  v_options jsonb;
  v_count integer;
  v_distinct_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_market not in ('iran', 'international') then
    raise exception 'Invalid market';
  end if;

  if jsonb_typeof(p_customer) is distinct from 'object' then
    raise exception 'Invalid customer information';
  end if;

  if coalesce(length(trim(p_customer->>'name')), 0) not between 1 and 120
     or coalesce(length(trim(p_customer->>'phone')), 0) not between 7 and 40
     or coalesce(length(trim(p_customer->>'city')), 0) not between 1 and 120
     or coalesce(length(trim(p_customer->>'address')), 0) not between 6 and 2000 then
    raise exception 'Please provide a valid name, phone, city and address';
  end if;

  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Invalid order items';
  end if;

  select count(*), count(distinct value->>'variantId')
    into v_count, v_distinct_count
  from jsonb_array_elements(p_items);

  if v_count < 1 or v_count > 20 or v_count <> v_distinct_count then
    raise exception 'Order must contain 1 to 20 unique variants';
  end if;

  select ms.currency, ms.shipping_fee, ms.free_shipping_threshold
    into v_settings
  from public.market_settings ms
  where ms.market = p_market and ms.is_enabled = true;

  if not found then
    raise exception 'This market is currently unavailable';
  end if;

  v_currency := v_settings.currency;
  v_shipping_fee := round(v_settings.shipping_fee * case when v_currency = 'USD' then 100 else 1 end)::bigint;
  v_free_threshold := case
    when v_settings.free_shipping_threshold is null then null
    else round(v_settings.free_shipping_threshold * case when v_currency = 'USD' then 100 else 1 end)::bigint
  end;

  -- Validate all items and lock their variant rows in a stable order.
  for v_item in
    select value
    from jsonb_array_elements(p_items)
    order by value->>'variantId'
  loop
    if coalesce(v_item->>'variantId', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
       or coalesce(v_item->>'qty', '') !~ '^[1-9][0-9]{0,2}$' then
      raise exception 'Invalid product variant or quantity';
    end if;

    v_variant_id := (v_item->>'variantId')::uuid;
    v_quantity := (v_item->>'qty')::integer;

    select pv.product_id, pv.price_irr, pv.price_usd_cents,
           pv.discount_percent, pv.stock, pv.is_active,
           p.is_active as product_active
      into v_variant
    from public.product_variants pv
    join public.products p on p.id = pv.product_id
    where pv.id = v_variant_id
    for update of pv;

    if not found or not v_variant.is_active or not v_variant.product_active then
      raise exception 'A product in your cart is no longer available';
    end if;

    if v_variant.stock < v_quantity then
      raise exception 'Insufficient stock for one or more products';
    end if;

    if v_currency = 'USD' then
      v_base_price := coalesce(
        v_variant.price_usd_cents,
        round(v_variant.price_irr::numeric / 25000)::bigint
      );
    else
      v_base_price := v_variant.price_irr;
    end if;

    v_unit_price := round(v_base_price * (1 - coalesce(v_variant.discount_percent, 0) / 100))::bigint;
    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
  end loop;

  v_shipping := case
    when v_free_threshold is not null and v_subtotal >= v_free_threshold then 0
    else v_shipping_fee
  end;
  v_total := v_subtotal + v_shipping;

  v_customer := jsonb_build_object(
    'name', trim(p_customer->>'name'),
    'phone', trim(p_customer->>'phone'),
    'email', nullif(trim(coalesce(p_customer->>'email', '')), ''),
    'city', trim(p_customer->>'city'),
    'address', trim(p_customer->>'address'),
    'postal', nullif(trim(coalesce(p_customer->>'postal', '')), ''),
    'note', nullif(trim(coalesce(p_customer->>'note', '')), ''),
    'market', p_market,
    'currency', v_currency
  );

  v_order_code := 'ROS-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));

  insert into public.orders (
    user_id, code, market, currency, subtotal, shipping, total, customer, status
  )
  values (
    v_user_id, v_order_code, p_market, v_currency,
    v_subtotal, v_shipping, v_total, v_customer, 'pending'
  )
  returning id into v_order_id;

  -- Insert trusted product snapshots and authoritative prices.
  for v_item in
    select value
    from jsonb_array_elements(p_items)
    order by value->>'variantId'
  loop
    v_variant_id := (v_item->>'variantId')::uuid;
    v_quantity := (v_item->>'qty')::integer;

    select
      pv.product_id,
      case when v_currency = 'USD'
        then coalesce(pv.price_usd_cents, round(pv.price_irr::numeric / 25000)::bigint)
        else pv.price_irr
      end,
      pv.discount_percent,
      pv.sku,
      pv.option_values
    into v_product_id, v_base_price, v_discount, v_sku, v_options
    from public.product_variants pv
    where pv.id = v_variant_id;

    v_unit_price := round(v_base_price * (1 - coalesce(v_discount, 0) / 100))::bigint;
    v_line_total := v_unit_price * v_quantity;

    select jsonb_build_object(
      'productId', p.id,
      'title', coalesce((
        select jsonb_object_agg(
          pt.lang,
          jsonb_build_object(
            'title', pt.title,
            'description', coalesce(pt.description, ''),
            'features', coalesce(pt.features, '[]'::jsonb)
          )
        )
        from public.product_translations pt
        where pt.product_id = p.id
      ), '{}'::jsonb),
      'brand', coalesce(b.name, ''),
      'category', p.category,
      'images', coalesce((
        select jsonb_agg(pi.image_url order by pi.is_primary desc, pi.sort_order)
        from public.product_images pi
        where pi.product_id = p.id
      ), '[]'::jsonb),
      'variantId', pv.id,
      'variant', jsonb_build_object(
        'id', pv.id,
        'sku', pv.sku,
        'optionValues', pv.option_values
      )
    )
    into v_snapshot
    from public.products p
    join public.product_variants pv on pv.product_id = p.id and pv.id = v_variant_id
    left join public.brands b on b.id = p.brand_id
    where p.id = v_product_id;

    insert into public.order_items (
      order_id, product_id, variant_id, product_snapshot,
      quantity, unit_price, line_total
    )
    values (
      v_order_id, v_product_id, v_variant_id, v_snapshot,
      v_quantity, v_unit_price, v_line_total
    );
  end loop;

  return v_order_code;
end;
$function$;

revoke all on function public.create_order_secure(text, jsonb, jsonb) from public;
revoke all on function public.create_order_secure(text, jsonb, jsonb) from anon;
grant execute on function public.create_order_secure(text, jsonb, jsonb) to authenticated;
