/*
  # Remove RLS Policies (auth.uid() not working)

  1. Changes
    - Disable RLS on all tables
    - Drop all existing RLS policies
    
  2. Reason
    - Current system uses custom auth (not Supabase Auth)
    - auth.uid() always returns null
    - This blocks all admin operations
*/

-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_sequence DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Public can insert users" ON users;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON orders;
DROP POLICY IF EXISTS "Admins can update order status" ON orders;

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;

DROP POLICY IF EXISTS "Public can view settings" ON settings;
DROP POLICY IF EXISTS "Authenticated can manage settings" ON settings;

DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Authenticated can manage banners" ON banners;

DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can manage categories" ON categories;

DROP POLICY IF EXISTS "Public can read sequence" ON order_sequence;
DROP POLICY IF EXISTS "Authenticated can update sequence" ON order_sequence;
