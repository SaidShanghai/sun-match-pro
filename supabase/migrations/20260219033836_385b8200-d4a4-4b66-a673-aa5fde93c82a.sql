-- Force PostgREST to reload its schema cache and re-apply grants
NOTIFY pgrst, 'reload schema';

-- Re-grant to make sure everything is in order
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.quote_requests TO anon;
GRANT INSERT ON public.quote_requests TO authenticated;
GRANT SELECT ON public.quote_requests TO authenticated;

-- Drop and recreate the policy cleanly
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;

CREATE POLICY "Anyone can submit a quote request"
ON public.quote_requests
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);