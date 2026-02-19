-- Drop the restrictive policy and replace with a permissive one
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;

CREATE POLICY "Anyone can submit a quote request"
ON public.quote_requests
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);