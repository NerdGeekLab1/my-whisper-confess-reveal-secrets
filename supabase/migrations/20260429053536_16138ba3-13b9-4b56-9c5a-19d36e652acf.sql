CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ensure_current_user_setup(uuid, text, text) FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Admins can create audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can create audit logs"
ON public.admin_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete settings" ON public.app_settings;
CREATE POLICY "Admins can delete settings"
ON public.app_settings
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert settings" ON public.app_settings;
CREATE POLICY "Admins can insert settings"
ON public.app_settings
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update settings" ON public.app_settings;
CREATE POLICY "Admins can update settings"
ON public.app_settings
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all settings" ON public.app_settings;
CREATE POLICY "Admins can view all settings"
ON public.app_settings
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can read approved posts or own posts" ON public.posts;
CREATE POLICY "Anyone can read approved posts or own posts"
ON public.posts
FOR SELECT
TO public
USING ((status = 'approved'::text) OR (auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Owners and admins can update posts" ON public.posts;
CREATE POLICY "Owners and admins can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete reports" ON public.reports;
CREATE POLICY "Admins can delete reports"
ON public.reports
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage reports" ON public.reports;
CREATE POLICY "Admins can manage reports"
ON public.reports
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
CREATE POLICY "Admins can view all reports"
ON public.reports
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete soul posts" ON public.soul_posts;
CREATE POLICY "Admins can delete soul posts"
ON public.soul_posts
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "View open posts targeted at me or my own" ON public.soul_posts;
CREATE POLICY "View open posts targeted at me or my own"
ON public.soul_posts
FOR SELECT
TO authenticated
USING (
  (auth.uid() = author_id)
  OR (auth.uid() = matched_user_id)
  OR (
    status = 'open'::text
    AND matched_user_id IS NULL
    AND target_gender = (
      SELECT profiles.gender
      FROM public.profiles
      WHERE profiles.id = auth.uid()
    )
  )
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Author or matched can update soul posts" ON public.soul_posts;
CREATE POLICY "Author or matched can update soul posts"
ON public.soul_posts
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = author_id)
  OR (auth.uid() = matched_user_id)
  OR (
    status = 'open'::text
    AND matched_user_id IS NULL
    AND target_gender = (
      SELECT profiles.gender
      FROM public.profiles
      WHERE profiles.id = auth.uid()
    )
  )
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  (auth.uid() = author_id)
  OR (auth.uid() = matched_user_id)
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Participants can view replies" ON public.soul_replies;
CREATE POLICY "Participants can view replies"
ON public.soul_replies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.soul_posts p
    WHERE p.id = soul_replies.soul_post_id
      AND (
        (auth.uid() = p.author_id)
        OR (auth.uid() = p.matched_user_id)
        OR private.has_role(auth.uid(), 'admin'::public.app_role)
      )
  )
);

DROP POLICY IF EXISTS "Participants can insert replies" ON public.soul_replies;
CREATE POLICY "Participants can insert replies"
ON public.soul_replies
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (
    SELECT 1
    FROM public.soul_posts p
    WHERE p.id = soul_replies.soul_post_id
      AND (
        (p.status = 'locked'::text AND ((auth.uid() = p.author_id) OR (auth.uid() = p.matched_user_id)))
        OR (
          p.status = 'open'::text
          AND p.matched_user_id IS NULL
          AND auth.uid() <> p.author_id
          AND p.target_gender = (
            SELECT profiles.gender
            FROM public.profiles
            WHERE profiles.id = auth.uid()
          )
        )
      )
  )
);

DROP POLICY IF EXISTS "Participants can view ratings" ON public.soul_ratings;
CREATE POLICY "Participants can view ratings"
ON public.soul_ratings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.soul_posts p
    WHERE p.id = soul_ratings.soul_post_id
      AND (
        (auth.uid() = p.author_id)
        OR (auth.uid() = p.matched_user_id)
        OR private.has_role(auth.uid(), 'admin'::public.app_role)
      )
  )
);

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role) OR (auth.uid() = user_id));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);