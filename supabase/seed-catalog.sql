-- ROSA V2 catalog import
-- Generated from src/data.ts
begin;

insert into public.brands (name, slug, is_active, sort_order)
values ('L''Oréal', 'l-oreal', true, 0)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Maybelline', 'maybelline', true, 1)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Chanel', 'chanel', true, 2)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Dior', 'dior', true, 3)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Estée Lauder', 'estee-lauder', true, 4)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('NARS', 'nars', true, 5)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Huda Beauty', 'huda-beauty', true, 6)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Benefit', 'benefit', true, 7)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Vitaler', 'vitaler', true, 8)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Biomarine', 'biomarine', true, 9)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('The Ordinary', 'the-ordinary', true, 10)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('La Roche-Posay', 'la-roche-posay', true, 11)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Tom Ford', 'tom-ford', true, 12)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Armani', 'armani', true, 13)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Moroccanoil', 'moroccanoil', true, 14)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Paula''s Choice', 'paula-s-choice', true, 15)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Real Techniques', 'real-techniques', true, 16)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Essence', 'essence', true, 17)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Giorgio Armani', 'giorgio-armani', true, 18)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Victoria''s Secret', 'victoria-s-secret', true, 19)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('L''Oréal Pro', 'l-oreal-pro', true, 20)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.brands (name, slug, is_active, sort_order)
values ('Garnier', 'garnier', true, 21)
on conflict (slug) do update
set name = excluded.name,
    is_active = true;


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  's1',
  (select id from public.brands where slug = 'the-ordinary'),
  'rosa-s1',
  'skincare',
  'bestseller',
  4.9,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's1',
  'fa',
  'سرم هیالورونیک اسید آبرسان ۳۰ میل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's1',
  'en',
  'Hyaluronic Acid Hydrating Serum 30ml',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's1',
  'ar',
  'سيروم حمض الهيالورونيك المرطب ٣٠ مل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  's1',
  's1-default',
  '{"label":"Default"}'::jsonb,
  598500,
  NULL,
  25,
  24,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 's1';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's1',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم هیالورونیک اسید آبرسان ۳۰ میل","en":"Hyaluronic Acid Hydrating Serum 30ml","ar":"سيروم حمض الهيالورونيك المرطب ٣٠ مل"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's1',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم هیالورونیک اسید آبرسان ۳۰ میل","en":"Hyaluronic Acid Hydrating Serum 30ml","ar":"سيروم حمض الهيالورونيك المرطب ٣٠ مل"}'::jsonb,
  false,
  1
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's1',
  'https://images.unsplash.com/photo-1522335789203-aaa0bdf829ab?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم هیالورونیک اسید آبرسان ۳۰ میل","en":"Hyaluronic Acid Hydrating Serum 30ml","ar":"سيروم حمض الهيالورونيك المرطب ٣٠ مل"}'::jsonb,
  false,
  2
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  's2',
  (select id from public.brands where slug = 'biomarine'),
  'rosa-s2',
  'skincare',
  NULL,
  4.4,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's2',
  'fa',
  'کرم دور چشم کلاژن ضد پف',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's2',
  'en',
  'Collagen Anti-puff Eye Cream',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's2',
  'ar',
  'كريم العين المضاد للانتفاخ بالكولاجين',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  's2',
  's2-default',
  '{"label":"Default"}'::jsonb,
  1545000,
  NULL,
  22,
  12,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 's2';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's2',
  'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=70',
  '{"fa":"کرم دور چشم کلاژن ضد پف","en":"Collagen Anti-puff Eye Cream","ar":"كريم العين المضاد للانتفاخ بالكولاجين"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's2',
  'https://images.unsplash.com/photo-1522335789203-aaa0bdf829ab?auto=format&fit=crop&w=800&q=70',
  '{"fa":"کرم دور چشم کلاژن ضد پف","en":"Collagen Anti-puff Eye Cream","ar":"كريم العين المضاد للانتفاخ بالكولاجين"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  's3',
  (select id from public.brands where slug = 'vitaler'),
  'rosa-s3',
  'skincare',
  NULL,
  4.3,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's3',
  'fa',
  'تونر پاک کننده پوست مختلط',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's3',
  'en',
  'Toner for Combination Skin',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's3',
  'ar',
  'تونر البشرة المختلطة',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  's3',
  's3-default',
  '{"label":"Default"}'::jsonb,
  438900,
  NULL,
  18,
  30,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 's3';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's3',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70',
  '{"fa":"تونر پاک کننده پوست مختلط","en":"Toner for Combination Skin","ar":"تونر البشرة المختلطة"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's3',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=70',
  '{"fa":"تونر پاک کننده پوست مختلط","en":"Toner for Combination Skin","ar":"تونر البشرة المختلطة"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  's4',
  (select id from public.brands where slug = 'la-roche-posay'),
  'rosa-s4',
  'skincare',
  'bestseller',
  4.8,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's4',
  'fa',
  'کرم ضد آفتاب SPF50 بی رنگ',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's4',
  'en',
  'Invisible SPF50 Sunscreen',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's4',
  'ar',
  'واقٍ شمسي شفاف SPF50',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  's4',
  's4-default',
  '{"label":"Default"}'::jsonb,
  985000,
  NULL,
  20,
  18,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 's4';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's4',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=70',
  '{"fa":"کرم ضد آفتاب SPF50 بی رنگ","en":"Invisible SPF50 Sunscreen","ar":"واقٍ شمسي شفاف SPF50"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's4',
  'https://images.unsplash.com/photo-1522335789203-aaa0bdf829ab?auto=format&fit=crop&w=800&q=70',
  '{"fa":"کرم ضد آفتاب SPF50 بی رنگ","en":"Invisible SPF50 Sunscreen","ar":"واقٍ شمسي شفاف SPF50"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  's5',
  (select id from public.brands where slug = 'paula-s-choice'),
  'rosa-s5',
  'skincare',
  NULL,
  4.7,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's5',
  'fa',
  'لایه بردار AHA 10 درصد شب',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's5',
  'en',
  '10% AHA Night Exfoliant',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's5',
  'ar',
  'مقشر ليلي AHA ١٠٪',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  's5',
  's5-default',
  '{"label":"Default"}'::jsonb,
  1120000,
  NULL,
  15,
  9,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 's5';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's5',
  'https://images.unsplash.com/photo-1522335789203-aaa0bdf829ab?auto=format&fit=crop&w=800&q=70',
  '{"fa":"لایه بردار AHA 10 درصد شب","en":"10% AHA Night Exfoliant","ar":"مقشر ليلي AHA ١٠٪"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's5',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70',
  '{"fa":"لایه بردار AHA 10 درصد شب","en":"10% AHA Night Exfoliant","ar":"مقشر ليلي AHA ١٠٪"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  's6',
  (select id from public.brands where slug = 'the-ordinary'),
  'rosa-s6',
  'skincare',
  'bestseller',
  4.9,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's6',
  'fa',
  'سرم نیاسینامید ۱۰٪ + روی',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's6',
  'en',
  'Niacinamide 10% + Zinc Serum',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  's6',
  'ar',
  'سيروم النياسيناميد ١٠٪ + الزنك',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  's6',
  's6-default',
  '{"label":"Default"}'::jsonb,
  489000,
  NULL,
  28,
  40,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 's6';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's6',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم نیاسینامید ۱۰٪ + روی","en":"Niacinamide 10% + Zinc Serum","ar":"سيروم النياسيناميد ١٠٪ + الزنك"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  's6',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم نیاسینامید ۱۰٪ + روی","en":"Niacinamide 10% + Zinc Serum","ar":"سيروم النياسيناميد ١٠٪ + الزنك"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'm1',
  (select id from public.brands where slug = 'huda-beauty'),
  'rosa-m1',
  'makeup',
  NULL,
  4.7,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm1',
  'fa',
  'رژ لب مایع مات مخملی رزگلد',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm1',
  'en',
  'Rose Gold Velvet Matte Liquid Lipstick',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm1',
  'ar',
  'أحمر شفاه سائل مخملي روزگولد',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'm1',
  'm1-default',
  '{"label":"Default"}'::jsonb,
  1290000,
  NULL,
  15,
  20,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'm1';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm1',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=70',
  '{"fa":"رژ لب مایع مات مخملی رزگلد","en":"Rose Gold Velvet Matte Liquid Lipstick","ar":"أحمر شفاه سائل مخملي روزگولد"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm1',
  'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=800&q=70',
  '{"fa":"رژ لب مایع مات مخملی رزگلد","en":"Rose Gold Velvet Matte Liquid Lipstick","ar":"أحمر شفاه سائل مخملي روزگولد"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'm2',
  (select id from public.brands where slug = 'maybelline'),
  'rosa-m2',
  'makeup',
  NULL,
  4.5,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm2',
  'fa',
  'ریمل حجم دهنده پر پشت کننده',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm2',
  'en',
  'Volumizing Lash Mascara',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm2',
  'ar',
  'ماسكارا للرموش الكثيفة',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'm2',
  'm2-default',
  '{"label":"Default"}'::jsonb,
  489000,
  NULL,
  20,
  50,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'm2';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm2',
  'https://images.unsplash.com/photo-1590156206657-3d5c2b7a0a51?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ریمل حجم دهنده پر پشت کننده","en":"Volumizing Lash Mascara","ar":"ماسكارا للرموش الكثيفة"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm2',
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ریمل حجم دهنده پر پشت کننده","en":"Volumizing Lash Mascara","ar":"ماسكارا للرموش الكثيفة"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'm3',
  (select id from public.brands where slug = 'estee-lauder'),
  'rosa-m3',
  'makeup',
  'luxury',
  4.8,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm3',
  'fa',
  'کرم پودر پوشش بالا ۳۵ گرم',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm3',
  'en',
  'Full-Coverage Foundation 35g',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm3',
  'ar',
  'كريم أساس كامل التغطية ٣٥غ',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'm3',
  'm3-default',
  '{"label":"Default"}'::jsonb,
  2890000,
  NULL,
  10,
  8,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'm3';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm3',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=70',
  '{"fa":"کرم پودر پوشش بالا ۳۵ گرم","en":"Full-Coverage Foundation 35g","ar":"كريم أساس كامل التغطية ٣٥غ"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm3',
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=70',
  '{"fa":"کرم پودر پوشش بالا ۳۵ گرم","en":"Full-Coverage Foundation 35g","ar":"كريم أساس كامل التغطية ٣٥غ"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'm4',
  (select id from public.brands where slug = 'real-techniques'),
  'rosa-m4',
  'makeup',
  NULL,
  4.6,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm4',
  'fa',
  'ست براش آرایشی حرفه ای ۱۲ عددی',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm4',
  'en',
  'Pro 12-Piece Makeup Brush Set',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm4',
  'ar',
  'مجموعة فرش احترافية ١٢ قطعة',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'm4',
  'm4-default',
  '{"label":"Default"}'::jsonb,
  1890000,
  NULL,
  22,
  15,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'm4';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm4',
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ست براش آرایشی حرفه ای ۱۲ عددی","en":"Pro 12-Piece Makeup Brush Set","ar":"مجموعة فرش احترافية ١٢ قطعة"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm4',
  'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ست براش آرایشی حرفه ای ۱۲ عددی","en":"Pro 12-Piece Makeup Brush Set","ar":"مجموعة فرش احترافية ١٢ قطعة"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'm5',
  (select id from public.brands where slug = 'nars'),
  'rosa-m5',
  'makeup',
  NULL,
  4.7,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm5',
  'fa',
  'هایلایتر پودری درخشان کننده',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm5',
  'en',
  'Powder Highlighter — Luminous',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm5',
  'ar',
  'هايلايتر بودرة ذو لمعة',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'm5',
  'm5-default',
  '{"label":"Default"}'::jsonb,
  2150000,
  NULL,
  12,
  11,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'm5';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm5',
  'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=800&q=70',
  '{"fa":"هایلایتر پودری درخشان کننده","en":"Powder Highlighter — Luminous","ar":"هايلايتر بودرة ذو لمعة"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm5',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=70',
  '{"fa":"هایلایتر پودری درخشان کننده","en":"Powder Highlighter — Luminous","ar":"هايلايتر بودرة ذو لمعة"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'm6',
  (select id from public.brands where slug = 'essence'),
  'rosa-m6',
  'makeup',
  NULL,
  4.3,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm6',
  'fa',
  'لاک ناخن ژله ای کوئیک درای',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm6',
  'en',
  'Quick-Dry Gel Nail Polish',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'm6',
  'ar',
  'طلاء أظافر جل سريع الجفاف',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'm6',
  'm6-default',
  '{"label":"Default"}'::jsonb,
  189000,
  NULL,
  30,
  60,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'm6';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm6',
  'https://images.unsplash.com/photo-1613454320437-0c228c8b1723?auto=format&fit=crop&w=800&q=70',
  '{"fa":"لاک ناخن ژله ای کوئیک درای","en":"Quick-Dry Gel Nail Polish","ar":"طلاء أظافر جل سريع الجفاف"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'm6',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=70',
  '{"fa":"لاک ناخن ژله ای کوئیک درای","en":"Quick-Dry Gel Nail Polish","ar":"طلاء أظافر جل سريع الجفاف"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'p1',
  (select id from public.brands where slug = 'tom-ford'),
  'rosa-p1',
  'perfume',
  'luxury',
  4.9,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p1',
  'fa',
  'عطر ادو پرفیوم رز نویر ۱۰۰ میل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p1',
  'en',
  'Rose Noir Eau de Parfum 100ml',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p1',
  'ar',
  'عطر روز نوار أو دو برفيوم ١٠٠ مل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'p1',
  'p1-default',
  '{"label":"Default"}'::jsonb,
  8990000,
  NULL,
  10,
  4,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'p1';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p1',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=70',
  '{"fa":"عطر ادو پرفیوم رز نویر ۱۰۰ میل","en":"Rose Noir Eau de Parfum 100ml","ar":"عطر روز نوار أو دو برفيوم ١٠٠ مل"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p1',
  'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=70',
  '{"fa":"عطر ادو پرفیوم رز نویر ۱۰۰ میل","en":"Rose Noir Eau de Parfum 100ml","ar":"عطر روز نوار أو دو برفيوم ١٠٠ مل"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'p2',
  (select id from public.brands where slug = 'giorgio-armani'),
  'rosa-p2',
  'perfume',
  'luxury',
  4.8,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p2',
  'fa',
  'عطر زنانه مای وی ۵۰ میل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p2',
  'en',
  'My Way Eau de Parfum 50ml',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p2',
  'ar',
  'عطر ماي واي ٥٠ مل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'p2',
  'p2-default',
  '{"label":"Default"}'::jsonb,
  5290000,
  NULL,
  15,
  7,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'p2';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p2',
  'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=70',
  '{"fa":"عطر زنانه مای وی ۵۰ میل","en":"My Way Eau de Parfum 50ml","ar":"عطر ماي واي ٥٠ مل"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p2',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=70',
  '{"fa":"عطر زنانه مای وی ۵۰ میل","en":"My Way Eau de Parfum 50ml","ar":"عطر ماي واي ٥٠ مل"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'p3',
  (select id from public.brands where slug = 'victoria-s-secret'),
  'rosa-p3',
  'perfume',
  NULL,
  4.6,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p3',
  'fa',
  'ادو تویلت بدن اسپری ملایم',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p3',
  'en',
  'Body Mist — Soft Eau de Toilette',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p3',
  'ar',
  'رذاذ الجسم أو دو توالت',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'p3',
  'p3-default',
  '{"label":"Default"}'::jsonb,
  1490000,
  NULL,
  25,
  22,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'p3';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p3',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ادو تویلت بدن اسپری ملایم","en":"Body Mist — Soft Eau de Toilette","ar":"رذاذ الجسم أو دو توالت"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p3',
  'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ادو تویلت بدن اسپری ملایم","en":"Body Mist — Soft Eau de Toilette","ar":"رذاذ الجسم أو دو توالت"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'p4',
  (select id from public.brands where slug = 'dior'),
  'rosa-p4',
  'perfume',
  NULL,
  4.7,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p4',
  'fa',
  'عطر جیبی رز ۲۵ میل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p4',
  'en',
  'Rose Pocket Perfume 25ml',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'p4',
  'ar',
  'عطر الجيب الوردي ٢٥ مل',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'p4',
  'p4-default',
  '{"label":"Default"}'::jsonb,
  2890000,
  NULL,
  12,
  10,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'p4';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'p4',
  'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=70',
  '{"fa":"عطر جیبی رز ۲۵ میل","en":"Rose Pocket Perfume 25ml","ar":"عطر الجيب الوردي ٢٥ مل"}'::jsonb,
  true,
  0
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'h1',
  (select id from public.brands where slug = 'l-oreal-pro'),
  'rosa-h1',
  'haircare',
  NULL,
  4.6,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h1',
  'fa',
  'شامپو تقویت کننده کراتینه',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h1',
  'en',
  'Keratin Strengthening Shampoo',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h1',
  'ar',
  'شامبو الكيراتين المقوي',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'h1',
  'h1-default',
  '{"label":"Default"}'::jsonb,
  689000,
  NULL,
  18,
  35,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'h1';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'h1',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=70',
  '{"fa":"شامپو تقویت کننده کراتینه","en":"Keratin Strengthening Shampoo","ar":"شامبو الكيراتين المقوي"}'::jsonb,
  true,
  0
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'h2',
  (select id from public.brands where slug = 'moroccanoil'),
  'rosa-h2',
  'haircare',
  NULL,
  4.8,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h2',
  'fa',
  'ماسک مو آرگان ترمیم کننده',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h2',
  'en',
  'Argan Hair Repair Mask',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h2',
  'ar',
  'ماسك الأرغان لإصلاح الشعر',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'h2',
  'h2-default',
  '{"label":"Default"}'::jsonb,
  1390000,
  NULL,
  22,
  14,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'h2';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'h2',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ماسک مو آرگان ترمیم کننده","en":"Argan Hair Repair Mask","ar":"ماسك الأرغان لإصلاح الشعر"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'h2',
  'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=70',
  '{"fa":"ماسک مو آرگان ترمیم کننده","en":"Argan Hair Repair Mask","ar":"ماسك الأرغان لإصلاح الشعر"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'h3',
  (select id from public.brands where slug = 'vitaler'),
  'rosa-h3',
  'haircare',
  NULL,
  4.5,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h3',
  'fa',
  'سرم ضد ریزش مو تخصصی',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h3',
  'en',
  'Anti Hair-Loss Serum',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h3',
  'ar',
  'سيروم مضاد لتساقط الشعر',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'h3',
  'h3-default',
  '{"label":"Default"}'::jsonb,
  942000,
  NULL,
  25,
  20,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'h3';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'h3',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم ضد ریزش مو تخصصی","en":"Anti Hair-Loss Serum","ar":"سيروم مضاد لتساقط الشعر"}'::jsonb,
  true,
  0
);


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'h3',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=70',
  '{"fa":"سرم ضد ریزش مو تخصصی","en":"Anti Hair-Loss Serum","ar":"سيروم مضاد لتساقط الشعر"}'::jsonb,
  false,
  1
);


insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  'h4',
  (select id from public.brands where slug = 'garnier'),
  'rosa-h4',
  'haircare',
  NULL,
  4.3,
  true
)
on conflict (id) do update
set brand_id = excluded.brand_id,
    slug = excluded.slug,
    category = excluded.category,
    badge = excluded.badge,
    rating = excluded.rating,
    is_active = true,
    updated_at = now();


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h4',
  'fa',
  'روغن مو آبرسان درخشان کننده',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h4',
  'en',
  'Shine Hair Oil',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_translations
  (product_id, lang, title, features)
values (
  'h4',
  'ar',
  'زيت الشعر اللامع',
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;


insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  'h4',
  'h4-default',
  '{"label":"Default"}'::jsonb,
  389000,
  NULL,
  15,
  42,
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;


delete from public.product_images
where product_id = 'h4';


insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  'h4',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=70',
  '{"fa":"روغن مو آبرسان درخشان کننده","en":"Shine Hair Oil","ar":"زيت الشعر اللامع"}'::jsonb,
  true,
  0
);

commit;