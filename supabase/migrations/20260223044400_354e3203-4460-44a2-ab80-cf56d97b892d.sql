
-- Drop the restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Only admins can view quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can view own quote requests by email" ON public.quote_requests;

-- Recreate as PERMISSIVE (default) so that ANY matching policy grants access
CREATE POLICY "Admins can view all quote requests"
  ON public.quote_requests
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own quote requests by email"
  ON public.quote_requests
  FOR SELECT
  USING (client_email = (auth.jwt() ->> 'email'::text));
