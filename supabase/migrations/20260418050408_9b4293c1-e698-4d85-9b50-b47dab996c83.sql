-- App settings table for admin configuration (API keys, global settings)
CREATE TABLE public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general',
  description text,
  is_secret boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
  ON public.app_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
  ON public.app_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Realtime on posts table
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Seed default config rows
INSERT INTO public.app_settings (key, category, description, is_secret, value) VALUES
  ('OPENAI_API_KEY', 'ai', 'OpenAI API key for ChatGPT integration', true, '{"value":""}'::jsonb),
  ('GEMINI_API_KEY', 'ai', 'Google Gemini API key', true, '{"value":""}'::jsonb),
  ('STRIPE_SECRET_KEY', 'payment', 'Stripe payment processing secret key', true, '{"value":""}'::jsonb),
  ('STRIPE_PUBLISHABLE_KEY', 'payment', 'Stripe publishable key', false, '{"value":""}'::jsonb),
  ('SENDGRID_API_KEY', 'email', 'SendGrid email API key', true, '{"value":""}'::jsonb),
  ('TWILIO_AUTH_TOKEN', 'messaging', 'Twilio SMS auth token', true, '{"value":""}'::jsonb),
  ('TWILIO_ACCOUNT_SID', 'messaging', 'Twilio account SID', false, '{"value":""}'::jsonb),
  ('SITE_NAME', 'general', 'Public site name', false, '{"value":"TruthSpace"}'::jsonb),
  ('SUPPORT_EMAIL', 'general', 'Support contact email', false, '{"value":"support@truthspace.app"}'::jsonb),
  ('MAINTENANCE_MODE', 'general', 'Toggle maintenance mode site-wide', false, '{"value":false}'::jsonb),
  ('AUTO_MODERATE_POSTS', 'moderation', 'Auto-moderate posts via AI', false, '{"value":true}'::jsonb),
  ('DEFAULT_AI_MODEL', 'ai', 'Default AI model for chatbot', false, '{"value":"google/gemini-3-flash-preview"}'::jsonb);