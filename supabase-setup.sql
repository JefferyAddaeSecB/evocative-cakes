-- EVO Cakes Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLES
-- ==========================================

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN ('contact_form', 'chatbot')),

  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Event Details
  event_type TEXT,
  event_date DATE,

  -- Cake Specifications
  cake_description TEXT NOT NULL,
  dietary_restrictions TEXT,
  serving_size TEXT,
  design_preferences TEXT,

  -- Order Management
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Order images table
CREATE TABLE order_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chatbot conversations table
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_images_order_id ON order_images(order_id);
CREATE INDEX idx_chatbot_order_id ON chatbot_conversations(order_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

-- Order images policies
CREATE POLICY "Admin can view all images"
  ON order_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can upload images"
  ON order_images FOR INSERT
  TO anon
  WITH CHECK (true);

-- Chatbot conversations policies
CREATE POLICY "Admin can view conversations"
  ON chatbot_conversations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can create conversations"
  ON chatbot_conversations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update conversations"
  ON chatbot_conversations FOR UPDATE
  TO anon
  USING (true);

-- Admin users policies
CREATE POLICY "Admin can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for chatbot_conversations table
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON chatbot_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to set completed_at when status changes to 'completed'
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set completed_at
CREATE TRIGGER set_order_completed_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_completed_at();

-- ==========================================
-- STORAGE BUCKETS (Run in Storage section)
-- ==========================================

-- Create bucket for order images
-- Name: order-images
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage policies (Run after creating bucket)
-- CREATE POLICY "Admin can view images"
--   ON storage.objects FOR SELECT
--   TO authenticated
--   USING (bucket_id = 'order-images');

-- CREATE POLICY "Public can upload images"
--   ON storage.objects FOR INSERT
--   TO anon
--   WITH CHECK (bucket_id = 'order-images');
