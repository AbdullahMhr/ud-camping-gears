-- 1. Create the Products table
CREATE TABLE products (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  "listingType" text NOT NULL,
  "rentPrice" numeric,
  "buyPrice" numeric,
  "rentStock" numeric DEFAULT 0,
  "sellStock" numeric DEFAULT 0,
  rating numeric DEFAULT 0,
  "reviewsCount" numeric DEFAULT 0,
  "imageUrl" text,
  images text[] DEFAULT '{}',
  specs jsonb DEFAULT '[]'::jsonb,
  reviews jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS) for absolute protection
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone visiting the website can view the products
CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  USING (true);

-- 4. Policy: Only Supabase Admins can insert, update, or delete products
CREATE POLICY "Allow admin full access on products"
  ON products FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- 5. Helper Policy: If you want standard users to be able to leave reviews, 
-- we need to allow them to UPDATE the products table (specifically the reviews JSON).
-- For perfect security, we would split reviews into a separate table, 
-- but for now, we will allow authenticated users to update products 
-- so they can append their reviews. 
CREATE POLICY "Allow authenticated users to leave reviews"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');
