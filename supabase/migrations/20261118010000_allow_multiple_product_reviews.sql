-- Allow the same signed-in customer to submit multiple reviews for one product.
alter table public.product_reviews
  drop constraint if exists product_reviews_product_id_user_id_key;
