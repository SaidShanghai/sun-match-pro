-- Revoke excessive grants on quote_requests
-- Only service role (edge function) should INSERT, only admin RLS policy should allow SELECT
REVOKE INSERT ON public.quote_requests FROM anon;
REVOKE INSERT ON public.quote_requests FROM authenticated;
REVOKE SELECT ON public.quote_requests FROM anon;

-- Keep SELECT for authenticated since admin RLS policy needs it via authenticated role
-- but revoke for anon which should never access this table
