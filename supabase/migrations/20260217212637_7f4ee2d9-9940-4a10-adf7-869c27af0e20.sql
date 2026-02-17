
-- Table for partner solar kits
CREATE TABLE public.kits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  power_kwc NUMERIC(6,2) NOT NULL,
  panel_count INTEGER NOT NULL,
  panel_brand TEXT NOT NULL,
  inverter TEXT NOT NULL,
  structure TEXT,
  batteries TEXT,
  estimated_production_kwh INTEGER,
  price_ttc NUMERIC(10,2) NOT NULL,
  warranty_years INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;

-- Users can view their own kits
CREATE POLICY "Users can view own kits"
ON public.kits
FOR SELECT
USING (user_id = auth.uid());

-- Users can create kits
CREATE POLICY "Users can create own kits"
ON public.kits
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own kits
CREATE POLICY "Users can update own kits"
ON public.kits
FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own kits
CREATE POLICY "Users can delete own kits"
ON public.kits
FOR DELETE
USING (user_id = auth.uid());

-- Admins can view all kits
CREATE POLICY "Admins can view all kits"
ON public.kits
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookups
CREATE INDEX idx_kits_user ON public.kits (user_id);
CREATE INDEX idx_kits_company ON public.kits (company_id);

-- Trigger for updated_at
CREATE TRIGGER update_kits_updated_at
BEFORE UPDATE ON public.kits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
