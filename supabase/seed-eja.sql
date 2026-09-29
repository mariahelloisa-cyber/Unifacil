-- Cursos da categoria EJA.
-- O texto do curso vai em "resumo": a coluna "descricao" é o texto de
-- Modalidade no "Sobre o curso". Pode rodar de novo: slug repetido é ignorado.

insert into public.courses (nivel_id, slug, nome, area, modalidade, carga_horaria, resumo)
select n.id, c.slug, c.nome, 'Educação', 'EAD', c.carga_horaria, c.resumo
from public.course_niveis n
cross join (values
  ('ensino-fundamental', 'EJA – Ensino Fundamental', '800 horas', 'O curso de EJA – Ensino Fundamental é destinado a jovens e adultos que desejam concluir os estudos básicos, oferecendo aprendizagem prática e adaptada às necessidades do estudante, valorizando a educação, a cidadania e o desenvolvimento pessoal.'),
  ('ensino-medio', 'EJA – Ensino Médio', '1200 horas', 'O curso de EJA – Ensino Médio é voltado para jovens e adultos que buscam concluir a educação básica, proporcionando conhecimentos gerais, preparação para o mercado de trabalho e desenvolvimento pessoal, promovendo cidadania e aprendizado contínuo.'),
  ('ensino-fundamental-e-medio', 'EJA 2.0 – Ensino Fundamental + Médio', '2000 horas', 'O curso EJA 2.0 – Ensino Fundamental e Médio é destinado a jovens e adultos que desejam concluir toda a educação básica de forma prática e acessível, unindo aprendizado, desenvolvimento pessoal e preparação para oportunidades acadêmicas e profissionais.')
) as c (slug, nome, carga_horaria, resumo)
where n.slug = 'eja'
on conflict (nivel_id, slug) do nothing;
