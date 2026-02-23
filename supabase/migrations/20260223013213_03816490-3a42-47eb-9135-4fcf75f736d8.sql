-- Re-grant SELECT to authenticated role so RLS policies can work
GRANT SELECT ON public.quote_requests TO authenticated;

-- Also grant to service_role for edge functions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO service_role;