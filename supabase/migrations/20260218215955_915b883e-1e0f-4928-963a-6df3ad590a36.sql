
-- Table des packages NOORIA
CREATE TABLE public.packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  profile_type text NOT NULL CHECK (profile_type IN ('residential', 'commercial', 'industrial')),
  power_kwc numeric NOT NULL,
  price_ttc numeric NOT NULL,
  applicable_aids text[] DEFAULT '{}',
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table des demandes de devis (soumises via le diagnostic)
CREATE TABLE public.quote_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Coordonnées client
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  -- Données diagnostic
  city text,
  housing_type text,
  roof_type text,
  roof_orientation text,
  roof_surface text,
  annual_consumption text,
  budget text,
  project_type text,
  -- Traitement
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'treated', 'lost')),
  recommended_package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Packages : lecture publique (pour l'IA), écriture admin uniquement
CREATE POLICY "Packages are publicly readable"
  ON public.packages FOR SELECT USING (true);

CREATE POLICY "Only admins can manage packages"
  ON public.packages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Quote requests : insertion publique (depuis le formulaire diagnostic), lecture/gestion admin
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view quote requests"
  ON public.quote_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update quote requests"
  ON public.quote_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers updated_at
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
