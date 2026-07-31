-- =====================================================================
-- LUMÉRA — Sample Products Seed Data
-- Run this AFTER schema.sql to populate your store with 12 products.
-- Replace image URLs with your own uploaded images from Supabase Storage.
-- =====================================================================

insert into public.products (name, slug, description, price, sale_price, category, images, sizes, colors, stock, rating, reviews_count, is_new, is_bestseller, is_featured, is_active, specs) values

-- ============ WOMEN ============
(
  'Cashmere Wrap Coat',
  'cashmere-wrap-coat',
  'A timeless silhouette in pure cashmere. Hand-finished with horn buttons and a tailored waist.',
  8900, 7500,
  'women',
  array['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800'],
  array['XS','S','M','L','XL'],
  '[{"name":"Camel","hex":"#C8A96A"},{"name":"Black","hex":"#111111"},{"name":"Ivory","hex":"#F5F0E8"}]'::jsonb,
  12, 4.9, 47, false, true, true, true,
  '{"material":"100% Cashmere","origin":"Italy","care":"Dry clean only","fit":"Tailored"}'::jsonb
),

(
  'Silk Midi Dress',
  'silk-midi-dress',
  'Fluid silk dress with subtle sheen. A modern essential cut on the bias for an effortless drape.',
  5400, null,
  'women',
  array['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
  array['XS','S','M','L'],
  '[{"name":"Black","hex":"#111111"},{"name":"Burgundy","hex":"#6B1F2C"},{"name":"Champagne","hex":"#E8D5B7"}]'::jsonb,
  8, 4.8, 31, true, false, true, true,
  '{"material":"100% Mulberry Silk","origin":"France","care":"Hand wash cold","fit":"Bias cut"}'::jsonb
),

(
  'Leather Tote — Mini',
  'leather-tote-mini',
  'Compact yet considered. Vegetable-tanned Italian leather with hand-stitched detailing.',
  4200, null,
  'women',
  array['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800'],
  array['One Size'],
  '[{"name":"Cognac","hex":"#8B5A2B"},{"name":"Black","hex":"#111111"},{"name":"Bone","hex":"#E8DCC4"}]'::jsonb,
  15, 4.9, 62, false, true, true, true,
  '{"material":"Italian Veg-Tan Leather","origin":"Italy","dimensions":"28 × 22 × 12 cm"}'::jsonb
),

-- ============ MEN ============
(
  'Wool Overcoat — Slim',
  'wool-overcoat-slim',
  'Single-breasted overcoat in a refined Italian wool blend. Clean lines, modern proportions.',
  7800, 6500,
  'men',
  array['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'],
  array['S','M','L','XL','XXL'],
  '[{"name":"Charcoal","hex":"#3A3A3A"},{"name":"Camel","hex":"#C8A96A"},{"name":"Navy","hex":"#1B2845"}]'::jsonb,
  10, 4.8, 28, true, false, true, true,
  '{"material":"80% Wool, 20% Cashmere","origin":"Italy","care":"Dry clean only","fit":"Slim"}'::jsonb
),

(
  'Cotton Oxford Shirt',
  'cotton-oxford-shirt',
  'The essential oxford, perfected. Long-staple Egyptian cotton with a soft hand and clean drape.',
  1800, null,
  'men',
  array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800'],
  array['S','M','L','XL'],
  '[{"name":"White","hex":"#FFFFFF"},{"name":"Sky","hex":"#B8D4E3"},{"name":"Pink","hex":"#F4C2C2"}]'::jsonb,
  25, 4.7, 89, false, true, false, true,
  '{"material":"100% Egyptian Cotton","origin":"Portugal","fit":"Regular"}'::jsonb
),

(
  'Leather Derby Shoes',
  'leather-derby-shoes',
  'Goodyear-welted derbies in supple calfskin. Built to be resoled and worn for decades.',
  6200, null,
  'men',
  array['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800'],
  array['40','41','42','43','44','45'],
  '[{"name":"Black","hex":"#111111"},{"name":"Brown","hex":"#5C3A21"}]'::jsonb,
  7, 4.9, 34, false, true, true, true,
  '{"material":"Calfskin Leather","construction":"Goodyear Welted","origin":"England"}'::jsonb
),

-- ============ ACCESSORIES ============
(
  'Silk Scarf — Atelier',
  'silk-scarf-atelier',
  'Hand-rolled edges, archive-inspired print. A 90cm square of pure mulberry silk.',
  1900, 1500,
  'accessories',
  array['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800', 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800'],
  array['One Size'],
  '[{"name":"Gold","hex":"#C8A96A"},{"name":"Black","hex":"#111111"},{"name":"Ivory","hex":"#F5F0E8"}]'::jsonb,
  20, 4.8, 52, false, false, true, true,
  '{"material":"100% Silk Twill","dimensions":"90 × 90 cm","origin":"France"}'::jsonb
),

(
  'Minimalist Watch — 36mm',
  'minimalist-watch-36mm',
  'Swiss quartz movement, sapphire crystal, Italian leather strap. Quietly precise.',
  4800, null,
  'accessories',
  array['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
  array['One Size'],
  '[{"name":"Silver/Black","hex":"#1A1A1A"},{"name":"Gold/Brown","hex":"#8B5A2B"}]'::jsonb,
  14, 4.9, 41, true, true, true, true,
  '{"movement":"Swiss Quartz","case":"36mm Stainless","crystal":"Sapphire","strap":"Italian Leather"}'::jsonb
),

(
  'Aviator Sunglasses',
  'aviator-sunglasses',
  'Hand-polished titanium frame with Carl Zeiss lenses. Lightweight, considered, enduring.',
  2900, null,
  'accessories',
  array['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'],
  array['One Size'],
  '[{"name":"Gold/Green","hex":"#C8A96A"},{"name":"Silver/Gray","hex":"#888888"}]'::jsonb,
  18, 4.7, 56, false, true, false, true,
  '{"frame":"Titanium","lens":"Carl Zeiss","origin":"Japan"}'::jsonb
),

-- ============ MORE ============
(
  'Knit Cashmere Sweater',
  'knit-cashmere-sweater',
  'A clean, modern sweater in 12-gauge Mongolian cashmere. Soft, warm, and refined.',
  3900, null,
  'women',
  array['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
  array['XS','S','M','L'],
  '[{"name":"Cream","hex":"#F5F0E8"},{"name":"Black","hex":"#111111"},{"name":"Camel","hex":"#C8A96A"}]'::jsonb,
  9, 4.8, 38, true, false, true, true,
  '{"material":"100% Mongolian Cashmere","gauge":"12gg","origin":"Scotland"}'::jsonb
),

(
  'Linen Suit — Two Piece',
  'linen-suit-two-piece',
  'Lightweight Italian linen tailored to a relaxed silhouette. The warm-weather uniform.',
  9200, 7900,
  'men',
  array['https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'],
  array['S','M','L','XL'],
  '[{"name":"Sand","hex":"#D4B896"},{"name":"Stone","hex":"#A89F8A"},{"name":"White","hex":"#FFFFFF"}]'::jsonb,
  6, 4.9, 22, true, false, true, true,
  '{"material":"100% Italian Linen","origin":"Italy","fit":"Relaxed Tailored"}'::jsonb
),

(
  'Leather Card Holder',
  'leather-card-holder',
  'Slim profile, full-grain leather, six card slots. Patinas beautifully with use.',
  1200, null,
  'accessories',
  array['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=800'],
  array['One Size'],
  '[{"name":"Black","hex":"#111111"},{"name":"Cognac","hex":"#8B5A2B"}]'::jsonb,
  30, 4.8, 73, false, true, false, true,
  '{"material":"Full-Grain Calfskin","origin":"Italy","slots":"6"}'::jsonb
);

-- =====================================================================
-- DONE. Verify with: select count(*) from public.products;
-- =====================================================================
