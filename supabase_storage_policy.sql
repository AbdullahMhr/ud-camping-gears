-- Run this inside your Supabase SQL Editor to fix the "Failed to upload" error!

-- This policy grants all logged-in users permission to upload files into your Storage Bucket.
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Note: Ensure your bucket 'product-images' is set to "Public" in the Storage settings so images can be viewed.
