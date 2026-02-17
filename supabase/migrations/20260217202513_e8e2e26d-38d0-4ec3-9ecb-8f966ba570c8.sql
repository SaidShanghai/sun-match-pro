
-- Drop the old trigger that fires on INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a new trigger that fires on UPDATE (when email is confirmed)
CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only act when email_confirmed_at transitions from NULL to a value
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Don't create profile if user is admin
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id AND role = 'admin') THEN
      INSERT INTO public.partner_profiles (user_id, email)
      VALUES (NEW.id, NEW.email)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_auth_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_confirmed();
