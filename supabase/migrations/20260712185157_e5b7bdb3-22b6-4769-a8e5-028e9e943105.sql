
REVOKE EXECUTE ON FUNCTION public.cleanup_old_signup_attempts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_signup_attempts() TO service_role;

CREATE POLICY "Deny all client access to signup_attempts"
  ON public.signup_attempts
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
