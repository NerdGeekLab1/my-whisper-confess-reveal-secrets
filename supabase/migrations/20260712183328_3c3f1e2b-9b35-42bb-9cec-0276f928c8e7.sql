
-- 1. posts.user_id anonymous leak: revoke column-level SELECT from anon & authenticated.
-- Authors can still identify their own posts via auth.uid() (they know their id).
REVOKE SELECT (user_id) ON public.posts FROM anon;
REVOKE SELECT (user_id) ON public.posts FROM authenticated;
-- Re-grant all other columns explicitly to keep the API working
GRANT SELECT (id, title, content, category, status, is_anonymous, reports_count, created_at, updated_at) ON public.posts TO anon, authenticated;

-- 2. reports: allow reporter to read own submissions
DROP POLICY IF EXISTS "Reporters can view own reports" ON public.reports;
CREATE POLICY "Reporters can view own reports"
ON public.reports
FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- 3. soul_posts UPDATE: tighten USING to mirror WITH CHECK (remove the target_gender-only path)
DROP POLICY IF EXISTS "Author or matched can update soul posts" ON public.soul_posts;
CREATE POLICY "Author or matched can update soul posts"
ON public.soul_posts
FOR UPDATE
TO authenticated
USING (
  auth.uid() = author_id
  OR auth.uid() = matched_user_id
  OR private.has_role(auth.uid(), 'admin'::app_role)
  OR (
    status = 'open'
    AND matched_user_id IS NULL
    AND target_gender = (SELECT gender FROM public.profiles WHERE id = auth.uid())
  )
)
WITH CHECK (
  auth.uid() = author_id
  OR auth.uid() = matched_user_id
  OR private.has_role(auth.uid(), 'admin'::app_role)
  OR (
    -- allow the matching-gender user to claim the thread by setting themselves as matched_user_id
    matched_user_id = auth.uid()
    AND status = 'locked'
  )
);

-- 4. realtime.messages: restrict broadcast/presence to authenticated users only
DROP POLICY IF EXISTS "Authenticated can read realtime" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated can write realtime" ON realtime.messages;

CREATE POLICY "Authenticated can read realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated can write realtime"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (true);
