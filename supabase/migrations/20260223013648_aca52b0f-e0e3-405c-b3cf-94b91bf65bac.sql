CREATE OR REPLACE FUNCTION public.lookup_quote_by_ref(ref_prefix text)
RETURNS TABLE(
  id uuid,
  created_at timestamptz,
  status text,
  city text,
  project_type text,
  annual_consumption text,
  objectif text,
  housing_type text,
  adresse_projet text,
  ville_projet text,
  client_name text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT q.id, q.created_at, q.status, q.city, q.project_type, q.annual_consumption,
         q.objectif, q.housing_type, q.adresse_projet, q.ville_projet, q.client_name
  FROM quote_requests q
  WHERE q.id::text ILIKE ref_prefix || '%'
  LIMIT 1;
$$;