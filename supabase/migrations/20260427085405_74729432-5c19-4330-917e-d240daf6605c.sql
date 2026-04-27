-- 1. Gender on profiles
DO $$ BEGIN
  CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'undisclosed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gender public.gender_type DEFAULT 'undisclosed';

-- 2. soul_posts
CREATE TABLE IF NOT EXISTS public.soul_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  author_gender public.gender_type NOT NULL,
  target_gender public.gender_type NOT NULL,
  title text,
  content text NOT NULL,
  mood text,
  status text NOT NULL DEFAULT 'open', -- open | locked | closed
  matched_user_id uuid,
  matched_user_gender public.gender_type,
  ai_soul_score integer DEFAULT 0,
  participant_score integer DEFAULT 0,
  soul_score integer DEFAULT 0, -- combined 0-100
  reply_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  matched_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soul_posts_status ON public.soul_posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_soul_posts_target ON public.soul_posts(target_gender, status);
CREATE INDEX IF NOT EXISTS idx_soul_posts_author ON public.soul_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_soul_posts_matched ON public.soul_posts(matched_user_id);

ALTER TABLE public.soul_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View open posts targeted at me or my own"
  ON public.soul_posts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = author_id
    OR auth.uid() = matched_user_id
    OR (
      status = 'open'
      AND target_gender = (SELECT gender FROM public.profiles WHERE id = auth.uid())
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Authenticated can create soul posts"
  ON public.soul_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Author or matched can update soul posts"
  ON public.soul_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR auth.uid() = matched_user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete soul posts"
  ON public.soul_posts FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. soul_replies
CREATE TABLE IF NOT EXISTS public.soul_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  soul_post_id uuid NOT NULL REFERENCES public.soul_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soul_replies_post ON public.soul_replies(soul_post_id, created_at);

ALTER TABLE public.soul_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view replies"
  ON public.soul_replies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.soul_posts p
      WHERE p.id = soul_post_id
        AND (auth.uid() = p.author_id OR auth.uid() = p.matched_user_id OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Participants can insert replies"
  ON public.soul_replies FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.soul_posts p
      WHERE p.id = soul_post_id
        AND (auth.uid() = p.author_id OR auth.uid() = p.matched_user_id OR p.status = 'open')
    )
  );

-- 4. soul_ratings
CREATE TABLE IF NOT EXISTS public.soul_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  soul_post_id uuid NOT NULL REFERENCES public.soul_posts(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (soul_post_id, rater_id)
);

ALTER TABLE public.soul_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view ratings"
  ON public.soul_ratings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.soul_posts p
      WHERE p.id = soul_post_id
        AND (auth.uid() = p.author_id OR auth.uid() = p.matched_user_id OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

CREATE POLICY "Participants can rate own thread"
  ON public.soul_ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_id
    AND EXISTS (
      SELECT 1 FROM public.soul_posts p
      WHERE p.id = soul_post_id
        AND (auth.uid() = p.author_id OR auth.uid() = p.matched_user_id)
    )
  );

CREATE POLICY "Participants can update own rating"
  ON public.soul_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = rater_id);

-- 5. Updated-at trigger for soul_posts
DROP TRIGGER IF EXISTS trg_soul_posts_updated_at ON public.soul_posts;
CREATE TRIGGER trg_soul_posts_updated_at
  BEFORE UPDATE ON public.soul_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.soul_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.soul_replies;