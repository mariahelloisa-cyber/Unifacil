-- Cursos da categoria Bacharelado.
-- O texto do curso vai em "resumo": a coluna "descricao" é o texto de
-- Modalidade no "Sobre o curso". Pode rodar de novo: slug repetido é ignorado.

insert into public.courses (nivel_id, slug, nome, area, modalidade, duracao, carga_horaria, resumo)
select n.id, c.slug, c.nome, c.area, 'EAD', c.duracao, c.carga_horaria, c.resumo
from public.course_niveis n
cross join (values
  ('administracao', 'Administração', 'Negócios', '48 meses', '3200 horas', 'Forma profissionais aptos a planejar, organizar, dirigir e controlar recursos em organizações, atuando em gestão empresarial, finanças, marketing e recursos humanos.'),
  ('servico-social', 'Serviço Social', 'Saúde', '48 meses', '3240 horas', 'Capacita para atuar na promoção da justiça social, desenvolvendo políticas públicas e ações de apoio a grupos vulneráveis.'),
  ('teologia', 'Teologia', 'Educação', '36 meses', '3140 horas', 'Estudo sistemático das religiões, bíblia e práticas religiosas, preparando para atuar em contextos de aconselhamento e liderança espiritual.')
) as c (slug, nome, area, duracao, carga_horaria, resumo)
where n.slug = 'bacharelado'
on conflict (nivel_id, slug) do nothing;
