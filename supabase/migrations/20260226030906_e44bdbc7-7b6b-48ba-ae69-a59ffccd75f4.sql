
-- Drop and recreate without client_name, using SECURITY INVOKER
DROP FUNCTION IF EXISTS public.lookup_quote_by_ref(text);

CREATE FUNCTION public.lookup_quote_by_ref(ref_prefix text)
RETURNS TABLE(
  id text,
  created_at timestamptz,
  status text,
  city text,
  ville_projet text,
  housing_type text
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT q.id::text, q.created_at, q.status, q.city, q.ville_projet, q.housing_type
  FROM quote_requests q
  WHERE q.id::text ILIKE ref_prefix || '%'
  LIMIT 1;
$$;
