
CREATE POLICY "Users upload own evidence" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own evidence" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'post-evidence' AND (auth.uid()::text = (storage.foldername(name))[1] OR private.has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Users delete own evidence" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
