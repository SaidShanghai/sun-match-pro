-- Grant INSERT permission to anon and authenticated roles on quote_requests
GRANT INSERT ON public.quote_requests TO anon;
GRANT INSERT ON public.quote_requests TO authenticated;
GRANT SELECT ON public.quote_requests TO authenticated;