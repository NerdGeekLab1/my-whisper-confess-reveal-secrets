
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE TABLE IF NOT EXISTS public.post_private_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  subject_name TEXT,
  subject_phone TEXT,
  subject_email TEXT,
  subject_location TEXT,
  social_handles JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_private_details TO authenticated;
GRANT ALL ON public.post_private_details TO service_role;
ALTER TABLE public.post_private_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages own private details" ON public.post_private_details
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read private details" ON public.post_private_details
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete private details" ON public.post_private_details
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_ppd_post ON public.post_private_details(post_id);
CREATE INDEX IF NOT EXISTS idx_ppd_user ON public.post_private_details(user_id);
CREATE INDEX IF NOT EXISTS idx_ppd_social ON public.post_private_details USING GIN (social_handles);

CREATE TRIGGER trg_ppd_updated BEFORE UPDATE ON public.post_private_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage email templates" ON public.email_templates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.email_templates (template_key, name, subject, body) VALUES
  ('welcome', 'Welcome Email', 'Welcome to TruthSpace, {{username}}!',
   E'Hi {{username}},\n\nWelcome to TruthSpace — an anonymous community for support and truth.'),
  ('password_reset', 'Password Reset', 'Reset your TruthSpace password',
   E'Hi {{username}},\n\nReset link: {{reset_link}}'),
  ('email_verification', 'Verify Email', 'Confirm your TruthSpace email',
   E'Hi {{username}},\n\nConfirm: {{verify_link}}'),
  ('report_received', 'Report Received', 'We received your report',
   'Thanks — moderators will review shortly.'),
  ('account_flagged', 'Account Notice', 'Important notice about your account',
   'Your account has been flagged for review.')
ON CONFLICT (template_key) DO NOTHING;

ALTER TABLE public.app_settings DISABLE TRIGGER USER;
INSERT INTO public.app_settings (key, value, category, description, is_secret) VALUES
  ('SMTP_HOST', '{"value": ""}'::jsonb, 'email', 'SMTP server hostname (e.g. smtp.sendgrid.net)', false),
  ('SMTP_PORT', '{"value": "587"}'::jsonb, 'email', 'SMTP port (usually 587 for TLS)', false),
  ('SMTP_USERNAME', '{"value": ""}'::jsonb, 'email', 'SMTP auth username', false),
  ('SMTP_PASSWORD', '{"value": ""}'::jsonb, 'email', 'SMTP auth password / API key', true),
  ('SMTP_FROM_EMAIL', '{"value": ""}'::jsonb, 'email', 'Default From address', false),
  ('SMTP_FROM_NAME', '{"value": "TruthSpace"}'::jsonb, 'email', 'Default From display name', false),
  ('SMTP_USE_TLS', '{"value": true}'::jsonb, 'email', 'Use TLS/STARTTLS', false)
ON CONFLICT (key) DO NOTHING;
ALTER TABLE public.app_settings ENABLE TRIGGER USER;
