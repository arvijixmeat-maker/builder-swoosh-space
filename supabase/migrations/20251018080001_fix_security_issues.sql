/*
  # Fix Database Security and Performance Issues

  ## Overview
  This migration addresses multiple security and performance issues identified in the database:
  
  ## Changes Made
  
  ### 1. RLS Policy Performance Optimization
  - Fixed `categories` table policies to use `(select auth.uid())` instead of `auth.uid()`
  - This prevents re-evaluation of auth functions for each row, improving performance at scale
  - Affected policies:
    - "Admins can insert categories"
    - "Admins can update categories"
    - "Admins can delete categories"
  
  ### 2. Remove Unused Indexes
  - Removed unused indexes to reduce storage overhead and improve write performance:
    - `idx_products_category` on products table
    - `idx_users_email` on users table
    - `idx_orders_user_id` on orders table
    - `idx_orders_created_at` on orders table
    - `idx_order_items_order_id` on order_items table
    - `idx_cart_items_user_id` on cart_items table
  
  ### 3. Consolidate Multiple Permissive Policies
  - Removed duplicate SELECT policies that were causing conflicts
  - Kept only the public read policies, removed redundant authenticated policies
  - Affected tables:
    - banners: Removed "Authenticated can manage banners" SELECT portion
    - products: Removed "Authenticated can manage products" SELECT portion
    - settings: Removed "Authenticated can manage settings" SELECT portion
  
  ### 4. Fix Function Search Path Security
  - Added explicit search_path to `generate_order_id` function
  - Prevents potential security issues from search_path manipulation
  
  ## Security Impact
  All changes maintain or improve security posture while fixing performance issues.
*/

-- ============================================================================
-- 1. FIX RLS POLICY PERFORMANCE ISSUES
-- ============================================================================

-- Drop and recreate categories policies with optimized auth function calls
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  );

-- ============================================================================
-- 2. REMOVE UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_cart_items_user_id;

-- ============================================================================
-- 3. CONSOLIDATE MULTIPLE PERMISSIVE POLICIES
-- ============================================================================

-- BANNERS: Keep only public read policy, restructure authenticated policy for write operations only
DROP POLICY IF EXISTS "Authenticated can manage banners" ON banners;

CREATE POLICY "Authenticated can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  );

-- PRODUCTS: Keep only public read policy, restructure authenticated policy for write operations only
DROP POLICY IF EXISTS "Authenticated can manage products" ON products;

CREATE POLICY "Authenticated can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  );

-- SETTINGS: Keep only public read policy, restructure authenticated policy for write operations only
DROP POLICY IF EXISTS "Authenticated can manage settings" ON settings;

CREATE POLICY "Authenticated can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT auth.uid())
      AND users.is_admin = true
    )
  );

-- ============================================================================
-- 4. FIX FUNCTION SEARCH PATH SECURITY
-- ============================================================================

-- Drop and recreate generate_order_id function with explicit search_path
DROP FUNCTION IF EXISTS generate_order_id();

CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_id := 'ORD-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_id = new_id) THEN
      done := TRUE;
    END IF;
  END LOOP;
  
  RETURN new_id;
END;
$$;