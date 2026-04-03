-- EVO Cakes admin upgrade
-- Run this after the original setup to enable richer order stages,
-- live media management, and website image storage.

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('new', 'started', 'in_progress', 'completed'));

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  placement TEXT NOT NULL CHECK (placement IN ('gallery', 'hero')),
  category TEXT CHECK (category IN ('Wedding Cakes', 'Birthday Cakes', 'Cupcakes', 'Cookies & Treats', 'Celebrations')),
  title TEXT,
  description TEXT,
  alt_text TEXT,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_placement ON gallery_images(placement);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active_sort ON gallery_images(is_archived, is_published, sort_order, created_at DESC);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published gallery images" ON gallery_images;
CREATE POLICY "Public can view published gallery images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (is_published = true AND is_archived = false);

DROP POLICY IF EXISTS "Admin can manage gallery images" ON gallery_images;
CREATE POLICY "Admin can manage gallery images"
  ON gallery_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION set_gallery_archived_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_archived = true AND COALESCE(OLD.is_archived, false) = false THEN
    NEW.archived_at = NOW();
  ELSIF NEW.is_archived = false THEN
    NEW.archived_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_gallery_archived_at_trigger ON gallery_images;
CREATE TRIGGER set_gallery_archived_at_trigger
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION set_gallery_archived_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-media',
  'website-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view website media" ON storage.objects;
CREATE POLICY "Public can view website media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Admin can upload website media" ON storage.objects;
CREATE POLICY "Admin can upload website media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Admin can update website media" ON storage.objects;
CREATE POLICY "Admin can update website media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'website-media')
  WITH CHECK (bucket_id = 'website-media');

DROP POLICY IF EXISTS "Admin can delete website media" ON storage.objects;
CREATE POLICY "Admin can delete website media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'website-media');
