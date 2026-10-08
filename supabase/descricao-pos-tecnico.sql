-- Descrições personalizadas dos cursos Pós-Técnico (coluna "descricao",
-- que aparece como "Sobre o curso" na página do curso).
-- Rode inteiro no SQL Editor do Supabase. Pode rodar de novo: só sobrescreve.

update public.courses c
set descricao = d.texto
from public.course_niveis n,
(values
  ('administracao-de-materiais',
   'Com 400 horas, a Especialização Técnica em Administração de Materiais aprofunda a gestão de compras, estoques, armazenagem e inventários, com foco em reduzir custos e evitar perdas. Ideal para técnicos em administração, logística e áreas afins que querem assumir funções de controle e coordenação de materiais.'),
  ('administracao-de-producao',
   'Em 480 horas, a Especialização Técnica em Administração de Produção prepara você para planejar, programar e controlar a produção, aumentando a produtividade e a qualidade dos processos. Uma especialização para técnicos que atuam ou querem atuar na supervisão de linhas de produção em indústrias.'),
  ('centro-de-material-e-esterilizacao',
   'Com 420 horas, a Especialização Técnica em Centro de Material e Esterilização capacita você para atuar na limpeza, preparo, esterilização, armazenamento e distribuição de materiais e instrumentais, seguindo rigorosos protocolos de biossegurança. Voltada a técnicos de enfermagem que querem atuar no CME de hospitais e clínicas.'),
  ('controle-da-qualidade-em-farmacia',
   'Em 400 horas, a Especialização Técnica em Controle da Qualidade em Farmácia aprofunda as análises, os ensaios e as boas práticas que garantem a segurança e a eficácia dos medicamentos. Uma especialização para técnicos em farmácia e química que querem atuar em laboratórios de controle de qualidade e na indústria farmacêutica.'),
  ('energia-solar-fotovoltaica',
   'Com 420 horas, a Especialização Técnica em Energia Solar Fotovoltaica prepara você para dimensionar, instalar, operar e manter sistemas fotovoltaicos residenciais, comerciais e rurais. Ideal para técnicos em eletrotécnica, eletroeletrônica e áreas afins que querem entrar em um dos mercados que mais crescem no país.'),
  ('farmacia-hospitalar',
   'Em 400 horas, a Especialização Técnica em Farmácia Hospitalar capacita você para atuar no controle, no fracionamento e na distribuição segura de medicamentos e materiais dentro de hospitais, sempre sob a supervisão do farmacêutico. Voltada a técnicos em farmácia que querem trabalhar no ambiente hospitalar.'),
  ('higiene-ocupacional',
   'Com 400 horas, a Especialização Técnica em Higiene Ocupacional aprofunda a identificação, a avaliação e o controle de agentes físicos, químicos e biológicos no ambiente de trabalho, com uso de equipamentos de medição e normas regulamentadoras. Uma especialização para técnicos em segurança do trabalho.'),
  ('informacao-e-documentacao-escolar',
   'Em 480 horas, a Especialização Técnica em Informação e Documentação Escolar prepara você para organizar, gerenciar e preservar a documentação escolar, com registros acadêmicos, histórico, legislação educacional e sistemas de informação. Ideal para técnicos em secretaria escolar e profissionais administrativos da educação.'),
  ('instalacao-eletrica-predial-de-baixa-tensao',
   'Com 420 horas, esta especialização técnica aprofunda o dimensionamento, a montagem e a manutenção de instalações elétricas prediais de baixa tensão, de acordo com as normas técnicas e de segurança. Voltada a técnicos em eletrotécnica, eletroeletrônica e edificações que querem se destacar na área.'),
  ('manipulacao-em-laboratorio-de-farmacia',
   'Em 400 horas, a Especialização Técnica em Manipulação em Laboratório de Farmácia capacita você para manipular medicamentos e cosméticos com precisão, seguindo as boas práticas de manipulação e sob a supervisão do farmacêutico. Ideal para técnicos em farmácia que querem atuar em farmácias de manipulação.'),
  ('midias-digitais',
   'Com 400 horas, a Especialização Técnica em Mídias Digitais prepara você para planejar, criar e gerenciar conteúdos para redes sociais, sites e outras plataformas digitais, com noções de design, vídeo e métricas. Uma especialização para técnicos em marketing, informática e comunicação.'),
  ('oncologia',
   'Em 400 horas, a Especialização Técnica em Oncologia aprofunda o cuidado ao paciente com câncer, com foco em quimioterapia, radioterapia, biossegurança no manuseio de antineoplásicos e acolhimento ao paciente e à família. Voltada a técnicos de enfermagem que querem atuar em hospitais e centros oncológicos.'),
  ('prevencao-e-combate-a-incendio',
   'Com 400 horas, a Especialização Técnica em Prevenção e Combate a Incêndio capacita você para identificar riscos, elaborar planos de prevenção, formar e coordenar brigadas e atuar em situações de emergência. Ideal para técnicos em segurança do trabalho e profissionais da área de prevenção.'),
  ('redacao-de-contratos',
   'Em 400 horas, a Especialização Técnica em Redação de Contratos ensina a elaborar contratos claros, objetivos e juridicamente seguros, com noções de cláusulas, obrigações, prazos e revisão de documentos. Uma especialização para técnicos em serviços jurídicos, administração e transações imobiliárias.'),
  ('saude-do-trabalhador',
   'Com 400 horas, a Especialização Técnica em Saúde do Trabalhador aprofunda a identificação, a prevenção e o controle de riscos à saúde no ambiente de trabalho, com programas de saúde ocupacional, ergonomia e vigilância. Voltada a técnicos em segurança do trabalho e técnicos de enfermagem.'),
  ('saude-publica',
   'Em 400 horas, a Especialização Técnica em Saúde Pública prepara você para atuar na promoção da saúde e na prevenção de doenças nas comunidades, com políticas do SUS, vigilância em saúde e educação em saúde. Ideal para técnicos de enfermagem, agentes comunitários e profissionais da rede pública.'),
  ('seguranca-do-trabalho-na-construcao-civil',
   'Com 400 horas, esta especialização técnica aprofunda a identificação e o controle dos riscos específicos dos canteiros de obras, como trabalho em altura, escavações, máquinas e andaimes, com base nas normas regulamentadoras. Voltada a técnicos em segurança do trabalho que querem atuar na construção civil.'),
  ('terapia-intensiva',
   'Em 400 horas, a Especialização Técnica em Terapia Intensiva prepara você para o cuidado de pacientes em estado crítico, com monitorização, suporte a procedimentos, controle de infecções e uso de equipamentos de UTI. Voltada a técnicos de enfermagem que querem atuar em unidades de terapia intensiva.'),
  ('urgencia-e-emergencia-aph',
   'Com 400 horas, a Especialização Técnica em Urgência e Emergência / APH capacita você para a assistência rápida e segura a vítimas em situações críticas, no atendimento pré-hospitalar e em prontos-socorros. Ideal para técnicos de enfermagem que querem atuar no SAMU, em UPAs e em serviços de resgate.'),
  ('usinagem',
   'Em 480 horas, a Especialização Técnica em Usinagem aprofunda a operação de máquinas-ferramenta convencionais e CNC, a programação, a leitura de desenho técnico e o controle dimensional das peças. Uma especialização para técnicos em mecânica, mecatrônica e áreas afins.')
) as d (slug, texto)
where c.nivel_id = n.id
  and n.slug = 'pos-tecnico'
  and c.slug = d.slug
returning c.nome, c.descricao;
