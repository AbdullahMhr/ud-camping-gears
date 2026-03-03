-- This script will safely inject the default Gallery images into your Supabase database!
-- That way, your gallery won't look empty when users visit.

-- We use a generic user_id if one doesn't exist, but it's safest to just insert them directly if the table allows nulls or we bypass the foreign key for defaults. 
-- Assuming you are running this as the Postgres Admin, we can insert them by grabbing the first available admin profile ID to own the default pictures:

DO $$ 
DECLARE 
  admin_user_id uuid;
BEGIN
  -- 1. Find the first Admin user ID to "own" these default photos
  SELECT id INTO admin_user_id FROM public.profiles WHERE is_admin = true LIMIT 1;

  -- 2. If no admin exists yet, just grab any user ID
  IF admin_user_id IS NULL THEN
     SELECT id INTO admin_user_id FROM public.profiles LIMIT 1;
  END IF;

  -- 3. If there are basically ZERO users in the entire database, we can't insert them (because of the foreign key constraint on user_id).
  -- But if we found a user, let's insert the default cool camping pictures!
  IF admin_user_id IS NOT NULL THEN
     INSERT INTO public.gallery_images (image_url, user_id, created_at) VALUES 
      ('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '9 days'),
      ('https://images.unsplash.com/photo-1529385101576-4e03aae38ffc?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '8 days'),
      ('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '7 days'),
      ('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '6 days'),
      ('https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '5 days'),
      ('https://images.unsplash.com/photo-1532339142463-fd0a8979791a?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '4 days'),
      ('https://images.unsplash.com/photo-1495756477161-2ec0a0cf851a?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '3 days'),
      ('https://images.unsplash.com/photo-1455792222165-d07b32d29485?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '2 days'),
      ('https://images.unsplash.com/photo-1628359357494-06d2c4b26716?auto=format&fit=crop&q=80&w=800', admin_user_id, now() - interval '1 day');
  END IF;
END $$;
