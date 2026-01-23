-- Create waitlist table for email signups
create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Add index for email lookups
create index if not exists waitlist_email_idx on public.waitlist (email);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Policy: Only service role can insert (API route uses service role key)
-- No public read access to protect email addresses
create policy "Service role can insert waitlist entries"
  on public.waitlist
  for insert
  to service_role
  with check (true);

-- Policy: Service role can read for admin purposes
create policy "Service role can read waitlist"
  on public.waitlist
  for select
  to service_role
  using (true);
