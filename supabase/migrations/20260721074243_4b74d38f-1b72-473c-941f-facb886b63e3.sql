
ALTER TABLE public.loyalty_scores ADD COLUMN IF NOT EXISTS misc_details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.loyalty_scores ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE POLICY "Admins can view all loyalty scores" ON public.loyalty_scores FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update loyalty scores" ON public.loyalty_scores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete loyalty scores" ON public.loyalty_scores FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_loyalty_scores_updated_at ON public.loyalty_scores;
CREATE TRIGGER update_loyalty_scores_updated_at BEFORE UPDATE ON public.loyalty_scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
