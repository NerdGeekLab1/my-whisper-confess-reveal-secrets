
-- P1: Harden public.app_settings
-- 1. Drop the overly broad "any non-secret is public" policy
DROP POLICY IF EXISTS "Anyone can view non-secret settings" ON public.app_settings;

-- 2. Replace with a narrowly scoped policy: only the whitelisted analytics key is publicly readable
CREATE POLICY "Public can view CUSTOM_HEAD_SCRIPTS only"
ON public.app_settings
FOR SELECT
TO anon, authenticated
USING (key = 'CUSTOM_HEAD_SCRIPTS' AND is_secret = false);

-- 3. Default new settings to secret
ALTER TABLE public.app_settings ALTER COLUMN is_secret SET DEFAULT true;

-- 4. Enforce: only admins can mark a setting as public (is_secret = false)
CREATE OR REPLACE FUNCTION public.enforce_app_settings_public_by_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_secret = false THEN
    IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can mark an app setting as public (is_secret = false)';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_app_settings_public_by_admin_trg ON public.app_settings;
CREATE TRIGGER enforce_app_settings_public_by_admin_trg
BEFORE INSERT OR UPDATE OF is_secret ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.enforce_app_settings_public_by_admin();
