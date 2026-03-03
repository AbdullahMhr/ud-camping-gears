-- 1. Create a new public storage bucket named 'product-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Allow anyone visiting the site to view and download the images
CREATE POLICY "Public Read Access on Product Images" 
  ON storage.objects FOR SELECT 
  USING ( bucket_id = 'product-images' );

-- 3. Policy: Allow authenticated admins to upload new images
CREATE POLICY "Admin Upload Access on Product Images" 
  ON storage.objects FOR INSERT 
  WITH CHECK ( 
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- 4. Policy: Allow authenticated admins to update/replace images
CREATE POLICY "Admin Update Access on Product Images" 
  ON storage.objects FOR UPDATE 
  USING ( 
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- 5. Policy: Allow authenticated admins to delete images
CREATE POLICY "Admin Delete Access on Product Images" 
  ON storage.objects FOR DELETE 
  USING ( 
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );
