import { mkdirSync, writeFileSync } from "node:fs";
import { products, brands } from "../src/data.ts";

const q = (value) =>
  value === null || value === undefined
    ? "NULL"
    : "'" + String(value).replace(/'/g, "''") + "'";

const json = (value) => `${q(JSON.stringify(value))}::jsonb`;

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const allBrands = [...new Set([
  ...brands,
  ...products.map((product) => product.brand),
])];

const statements = [
  "-- ROSA V2 catalog import",
  "-- Generated from src/data.ts",
  "begin;",
];

// 1. Brands
for (const [index, name] of allBrands.entries()) {
  const slug = slugify(name);

  statements.push(`
insert into public.brands (name, slug, is_active, sort_order)
values (${q(name)}, ${q(slug)}, true, ${index})
on conflict (slug) do update
set name = excluded.name,
    is_active = true;
`);
}

// 2. Products
for (const product of products) {
  const brandSlug = slugify(product.brand);
  const productSlug = `rosa-${product.id}`;

  statements.push(`
insert into public.products
  (id, brand_id, slug, category, badge, rating, is_active)
values (
  ${q(product.id)},
  (select id from public.brands where slug = ${q(brandSlug)}),
  ${q(productSlug)},
  ${q(product.category)},
  ${q(product.badge ?? null)},
  ${product.rating},
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
`);

  // 3. Translations
  for (const lang of ["fa", "en", "ar"]) {
    statements.push(`
insert into public.product_translations
  (product_id, lang, title, features)
values (
  ${q(product.id)},
  ${q(lang)},
  ${q(product.title[lang])},
  '[]'::jsonb
)
on conflict (product_id, lang) do update
set title = excluded.title;
`);
  }

  // 4. Default variant
  statements.push(`
insert into public.product_variants
  (product_id, sku, option_values, price_irr,
   price_usd_cents, discount_percent, stock, is_active, sort_order)
values (
  ${q(product.id)},
  ${q(`${product.id}-default`)},
  '{"label":"Default"}'::jsonb,
  ${product.price},
  NULL,
  ${product.discount ?? 0},
  ${product.stock},
  true,
  0
)
on conflict (sku) do update
set price_irr = excluded.price_irr,
    price_usd_cents = excluded.price_usd_cents,
    discount_percent = excluded.discount_percent,
    stock = excluded.stock,
    is_active = true;
`);

  // 5. Images: replace existing images for this product
  statements.push(`
delete from public.product_images
where product_id = ${q(product.id)};
`);

  for (const [index, imageUrl] of product.images.entries()) {
    statements.push(`
insert into public.product_images
  (product_id, image_url, alt_text, is_primary, sort_order)
values (
  ${q(product.id)},
  ${q(imageUrl)},
  ${json(product.title)},
  ${index === 0 ? "true" : "false"},
  ${index}
);
`);
  }
}

statements.push("commit;");

mkdirSync("supabase", { recursive: true });

writeFileSync(
  "supabase/seed-catalog.sql",
  statements.join("\n"),
  "utf8"
);

console.log("Catalog SQL generated successfully.");
console.log(`Products: ${products.length}`);
console.log(`Brands: ${allBrands.length}`);
console.log(
  `Translations: ${products.length * 3}`
);
console.log(
  `Images: ${products.reduce((sum, p) => sum + p.images.length, 0)}`
);
console.log("Output: supabase/seed-catalog.sql");
