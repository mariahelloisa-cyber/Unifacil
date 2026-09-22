import type { FaqItem } from "@/components/FaqAccordion";

/* Dúvidas frequentes mostradas na página de todos os cursos. É uma lista só,
   igual para todo mundo — para mudar as perguntas, mexa aqui. */
export const FAQ_CURSOS: FaqItem[] = [
  {
    pergunta: "O curso é reconhecido pelo MEC?",
    resposta: "Sim. Os cursos do programa são feitos em instituições parceiras reconhecidas pelo MEC.",
  },
  {
    pergunta: "Como são as aulas e as provas?",
    resposta:
      "Depende da instituição parceira e da modalidade do curso. Na página de cada curso você confere a modalidade e a duração, e o consultor explica como funcionam as aulas.",
  },
  {
    pergunta: "Quando posso começar?",
    resposta:
      "Assim que a matrícula é concluída e a sua vaga é confirmada na instituição parceira, você recebe as orientações para começar a estudar.",
  },
  {
    pergunta: "Tem desconto?",
    resposta:
      "Sim. Pelo programa, as vagas têm descontos de até 80% sobre o valor tradicional, e alunos de baixa renda podem ter acesso a vagas gratuitas.",
  },
];
