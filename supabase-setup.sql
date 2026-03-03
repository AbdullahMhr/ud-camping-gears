create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Reviews are viewable by everyone." on reviews for select using (true);
create policy "Authenticated users can insert reviews." on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews." on reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews." on reviews for delete using (auth.uid() = user_id);

-- trigger to prevent privilege escalation on is_admin
create or replace function public.prevent_admin_escalation()
returns trigger as $$
begin
  if new.is_admin is distinct from old.is_admin then
    -- Silently revert the attempt to change is_admin back to the original value
    new.is_admin = old.is_admin;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_update_admin_check
  before update on public.profiles
  for each row execute procedure public.prevent_admin_escalation();

-- trigger for profile
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
