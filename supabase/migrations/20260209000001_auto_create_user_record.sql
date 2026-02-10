-- Migration: Auto-create public.users row when a new auth user signs up
-- Fixes: OAuth (Google/GitHub) creates auth.users but not public.users row
-- Root cause: No INSERT RLS policy on users table + no database trigger

-- 1. Add INSERT policy so authenticated users can create their own row
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create trigger function to auto-create public.users on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, subscription_tier, subscription_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(COALESCE(NEW.email, ''), '@', 1),
      'User'
    ),
    COALESCE(
      (NEW.raw_user_meta_data ->> 'signup_tier')::subscription_tier_enum,
      'solo'::subscription_tier_enum
    ),
    'trial'::subscription_status_enum
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 3. Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
