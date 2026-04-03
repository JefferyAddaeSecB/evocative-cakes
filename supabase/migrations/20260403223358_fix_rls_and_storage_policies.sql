-- ============================================================
-- Create tables if they don't exist
-- ============================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('contact_form', 'chatbot')),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  event_type text,
  event_date date,
  cake_description text NOT NULL,
  dietary_restrictions text,
  serving_size text,
  design_preferences text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'started', 'in_progress', 'completed')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.order_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  file_name text,
  file_size bigint,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement text NOT NULL CHECK (placement IN ('gallery', 'hero')),
  category text CHECK (category IN ('Wedding Cakes', 'Birthday Cakes', 'Cupcakes', 'Cookies & Treats', 'Custom Cakes')),
  title text,
  description text,
  alt_text text,
  storage_path text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================
-- Fix RLS policies for gallery_images table
-- ============================================================

-- Enable RLS on gallery_images (in case it's not already)
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (so we can recreate cleanly)
DROP POLICY IF EXISTS "Public can read published gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can read all gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON public.gallery_images;

-- Allow anyone to read published, non-archived images
CREATE POLICY "Public can read published gallery images"
  ON public.gallery_images
  FOR SELECT
  USING (is_published = true AND is_archived = false);

-- Allow authenticated users (admins) to read ALL gallery images
CREATE POLICY "Admins can read all gallery images"
  ON public.gallery_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to insert images
CREATE POLICY "Admins can insert gallery images"
  ON public.gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users (admins) to update images
CREATE POLICY "Admins can update gallery images"
  ON public.gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins) to delete images
CREATE POLICY "Admins can delete gallery images"
  ON public.gallery_images
  FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================
-- Fix RLS policies for orders table
-- ============================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Anyone can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- Fix RLS policies for order_images table
-- ============================================================

ALTER TABLE public.order_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert order images" ON public.order_images;
DROP POLICY IF EXISTS "Admins can read all order images" ON public.order_images;

CREATE POLICY "Anyone can insert order images"
  ON public.order_images
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read all order images"
  ON public.order_images
  FOR SELECT
  TO authenticated
  USING (true);


-- ============================================================
-- Storage bucket: website-media
-- ============================================================

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-media', 'website-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies for website-media
DROP POLICY IF EXISTS "Public can read website media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload website media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update website media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete website media" ON storage.objects;

-- Allow public read access to website-media bucket
CREATE POLICY "Public can read website media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'website-media');

-- Allow authenticated users to upload to website-media bucket
CREATE POLICY "Admins can upload website media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'website-media');

-- Allow authenticated users to update objects in website-media bucket
CREATE POLICY "Admins can update website media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'website-media')
  WITH CHECK (bucket_id = 'website-media');

-- Allow authenticated users to delete from website-media bucket
CREATE POLICY "Admins can delete website media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'website-media');


-- ============================================================
-- Storage bucket: order-images
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop existing storage policies for order-images
DROP POLICY IF EXISTS "Anyone can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read order images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete order images" ON storage.objects;

-- Allow public uploads (contact form / chatbot)
CREATE POLICY "Anyone can upload order images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'order-images');

-- Allow admins to read order images
CREATE POLICY "Admins can read order images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'order-images');

-- Allow admins to delete order images
CREATE POLICY "Admins can delete order images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'order-images');
