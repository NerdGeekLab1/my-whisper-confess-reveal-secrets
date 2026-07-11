DROP POLICY IF EXISTS "Anyone authenticated can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile or admins view all"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR private.has_role(auth.uid(), 'admin'));