-- ============================================================
--  FOREVER FLOWERS — SUPABASE DATABASE SETUP
--  Run this SQL in: Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. PRODUCTS TABLE
create table if not exists products (
  id            serial primary key,
  name          text not null,
  price         decimal(10,2) not null,
  original_price decimal(10,2),
  image         text,
  badge         text,
  description   text,
  category      text default 'all',
  created_at    timestamp with time zone default now()
);

-- 2. ORDERS TABLE
create table if not exists orders (
  id              serial primary key,
  customer_name   text,
  customer_phone  text,
  items           jsonb,
  total           decimal(10,2),
  delivery_fee    decimal(10,2) default 0,
  delivery_type   text,         -- 'delivery' or 'pickup'
  location        text,
  payment_method  text,         -- 'mpesa' or 'pod'
  payment_status  text default 'pending',  -- 'pending', 'paid', 'pod', 'delivered', 'cancelled'
  paystack_ref    text,
  paid_at         timestamp with time zone,
  amount_paid     decimal(10,2),
  created_at      timestamp with time zone default now()
);

-- 3. ENABLE ROW LEVEL SECURITY
alter table products enable row level security;
alter table orders   enable row level security;

-- 4. POLICIES — Allow public to read products
create policy "Anyone can view products"
  on products for select using (true);

-- 5. POLICIES — Allow public to insert orders (for checkout)
create policy "Anyone can place an order"
  on orders for insert with check (true);

-- 6. POLICIES — Only authenticated (admin) can manage products
create policy "Admin can insert products"
  on products for insert to authenticated with check (true);

create policy "Admin can update products"
  on products for update to authenticated using (true);

create policy "Admin can delete products"
  on products for delete to authenticated using (true);

-- 7. POLICIES — Only authenticated (admin) can view and update orders
create policy "Admin can view orders"
  on orders for select to authenticated using (true);

create policy "Admin can update orders"
  on orders for update to authenticated using (true);

-- ============================================================
--  SAMPLE PRODUCTS (Optional — run after tables are created)
--  This inserts the same products you had on the old website.
-- ============================================================

insert into products (name, price, original_price, image, badge, description, category) values
  ('Classic Tulips',          699.18,  5018.10, 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=600',  'Sale',    'Fresh classic tulips, perfect for any occasion.',                                         'tulips'),
  ('Romantic Tulips',         2146.56, 2745.12, 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=600', 'Popular', 'A romantic bouquet of handpicked tulips, wrapped with love.',                           'romantic'),
  ('Flower Bucket',           4992.30, null,    'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=600',  '',        'A generous bucket arrangement bursting with seasonal flowers.',                          'bouquet'),
  ('Lavender Love',           1850.00, null,    'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=600',  'New',     'Dried lavender bouquet — long-lasting and beautifully fragrant.',                       'bouquet'),
  ('Sunshine Mix',            2350.00, null,    'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg?auto=compress&cs=tinysrgb&w=600','',       'Bright sunflowers and mixed blooms to light up any room.',                              'bouquet'),
  ('Forever Rose Set',        3500.00, null,    'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg?auto=compress&cs=tinysrgb&w=600',     'Popular', 'Preserved roses in an elegant box — a gift that lasts forever.',                       'gift'),
  ('Birthday Surprise Box',   2800.00, null,    'https://images.pexels.com/photos/931182/pexels-photo-931182.jpeg?auto=compress&cs=tinysrgb&w=600',     'New',     'Colourful mix of blooms arranged in a beautiful gift box.',                             'gift'),
  ('Wedding White Bouquet',   5500.00, null,    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=600',     '',        'Elegant white roses and lilies — perfect for your special day.',                       'romantic'),
  ('Gerbera Sunshine Bouquet',4200.00, 4900.00, '', 'Sale', 'A stunning bouquet of fresh yellow gerbera daisies — pure sunshine in your hands.', 'bouquet'),
  ('Garden Basket Arrangement',4600.00, 5000.00,'', 'Sale', 'A lush handcrafted basket overflowing with colourful mixed blooms.', 'bouquet'),
  ('Blue Tulip Bouquet',      3000.00, 3500.00, '', 'Sale', 'Rare and romantic blue tulips in crisp white — a bouquet that truly stands out.', 'tulips');
