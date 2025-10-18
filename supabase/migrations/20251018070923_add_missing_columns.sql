/*
  # Add Missing Product Columns

  ## Changes
  - Add compare_at_price, coupon_price, images, colors, sizes columns to products table
  - Add address column to users table
  - Add items column to orders table
  - Add categories table

  ## Notes
  - Uses IF NOT EXISTS to safely add columns
  - All additions are backward compatible
*/

-- Add missing columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'compare_at_price'
  ) THEN
    ALTER TABLE products ADD COLUMN compare_at_price integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'coupon_price'
  ) THEN
    ALTER TABLE products ADD COLUMN coupon_price integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products ADD COLUMN images text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'colors'
  ) THEN
    ALTER TABLE products ADD COLUMN colors text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sizes'
  ) THEN
    ALTER TABLE products ADD COLUMN sizes text[];
  END IF;
END $$;

-- Add missing columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'address'
  ) THEN
    ALTER TABLE users ADD COLUMN address text;
  END IF;
END $$;

-- Add items column to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'items'
  ) THEN
    ALTER TABLE orders ADD COLUMN items jsonb;
  END IF;
END $$;

-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub' AND users.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO public
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub' AND users.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub' AND users.is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO public
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = current_setting('request.jwt.claims', true)::json->>'sub' AND users.is_admin = true)
  );

-- Create index
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners("order");