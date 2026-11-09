create table if not exists public.formacoes_treinador (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.formacoes_treinador enable row level security;

create policy "Treinador acessa apenas suas formações"
on public.formacoes_treinador
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
