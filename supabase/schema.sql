-- ==============================================================================
-- Schema Supabase Completo: Thaísa Felix - Nutricionista
-- Projeto: fqpliorgldtrbifelnht (ou seu projeto Supabase)
-- 
-- INSTRUÇÕES DE EXECUÇÃO:
-- 1. Abra o painel do seu projeto no Supabase: https://supabase.com/dashboard
-- 2. Vá em "SQL Editor" no menu lateral esquerdo
-- 3. Clique em "New query", cole TODO este script e clique em "Run" (Executar)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSÕES & PERMISSÕES DO SCHEMA PÚBLICO
-- ------------------------------------------------------------------------------
create extension if not exists "pgcrypto";

grant usage on schema public to anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. TABELA DE CONFIGURAÇÕES DO SITE (site_settings)
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  bio_title text not null default 'Olá, sou a Thaísa Felix',
  bio_content text not null,
  whatsapp_number text not null default '5521983562064',
  whatsapp_secondary_number text default '5521997201128',
  whatsapp_message text default 'Olá, Thaísa! Gostaria de informações sobre consulta nutricional.',
  instagram_handle text default 'nutrithaisafelix',
  email text default 'nutrithaisafelix@gmail.com',
  address text default 'R. Viúva Dantas, 214 - Sala 609, Campo Grande, Rio de Janeiro - RJ',
  payment_methods text default 'Pix ou Dinheiro',
  background_theme text not null default 'organic_fruits',
  custom_bg_url text default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilitar Row Level Security (RLS)
alter table public.site_settings enable row level security;

-- Grants explícitos para a Data API (PostgREST)
grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to authenticated;

-- Políticas RLS modernas (usando TO role, sem a função depreciada auth.role())
drop policy if exists "Permitir leitura pública das configurações" on public.site_settings;
create policy "Permitir leitura pública das configurações"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Permitir atualização para usuários autenticados" on public.site_settings;
create policy "Permitir atualização para usuários autenticados"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Permitir inserção para usuários autenticados" on public.site_settings;
create policy "Permitir inserção para usuários autenticados"
  on public.site_settings
  for insert
  to authenticated
  with check (true);

-- ------------------------------------------------------------------------------
-- 3. TABELA DE LEADS & AGENDAMENTOS (contact_leads)
-- ------------------------------------------------------------------------------
create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text default '',
  service_type text default 'presencial',
  imc numeric(4,1),
  message text default '',
  status text not null default 'novo' check (status in ('novo', 'em_atendimento', 'concluido', 'arquivado')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilitar Row Level Security (RLS)
alter table public.contact_leads enable row level security;

-- Grants explícitos para a Data API
grant insert on public.contact_leads to anon, authenticated;
grant select, update, delete on public.contact_leads to authenticated;

-- Políticas RLS para Leads
drop policy if exists "Qualquer visitante pode enviar contato" on public.contact_leads;
create policy "Qualquer visitante pode enviar contato"
  on public.contact_leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Apenas admin autenticado pode visualizar leads" on public.contact_leads;
create policy "Apenas admin autenticado pode visualizar leads"
  on public.contact_leads
  for select
  to authenticated
  using (true);

drop policy if exists "Apenas admin autenticado pode atualizar status dos leads" on public.contact_leads;
create policy "Apenas admin autenticado pode atualizar status dos leads"
  on public.contact_leads
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Apenas admin autenticado pode excluir leads" on public.contact_leads;
create policy "Apenas admin autenticado pode excluir leads"
  on public.contact_leads
  for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------------------------
-- 4. BUCKET DE ARMAZENAMENTO (Supabase Storage: site-assets)
-- ------------------------------------------------------------------------------
-- Cria o bucket público 'site-assets' caso ainda não exista
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  5242880, -- limite de 5MB por arquivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- Políticas de acesso para o Storage (storage.objects)
drop policy if exists "Permitir leitura pública de arquivos de mídia" on storage.objects;
create policy "Permitir leitura pública de arquivos de mídia"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'site-assets');

drop policy if exists "Permitir upload para usuários autenticados" on storage.objects;
create policy "Permitir upload para usuários autenticados"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-assets');

drop policy if exists "Permitir atualização para usuários autenticados" on storage.objects;
create policy "Permitir atualização para usuários autenticados"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-assets')
  with check (bucket_id = 'site-assets');

drop policy if exists "Permitir exclusão para usuários autenticados" on storage.objects;
create policy "Permitir exclusão para usuários autenticados"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-assets');

-- ------------------------------------------------------------------------------
-- 5. REGISTRO INICIAL PADRÃO (Site Settings)
-- ------------------------------------------------------------------------------
insert into public.site_settings (
  bio_title,
  bio_content,
  whatsapp_number,
  whatsapp_secondary_number,
  whatsapp_message,
  instagram_handle,
  email,
  address,
  payment_methods,
  background_theme
)
select 
  'Olá, sou a Thaísa Felix',
  'Sou nutricionista formada pela Universidade Federal do Rio de Janeiro (UFRJ), com foco em promover saúde, qualidade de vida e uma relação equilibrada com a alimentação. Atualmente, estou me especializando em obesidade e emagrecimento, aprofundando meus conhecimentos em estratégias nutricionais voltadas para a perda de peso sustentável, mudança de hábitos e melhoria da saúde metabólica.

Minha atuação é baseada em um atendimento humanizado e individualizado, respeitando a rotina, os objetivos e as necessidades de cada paciente. Acredito que a nutrição deve ser acolhedora e possível de ser aplicada no dia a dia, sem extremismos ou restrições desnecessárias.

Trabalho com foco em:

- Emagrecimento saudável e sustentável;
- Reeducação alimentar infantil e adulta;
- Nutrição comportamental;
- Prevenção e acompanhamento de doenças crônicas;
- Promoção da saúde e qualidade de vida.

Meu método de trabalho envolve escuta ativa, acompanhamento próximo e elaboração de planos alimentares personalizados, buscando resultados reais e duradouros. Gosto de trabalhar de forma leve, equilibrada e adaptada à realidade de cada pessoa, incentivando mudanças graduais que possam ser mantidas a longo prazo.',
  '5521983562064',
  '5521997201128',
  'Olá, Thaísa! Gostaria de informações sobre consulta nutricional.',
  'nutrithaisafelix',
  'nutrithaisafelix@gmail.com',
  'R. Viúva Dantas, 214 - Sala 609, Campo Grande, Rio de Janeiro - RJ',
  'Pix ou Dinheiro',
  'organic_fruits'
where not exists (select 1 from public.site_settings limit 1);
