
-- Storage bucket for partner documents
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-documents', 'partner-documents', false);

-- RLS policies for the bucket
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'partner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'partner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all partner documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'partner-documents' AND has_role(auth.uid(), 'admin'::app_role));

-- Track uploaded documents
CREATE TABLE public.partner_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- 'rc', 'modele_j', 'cotisations'
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, doc_type)
);

ALTER TABLE public.partner_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
ON public.partner_documents FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can upload own documents"
ON public.partner_documents FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
ON public.partner_documents FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
ON public.partner_documents FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all documents"
ON public.partner_documents FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
