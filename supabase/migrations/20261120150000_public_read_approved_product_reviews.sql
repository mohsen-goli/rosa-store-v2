-- Allow storefront visitors to read only moderated product reviews.
-- Existing authenticated policy continues to expose a user's own reviews
-- and approved reviews; pending/rejected reviews remain private to others.
create policy "public_read_approved_product_reviews"
on public.product_reviews
for select
to anon
using (status = 'approved');
