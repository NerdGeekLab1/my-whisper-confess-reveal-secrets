-- Allow public read of non-secret app settings (e.g., CUSTOM_HEAD_SCRIPTS for analytics)
CREATE POLICY "Anyone can view non-secret settings"
ON public.app_settings
FOR SELECT
TO anon, authenticated
USING (is_secret = false);

-- Seed the CUSTOM_HEAD_SCRIPTS row so admins find it pre-listed
INSERT INTO public.app_settings (key, value, category, description, is_secret)
VALUES (
  'CUSTOM_HEAD_SCRIPTS',
  '{"value": ""}'::jsonb,
  'general',
  'Custom <head> tags injected on every page (Google Analytics, Facebook Pixel, meta tags). Sanitized: only script/noscript/meta/link/style tags allowed.',
  false
)
ON CONFLICT (key) DO NOTHING;