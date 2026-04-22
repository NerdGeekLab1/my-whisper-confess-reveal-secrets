create or replace function public.ensure_current_user_setup(
  _user_id uuid,
  _email text,
  _username text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  safe_username text;
begin
  if auth.uid() is distinct from _user_id then
    raise exception 'Unauthorized';
  end if;

  safe_username := coalesce(nullif(trim(_username), ''), nullif(split_part(coalesce(_email, ''), '@', 1), ''), 'anonymous');

  insert into public.profiles (id, email, username, is_verified, joined_date, last_active)
  values (_user_id, nullif(_email, ''), safe_username, false, now(), now())
  on conflict (id) do update
    set email = coalesce(excluded.email, public.profiles.email),
        username = coalesce(public.profiles.username, excluded.username),
        last_active = now(),
        updated_at = now();

  insert into public.user_roles (user_id, role)
  values (_user_id, 'user')
  on conflict (user_id, role) do nothing;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.ensure_current_user_setup(uuid, text, text) to authenticated;