-- EVO Cakes Storage Fix
-- Run this in the Supabase SQL Editor if contact form image uploads fail
-- with "new row violates row-level security policy" on storage.objects.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-images',
  'order-images',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admin can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload images" ON storage.objects;

CREATE POLICY "Admin can view images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'order-images');

CREATE POLICY "Public can upload images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'order-images');
