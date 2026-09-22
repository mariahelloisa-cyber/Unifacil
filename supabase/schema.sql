-- Schema do banco da Universidade Fácil (Supabase).
-- Montado a partir das consultas do código (lib/data/*, app/admin/**/actions.ts).
-- Rode inteiro no SQL Editor de um projeto novo. Pode rodar de novo sem quebrar.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

-- Categorias de curso (Bacharelado, Técnico, EJA...). A foto aparece no card
-- "Escolha por categoria" da home e no topo da página /{slug}.
create table if not exists public.course_niveis (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  nome        text not null,
  titulo      text not null default '',
  descricao   text not null default '',
  imagem_url  text not null default '',
  ordem       integer not null default 0,
  -- Aparece no "Escolha por categoria" da home (o menu mostra todas sempre).
  destaque_home boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Bancos criados antes da coluna acima.
alter table public.course_niveis add column if not exists destaque_home boolean not null default true;

create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  nivel_id        uuid not null references public.course_niveis (id) on delete restrict,
  slug            text not null,
  nome            text not null,
  area            text not null default '',
  modalidade      text not null default 'EAD',
  duracao         text not null default '',
  mensalidade     numeric(10, 2) not null default 0,
  mensalidade_de  numeric(10, 2) not null default 0,
  capa_url        text not null default '',
  resumo          text not null default '',
  descricao       text not null default '',
  mercado         text not null default '',
  destaques       text[] not null default '{}',
  destaque_home   boolean not null default false,
  para_quem       text[] not null default '{}',
  atuacao         text[] not null default '{}',
  grade           jsonb not null default '[]',
  -- "Sobre o curso" na página do curso (cada um some quando vazio).
  inicio          text not null default '',
  carga_horaria   text not null default '',
  avaliacao       text not null default '',
  created_at      timestamptz not null default now(),
  -- A URL do curso é /{categoria}/{slug}: o mesmo nome pode existir em
  -- categorias diferentes (ex.: Administração no Bacharelado e no Tecnólogo).
  unique (nivel_id, slug)
);
create index if not exists courses_nivel_id_idx on public.courses (nivel_id);

create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  titulo      text not null,
  categoria   text not null default '',
  resumo      text not null default '',
  conteudo    text[] not null default '{}',
  imagem_url  text not null default '',
  data        date not null default current_date,
  created_at  timestamptz not null default now()
);

-- Bancos criados antes dos campos de "Sobre o curso".
alter table public.courses add column if not exists inicio text not null default '';
alter table public.courses add column if not exists carga_horaria text not null default '';
alter table public.courses add column if not exists avaliacao text not null default '';

-- Pedidos de matrícula do formulário "Matricule-se". O site só insere; ler,
-- mudar o status e apagar é do admin. enviado_gestor_em fica para a futura
-- integração com o app do gestor da faculdade.
create table if not exists public.matriculas (
  id                 uuid primary key default gen_random_uuid(),
  nome               text not null check (char_length(nome) between 3 and 150),
  cpf                text not null check (cpf ~ '^[0-9]{11}$'),
  email              text not null check (char_length(email) between 5 and 200),
  telefone           text not null check (telefone ~ '^[0-9]{10,11}$'),
  curso_id           uuid references public.courses (id) on delete set null,
  curso_nome         text not null check (char_length(curso_nome) between 1 and 200),
  observacao         text not null default '' check (char_length(observacao) <= 1000),
  -- De qual botão veio: "Matricule-se", "Quero uma vaga gratuita" ou "Simular".
  origem             text not null default 'matricula'
                     check (origem in ('matricula', 'vaga_gratuita', 'simulacao')),
  -- Faixa de renda familiar (pedida na simulação de vaga gratuita).
  renda              text check (renda in ('ate_1', '1_2', '2_3', '3_5', 'acima_5')),
  status             text not null default 'novo'
                     check (status in ('novo', 'em_contato', 'matriculado', 'descartado')),
  enviado_gestor_em  timestamptz,
  created_at         timestamptz not null default now()
);

-- Bancos criados antes das colunas origem/renda.
alter table public.matriculas add column if not exists origem text not null default 'matricula'
  check (origem in ('matricula', 'vaga_gratuita', 'simulacao'));
alter table public.matriculas add column if not exists renda text
  check (renda in ('ate_1', '1_2', '2_3', '3_5', 'acima_5'));

-- Mídias avulsas do site (vídeo da home, hero do blog, prints das redes).
create table if not exists public.site_media (
  chave       text primary key,
  tipo        text not null default 'imagem',
  url         text not null default '',
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Permissões (RLS): o site lê com a chave pública; só quem está logado no
-- /admin escreve. Desative o cadastro público em Authentication → Sign In /
-- Providers ("Allow new users to sign up"), senão qualquer pessoa que criar
-- uma conta passa a poder editar.
-- ---------------------------------------------------------------------------

alter table public.course_niveis enable row level security;
alter table public.courses       enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.site_media    enable row level security;
alter table public.matriculas    enable row level security;

do $$
declare t text;
begin
  foreach t in array array['course_niveis', 'courses', 'blog_posts', 'site_media'] loop
    execute format('drop policy if exists "leitura publica" on public.%I', t);
    execute format('create policy "leitura publica" on public.%I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin escreve" on public.%I', t);
    execute format('create policy "admin escreve" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Matrículas: qualquer visitante envia (só como "novo"), mas ninguém de fora lê.
drop policy if exists "visitante envia" on public.matriculas;
create policy "visitante envia" on public.matriculas
  for insert to anon, authenticated
  with check (status = 'novo' and enviado_gestor_em is null);
drop policy if exists "admin gerencia" on public.matriculas;
create policy "admin gerencia" on public.matriculas
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage: bucket público "media", onde o admin sobe fotos e vídeos.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media leitura" on storage.objects;
create policy "media leitura" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin envia" on storage.objects;
create policy "media admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin altera" on storage.objects;
create policy "media admin altera" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media admin apaga" on storage.objects;
create policy "media admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- Categorias iniciais (sem as profissionalizantes). As fotos entram pelo
-- admin: Cursos → Categoria → Foto da categoria.
-- ---------------------------------------------------------------------------

insert into public.course_niveis (slug, nome, titulo, descricao, ordem)
values
  ('bacharelado',             'Bacharelado',             'Bacharelado com até 80% de desconto',             'Formação superior ampla, que prepara para atuar em diversas áreas do mercado.',         1),
  ('licenciatura',            'Licenciatura',            'Licenciatura com até 80% de desconto',            'Graduação que habilita para dar aulas na educação básica.',                             2),
  ('tecnologos',              'Tecnólogos',              'Cursos tecnólogos com até 80% de desconto',       'Graduação tecnológica, mais curta e focada em uma área específica do mercado.',         3),
  ('superior-sequencial',     'Superior Sequencial',     'Superior Sequencial com até 80% de desconto',     'Formação de nível superior mais curta, focada em um campo específico do conhecimento.', 4),
  ('pos-graduacao',           'Pós-Graduação',           'Pós-Graduação com até 80% de desconto',           'Especialize-se e avance na carreira depois da graduação.',                              5),
  ('tecnico',                 'Técnico',                 'Cursos técnicos com até 80% de desconto',         'Cursos técnicos de nível médio para entrar mais rápido no mercado de trabalho.',        6),
  ('tecnico-por-competencia', 'Técnico Por Competência', 'Técnico Por Competência com até 80% de desconto', 'Certificação técnica para quem já tem experiência comprovada na área.',                 7),
  ('pos-tecnico',             'Pós-Técnico',             'Pós-Técnico com até 80% de desconto',             'Especialização para quem já concluiu um curso técnico.',                                8),
  ('eja',                     'EJA',                     'EJA — Educação de Jovens e Adultos',              'Conclua o ensino fundamental ou médio na Educação de Jovens e Adultos.',                9)
on conflict (slug) do nothing;