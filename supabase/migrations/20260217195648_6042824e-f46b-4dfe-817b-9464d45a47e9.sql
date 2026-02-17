
-- Add email column to partner_profiles
ALTER TABLE public.partner_profiles 
ADD COLUMN email text;

-- Backfill existing profiles with email from auth.users
UPDATE public.partner_profiles pp
SET email = u.email
FROM auth.users u
WHERE pp.user_id = u.id;

-- Update the trigger to capture email on signup
CREATE OR REPLACE FUNCTION public.handle_new_partner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.partner_profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;
