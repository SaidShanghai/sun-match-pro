-- Fix the misleading admin read policy to actually check admin role
DROP POLICY IF EXISTS "Admins can read invoices" ON storage.objects;

CREATE POLICY "Only admins can read invoices"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-invoices' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);