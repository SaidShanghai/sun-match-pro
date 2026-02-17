
ALTER TABLE public.partner_documents
ADD COLUMN validated boolean NOT NULL DEFAULT false;
