
-- Create storage bucket for client invoices
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-invoices', 'client-invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload invoices (public upload, private read)
CREATE POLICY "Anyone can upload invoices"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'client-invoices');

-- Only admins can read invoices
CREATE POLICY "Admins can read invoices"
ON storage.objects
FOR SELECT
USING (bucket_id = 'client-invoices' AND auth.role() = 'authenticated');
