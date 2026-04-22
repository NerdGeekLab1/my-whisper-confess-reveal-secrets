create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  action_type text not null,
  target_table text not null,
  target_id text,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs (created_at desc);
create index if not exists idx_admin_audit_logs_actor_user_id on public.admin_audit_logs (actor_user_id);
create index if not exists idx_admin_audit_logs_target_table on public.admin_audit_logs (target_table);

alter table public.admin_audit_logs enable row level security;

create policy "Admins can view audit logs"
on public.admin_audit_logs
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can create audit logs"
on public.admin_audit_logs
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

alter table public.posts replica identity full;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;
END $$;