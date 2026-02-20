-- Remove the overly permissive INSERT policy on quote_requests
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;

-- Replace with a deny-all policy: only the service role (edge function) can insert
CREATE POLICY "Only service role can insert quote requests"
ON public.quote_requests FOR INSERT
WITH CHECK (false);