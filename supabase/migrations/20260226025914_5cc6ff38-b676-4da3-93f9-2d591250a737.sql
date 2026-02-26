-- Rate limits table is only used by database functions (check_rate_limit, cleanup_rate_limits)
-- which run with SECURITY DEFINER, so they bypass RLS.
-- No direct client access needed. Add a deny-all policy to be explicit.

CREATE POLICY "No direct access to rate_limits"
ON public.rate_limits
FOR ALL
USING (false)
WITH CHECK (false);
