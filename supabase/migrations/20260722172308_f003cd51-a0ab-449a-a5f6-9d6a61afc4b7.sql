
CREATE TABLE public.background_check_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL,
  match_ref text,
  match_score int NOT NULL,
  is_correct boolean NOT NULL,
  query_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.background_check_feedback TO authenticated;
GRANT ALL ON public.background_check_feedback TO service_role;

ALTER TABLE public.background_check_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own feedback"
  ON public.background_check_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own feedback"
  ON public.background_check_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_bg_feedback_user ON public.background_check_feedback(user_id, created_at DESC);
