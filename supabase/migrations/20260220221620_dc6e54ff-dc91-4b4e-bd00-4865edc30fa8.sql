-- Remove the overly permissive storage policy that allows unauthenticated uploads
DROP POLICY IF EXISTS "Anyone can upload invoices" ON storage.objects;