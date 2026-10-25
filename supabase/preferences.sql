-- 新しいSupabaseプロジェクトのSQL Editorで実行する。アプリからは自動実行しない。
create table if not exists public.recommendation_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 settings jsonb not null check (jsonb_typeof(settings) = 'object'),
 updated_at timestamptz not null default now()
);
alter table public.recommendation_preferences enable row level security;
revoke all on public.recommendation_preferences from anon, public;
grant select, insert, update on public.recommendation_preferences to authenticated;
create policy "read_own_preferences" on public.recommendation_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert_own_preferences" on public.recommendation_preferences for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update_own_preferences" on public.recommendation_preferences for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
