
CREATE TABLE public.delivery_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  city TEXT NOT NULL,
  cost NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, city)
);

ALTER TABLE public.delivery_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own delivery costs"
ON public.delivery_costs FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own delivery costs"
ON public.delivery_costs FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own delivery costs"
ON public.delivery_costs FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own delivery costs"
ON public.delivery_costs FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all delivery costs"
ON public.delivery_costs FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_delivery_costs_updated_at
BEFORE UPDATE ON public.delivery_costs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
