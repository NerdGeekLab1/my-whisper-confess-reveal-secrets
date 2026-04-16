
-- Create loyalty_scores table
CREATE TABLE public.loyalty_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_name TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  category TEXT NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}',
  strengths TEXT[] NOT NULL DEFAULT '{}',
  concerns TEXT[] NOT NULL DEFAULT '{}',
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  form_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores" ON public.loyalty_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own scores" ON public.loyalty_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON public.loyalty_scores FOR DELETE USING (auth.uid() = user_id);

-- Fix: let users see their own posts regardless of status
DROP POLICY IF EXISTS "Anyone can read approved posts" ON public.posts;
CREATE POLICY "Anyone can read approved posts or own posts" ON public.posts FOR SELECT TO public
  USING (status = 'approved' OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Add profile INSERT policy (the trigger creates profiles but manual creation should also work)
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
