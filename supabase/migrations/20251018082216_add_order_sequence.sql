/*
  # Add Order Sequence Table
  
  1. New Tables
    - `order_sequence` - 주문 번호 시퀀스 관리
      - `id` (uuid, primary key)
      - `current_value` (integer) - 현재 주문 번호
      
  2. Security
    - Enable RLS
    - Admin only policies
*/

CREATE TABLE IF NOT EXISTS order_sequence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_value integer NOT NULL DEFAULT 0
);

ALTER TABLE order_sequence ENABLE ROW LEVEL SECURITY;

-- Insert initial row if not exists
INSERT INTO order_sequence (current_value)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM order_sequence);

CREATE POLICY "Admins can manage order sequence"
  ON order_sequence
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

CREATE POLICY "Public can read order sequence"
  ON order_sequence
  FOR SELECT
  TO authenticated
  USING (true);