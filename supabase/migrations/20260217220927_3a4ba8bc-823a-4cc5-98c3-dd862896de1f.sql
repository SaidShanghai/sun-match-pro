
ALTER TABLE public.partner_profiles
ADD COLUMN setup_complete BOOLEAN NOT NULL DEFAULT false;

-- Function to check if all 3 steps are done
CREATE OR REPLACE FUNCTION public.check_partner_setup_complete(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    -- Step 1: Company registered
    EXISTS (SELECT 1 FROM public.companies WHERE user_id = _user_id)
    AND
    -- Step 2: At least 1 kit
    EXISTS (SELECT 1 FROM public.kits WHERE user_id = _user_id AND is_active = true)
    AND
    -- Step 3: At least 1 delivery cost
    EXISTS (SELECT 1 FROM public.delivery_costs WHERE user_id = _user_id)
  )
$$;
