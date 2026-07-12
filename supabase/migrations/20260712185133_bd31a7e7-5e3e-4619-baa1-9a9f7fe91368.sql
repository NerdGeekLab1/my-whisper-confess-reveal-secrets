
CREATE TABLE public.signup_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_signup_attempts_ip_time ON public.signup_attempts (ip_hash, attempted_at DESC);
CREATE INDEX idx_signup_attempts_email_time ON public.signup_attempts (email_hash, attempted_at DESC);

GRANT ALL ON public.signup_attempts TO service_role;

ALTER TABLE public.signup_attempts ENABLE ROW LEVEL SECURITY;

-- No policies granted: only service_role (edge function) can access this table.
-- Deny everyone else explicitly by not creating any policy.

-- Cleanup helper: drop rows older than 24h (called opportunistically by edge fn)
CREATE OR REPLACE FUNCTION public.cleanup_old_signup_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.signup_attempts WHERE attempted_at < now() - interval '24 hours';
$$;
