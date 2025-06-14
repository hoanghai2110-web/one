
-- Add subscription fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free';

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  total INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert orders" ON orders
  FOR INSERT WITH CHECK (true);
