-- Table for persistent rate limiting
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by key + time window
CREATE INDEX idx_rate_limits_key_created ON public.rate_limits (key, created_at DESC);

-- Enable RLS (deny all from client — only service role uses this)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No permissive policies: only service role can read/write

-- Cleanup function to purge old entries (older than 2 hours)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '2 hours';
$$;

-- Helper: check rate limit and record attempt in one call
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _key text,
  _max_requests int,
  _window_seconds int
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count int;
BEGIN
  -- Count recent requests in window
  SELECT count(*) INTO _count
  FROM public.rate_limits
  WHERE key = _key
    AND created_at > now() - (_window_seconds || ' seconds')::interval;

  IF _count >= _max_requests THEN
    RETURN true; -- rate limited
  END IF;

  -- Record this attempt
  INSERT INTO public.rate_limits (key) VALUES (_key);

  -- Opportunistic cleanup (1% chance)
  IF random() < 0.01 THEN
    PERFORM public.cleanup_rate_limits();
  END IF;

  RETURN false; -- not limited
END;
$$;