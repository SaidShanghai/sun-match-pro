-- Add explicit deny policies on user_roles for defense in depth
CREATE POLICY "No direct role insertion"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "No direct role updates"
ON public.user_roles FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "No direct role deletion"
ON public.user_roles FOR DELETE
TO authenticated
USING (false);