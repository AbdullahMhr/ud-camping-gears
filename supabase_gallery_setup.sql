-- 1. Create the gallery_images table
create table public.gallery_images (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.gallery_images enable row level security;

-- 3. Define RLS Policies
-- Anyone can view the gallery
create policy "Gallery images are viewable by everyone" on public.gallery_images for select using (true);

-- Any logged-in user can upload to the gallery
create policy "Authenticated users can insert gallery images" on public.gallery_images for insert with check (auth.uid() = user_id);

-- Only Administrators can delete images from the gallery
create policy "Admins can delete gallery images" on public.gallery_images for delete using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and is_admin = true
  )
);
