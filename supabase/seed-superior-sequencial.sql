-- Cursos da categoria Superior Sequencial (lista do PDF superior.pdf).
-- O texto do curso vai em "resumo": a coluna "descricao" é o texto de
-- Modalidade no "Sobre o curso". Pode rodar de novo: slug repetido é ignorado.

insert into public.courses (nivel_id, slug, nome, area, modalidade, carga_horaria, resumo)
select n.id, c.slug, c.nome, c.area, 'EAD', c.carga_horaria, c.resumo
from public.course_niveis n
cross join (values
  ('seguranca-da-informacao', 'Segurança da Informação', 'Tecnologia', '840 horas', 'Capacita para proteger dados, sistemas e redes contra ameaças digitais. Desenvolve competências em gestão de riscos, políticas de segurança e proteção da informação nas organizações.'),
  ('analise-de-dados', 'Análise de Dados', 'Tecnologia', '720 horas', 'Foca na interpretação e análise de grandes volumes de dados para suporte à tomada de decisões estratégicas nas organizações.'),
  ('recuperacao-de-dados', 'Recuperação de Dados', 'Tecnologia', '720 horas', 'Envolve técnicas para recuperar informações perdidas ou corrompidas em sistemas digitais, promovendo a continuidade dos negócios.'),
  ('gestao-e-lideranca', 'Gestão e Liderança', 'Negócios', '800 horas', 'Desenvolve competências para liderar equipes e gerir processos organizacionais, promovendo eficiência e alcance de metas.'),
  ('gestao-de-projetos', 'Gestão de Projetos', 'Negócios', '720 horas', 'Forma profissionais capacitados para planejar, executar e controlar projetos, assegurando prazos, custos e qualidade.'),
  ('tecnologia-da-informacao', 'Tecnologia da Informação', 'Tecnologia', '760 horas', 'Aborda o uso estratégico de tecnologia para suportar processos empresariais e inovação tecnológica.'),
  ('gestao-em-logistica', 'Gestão em Logística', 'Negócios', '800 horas', 'Capacita para controlar fluxos de materiais, produtos e informações, otimizando a cadeia de suprimentos.'),
  ('gestao-escolar', 'Gestão Escolar', 'Educação', '710 horas', 'Foca na administração de instituições de ensino, promovendo organização e qualidade educacional.'),
  ('gestao-financeira', 'Gestão Financeira', 'Negócios', '800 horas', 'Forma profissionais para planejar, controlar e analisar recursos financeiros, visando sustentabilidade econômica.'),
  ('gestao-de-pessoas', 'Gestão de Pessoas', 'Negócios', '800 horas', 'Desenvolve habilidades para gerir talentos, motivações e relações de trabalho dentro das organizações.'),
  ('gestao-de-marketing', 'Gestão de Marketing', 'Negócios', '800 horas', 'Capacita para planejar e executar estratégias de mercado, comunicação e vendas.'),
  ('gestao-da-producao', 'Gestão da Produção', 'Negócios', '720 horas', 'Foca na otimização dos processos produtivos e uso eficiente de recursos industriais.'),
  ('gestao-de-empresas', 'Gestão de Empresas', 'Negócios', '840 horas', 'Forma gestores com visão estratégica para administrar negócios, recursos e equipes.'),
  ('gestao-em-seguranca-publica-e-privada', 'Gestão em Segurança Pública e Privada', 'Negócios', '800 horas', 'Prepara para coordenar ações e políticas de segurança em órgãos públicos e empresas privadas.'),
  ('gestao-educacional-e-pedagogica', 'Gestão Educacional e Pedagógica', 'Educação', '740 horas', 'Capacita para planejar e executar a gestão administrativa e pedagógica em instituições educativas.'),
  ('gestao-em-contabilidade', 'Gestão em Contabilidade', 'Negócios', '820 horas', 'Foca na gestão contábil e fiscal, assegurando conformidade e controle financeiro.'),
  ('gestao-em-recursos-humanos', 'Gestão em Recursos Humanos', 'Negócios', '800 horas', 'Desenvolve conhecimentos para administrar políticas de RH e desenvolvimento de pessoal.'),
  ('cadeia-de-supply-chain', 'Cadeia de Supply Chain', 'Negócios', '760 horas', 'Capacita para gerenciar toda a cadeia de suprimentos, integrando fornecedores, produção e distribuição.'),
  ('educacao-especial', 'Educação Especial', 'Educação', '710 horas', 'Forma para atender necessidades educativas especiais, promovendo inclusão e acessibilidade.'),
  ('formacao-docente-para-educacao-a-distancia', 'Formação Docente para Educação a Distância', 'Educação', '820 horas', 'Prepara para atuar no ensino remoto, utilizando metodologias e tecnologias educacionais.'),
  ('gestao-de-obras-civis', 'Gestão de Obras Civis', 'Tecnologia', '740 horas', 'Foca no planejamento e supervisão de obras, coordenando recursos humanos e materiais.'),
  ('gestao-de-transito', 'Gestão de Trânsito', 'Negócios', '800 horas', 'Capacita para planejar e administrar sistemas de trânsito, visando segurança e mobilidade.'),
  ('gestao-em-saude', 'Gestão em Saúde', 'Saúde', '740 horas', 'Desenvolve competências para administrar serviços e unidades de saúde com eficiência.'),
  ('gestao-hospitalar', 'Gestão Hospitalar', 'Saúde', '740 horas', 'Forma profissionais para gerir hospitais, clínicas e unidades de atendimento médico.'),
  ('gestao-publica', 'Gestão Pública', 'Negócios', '800 horas', 'Capacita para administrar órgãos governamentais e políticas públicas com foco em resultados.'),
  ('alfabetizacao-e-letramento', 'Alfabetização e Letramento', 'Educação', '650 horas', 'Prepara para o ensino da leitura e escrita, promovendo o desenvolvimento da linguagem.'),
  ('gestao-ambiental', 'Gestão Ambiental', 'Negócios', '710 horas', 'Foca na administração de recursos naturais e sustentabilidade em ambientes corporativos e sociais.'),
  ('gestao-da-informacao', 'Gestão da Informação', 'Tecnologia', '', 'Capacita para organizar e gerenciar o fluxo de informações dentro das organizações.'),
  ('gestao-de-pessoas-e-coaching', 'Gestão de Pessoas e Coaching', 'Negócios', '800 horas', 'Desenvolve habilidades em gestão de pessoas com foco em coaching e desenvolvimento.'),
  ('transtorno-do-espectro-autista', 'Transtorno do Espectro Autista', 'Educação', '570 horas', 'Prepara para identificar e intervir em casos de autismo, promovendo inclusão e suporte.'),
  ('gestao-de-tecnologia-e-inovacao', 'Gestão de Tecnologia e Inovação', 'Tecnologia', '', 'Foca na administração de processos tecnológicos e inovação para competitividade empresarial.'),
  ('neuroeducacao', 'Neuroeducação', 'Educação', '840 horas', 'Integra conhecimentos de neurociência e educação para aprimorar processos de ensino e aprendizagem.')
) as c (slug, nome, area, carga_horaria, resumo)
where n.slug = 'superior-sequencial'
on conflict (nivel_id, slug) do nothing;
