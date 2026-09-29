-- Cursos da categoria Tecnólogos.
-- O texto do curso vai em "resumo": a coluna "descricao" é o texto de
-- Modalidade no "Sobre o curso". Pode rodar de novo: slug repetido é ignorado.

insert into public.courses (nivel_id, slug, nome, area, modalidade, duracao, carga_horaria, resumo)
select n.id, c.slug, c.nome, c.area, 'EAD', c.duracao, c.carga_horaria, c.resumo
from public.course_niveis n
cross join (values
  ('gestao-em-tecnologia-da-informacao', 'Gestão em Tecnologia da Informação', 'Tecnologia', '18 meses', '2000 horas', 'O tecnólogo em Gestão em Tecnologia da Informação é um profissional capacitado para planejar, coordenar e gerenciar recursos tecnológicos em organizações, com foco em alinhar a tecnologia aos objetivos estratégicos do negócio.'),
  ('recursos-humanos', 'Recursos Humanos', 'Negócios', '24 meses', '1600 horas', 'O tecnólogo em Recursos Humanos forma profissionais para gerir pessoas e processos de forma prática e rápida, com foco em recrutamento, seleção, treinamento, administração de pessoal e desenvolvimento organizacional.'),
  ('logistica', 'Logística', 'Negócios', '24 meses', '1600 horas', 'O curso de Tecnólogo em Logística forma profissionais para gerenciar a cadeia logística, desde o controle de estoques até o transporte e distribuição, focando na otimização de processos e redução de custos.'),
  ('processos-gerenciais', 'Processos Gerenciais', 'Negócios', '24 meses', '1600 horas', 'O Curso de Tecnólogo em Processos Gerenciais forma profissionais capacitados para atuar na gestão eficiente de empresas, com foco em planejamento, organização, liderança e controle de processos organizacionais.'),
  ('seguranca-publica', 'Segurança Pública', 'Negócios', '24 meses', '1600 horas', 'O Curso de Tecnólogo em Segurança Pública forma profissionais preparados para atuar de forma estratégica e responsável na prevenção, análise e gestão de situações que envolvem a segurança da sociedade.')
) as c (slug, nome, area, duracao, carga_horaria, resumo)
where n.slug = 'tecnologos'
on conflict (nivel_id, slug) do nothing;
