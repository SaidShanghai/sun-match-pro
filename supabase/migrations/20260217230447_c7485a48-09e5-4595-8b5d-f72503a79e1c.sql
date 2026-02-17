CREATE POLICY "Admins can update all documents"
ON public.partner_documents
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));