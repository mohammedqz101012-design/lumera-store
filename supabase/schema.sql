-- =====================================================================
-- LUMÉRA — Database Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- =====================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- 1. PRODUCTS
-- =====================================================================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2) not null default 0,
  sale_price decimal(10,2),
  category text not null check (category in ('women', 'men', 'accessories', 'new', 'sale')),
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb,
  stock int not null default 0,
  rating decimal(2,1) default 0,
  reviews_count int default 0,
  is_new boolean default false,
  is_bestseller boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  specs jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_featured on public.products(is_featured);

-- =====================================================================
-- 2. ORDERS
-- =====================================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  country text default 'Egypt',
  postal_code text,
  subtotal decimal(10,2) not null,
  shipping decimal(10,2) default 0,
  tax decimal(10,2) default 0,
  total decimal(10,2) not null,
  payment_method text not null check (payment_method in ('cod', 'vodafone_cash', 'instapay', 'bank_transfer')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_email on public.orders(email);

-- =====================================================================
-- 3. ORDER ITEMS
-- =====================================================================
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  size text,
  color text,
  quantity int not null default 1,
  price decimal(10,2) not null,
  subtotal decimal(10,2) not null,
  created_at timestamptz default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- =====================================================================
-- 4. SETTINGS (key-value store)
-- =====================================================================
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Seed default settings
insert into public.settings (key, value) values
  ('brand_name', '"LUMÉRA"'::jsonb),
  ('brand_phone', '"+20 100 000 0000"'::jsonb),
  ('brand_email', '"care@lumera.com"'::jsonb),
  ('brand_address', '"Cairo, Egypt"'::jsonb),
  ('brand_instagram', '"https://instagram.com/lumera"'::jsonb),
  ('brand_facebook', '"https://facebook.com/lumera"'::jsonb),
  ('brand_tiktok', '"https://tiktok.com/@lumera"'::jsonb),
  ('shipping_fee', '60'::jsonb),
  ('free_shipping_threshold', '3000'::jsonb),
  ('tax_rate', '0'::jsonb),
  ('payment_methods', '[
    {"id":"cod","label":"Cash on Delivery","enabled":true,"instructions":"Pay when you receive your order."},
    {"id":"vodafone_cash","label":"Vodafone Cash","enabled":true,"instructions":"Send to 01000000000."},
    {"id":"instapay","label":"InstaPay","enabled":true,"instructions":"Send to care@lumera"},
    {"id":"bank_transfer","label":"Bank Transfer","enabled":false,"instructions":""}
  ]'::jsonb),
  ('meta_title', '"LUMÉRA — Modern Luxury Fashion"'::jsonb),
  ('meta_description', '"Discover LUMÉRA — curated luxury fashion for the modern individual."'::jsonb)
on conflict (key) do nothing;

-- =====================================================================
-- 5. CUSTOMERS (registered users, separate from admin)
-- =====================================================================
create table if not exists public.customers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- =====================================================================
-- 6. UPDATED_AT TRIGGER
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated
  before update on public.settings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 7. ORDER NUMBER GENERATOR
-- =====================================================================
create or replace function public.generate_order_number()
returns text as $$
declare
  new_number text;
  exists_check boolean;
begin
  loop
    new_number := 'LUM-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
    select exists(select 1 from public.orders where order_number = new_number) into exists_check;
    exit when not exists_check;
  end loop;
  return new_number;
end;
$$ language plpgsql;

-- =====================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Products: public read, only admin write
alter table public.products enable row level security;

drop policy if exists "products_read_all" on public.products;
create policy "products_read_all" on public.products
  for select using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders: public insert (checkout), admin read/update
alter table public.orders enable row level security;

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert with check (true);

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read" on public.orders
  for select using (auth.role() = 'authenticated');

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (auth.role() = 'authenticated');

-- Order items: same as orders
alter table public.order_items enable row level security;

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert with check (true);

drop policy if exists "order_items_admin_read" on public.order_items;
create policy "order_items_admin_read" on public.order_items
  for select using (auth.role() = 'authenticated');

-- Settings: public read, admin write
alter table public.settings enable row level security;

drop policy if exists "settings_read_all" on public.settings;
create policy "settings_read_all" on public.settings for select using (true);

drop policy if exists "settings_admin_write" on public.settings;
create policy "settings_admin_write" on public.settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Customers: public insert, admin read
alter table public.customers enable row level security;

drop policy if exists "customers_public_insert" on public.customers;
create policy "customers_public_insert" on public.customers
  for insert with check (true);

drop policy if exists "customers_admin_read" on public.customers;
create policy "customers_admin_read" on public.customers
  for select using (auth.role() = 'authenticated');

-- =====================================================================
-- 9. STORAGE BUCKET for product images
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Allow public read
drop policy if exists "products_storage_read" on storage.objects;
create policy "products_storage_read" on storage.objects
  for select using (bucket_id = 'products');

-- Allow admin write
drop policy if exists "products_storage_write" on storage.objects;
create policy "products_storage_write" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');

drop policy if exists "products_storage_update" on storage.objects;
create policy "products_storage_update" on storage.objects
  for update using (bucket_id = 'products' and auth.role() = 'authenticated');

drop policy if exists "products_storage_delete" on storage.objects;
create policy "products_storage_delete" on storage.objects
  for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

-- =====================================================================
-- 10. SEED: Admin user (run this AFTER creating admin in Supabase Auth)
-- =====================================================================
-- 1. Go to Supabase Dashboard > Authentication > Users > Add User
-- 2. Create user with email/password
-- 3. Copy the user's UUID
-- 4. Uncomment & run the INSERT below (replace the UUID):
--
-- insert into auth.users_metadata (id, is_admin) values ('USER-UUID-HERE', true);
-- Or just rely on auth.role() = 'authenticated' for admin checks.

-- =====================================================================
-- DONE. Run this once, then test by inserting a sample product.
-- =====================================================================
