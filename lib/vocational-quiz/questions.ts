import type { QuizQuestion } from "./types.ts";

/** Suba este número sempre que perguntas/respostas mudarem de id ou sentido:
 *  testes salvos no sessionStorage com outra versão são descartados. */
export const QUIZ_VERSION = 1;

/* Perguntas comportamentais: nenhuma cita um curso ou área diretamente. Cada
   resposta distribui pesos (1–3) por várias dimensões — não existe "A = curso X". */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Quando surge um problema complicado, o que você tende a fazer?",
    answers: [
      { id: "a", label: "Tento entender a lógica por trás dele.", weights: { analysis: 3, technology: 1, science: 1 } },
      { id: "b", label: "Converso com as pessoas envolvidas.", weights: { people: 3, communication: 2, behavior: 1 } },
      { id: "c", label: "Procuro uma solução diferente do convencional.", weights: { creativity: 3, strategy: 1, technology: 1 } },
      { id: "d", label: "Organizo tudo e monto um plano.", weights: { organization: 3, management: 2, strategy: 1 } },
    ],
  },
  {
    id: "q2",
    question: "Qual destas atividades parece mais interessante?",
    answers: [
      { id: "a", label: "Analisar informações e encontrar padrões.", weights: { analysis: 3, technology: 1, organization: 1 } },
      { id: "b", label: "Criar uma campanha ou apresentar uma ideia.", weights: { communication: 3, creativity: 2, strategy: 1 } },
      { id: "c", label: "Coordenar uma equipe ou um projeto.", weights: { leadership: 3, management: 2, people: 1 } },
      { id: "d", label: "Ajudar alguém a aprender ou evoluir.", weights: { education: 3, care: 1, behavior: 1 } },
    ],
  },
  {
    id: "q3",
    question: "Em um trabalho em grupo, qual papel você assume naturalmente?",
    answers: [
      { id: "a", label: "Quem estrutura o plano.", weights: { organization: 2, strategy: 2, management: 1 } },
      { id: "b", label: "Quem apresenta e comunica.", weights: { communication: 3, leadership: 1, people: 1 } },
      { id: "c", label: "Quem resolve a parte técnica.", weights: { technology: 2, practical: 2, analysis: 1 } },
      { id: "d", label: "Quem mantém o grupo unido.", weights: { people: 2, care: 2, behavior: 1 } },
    ],
  },
  {
    id: "q4",
    question: "O que mais te daria orgulho no fim de um dia de trabalho?",
    answers: [
      { id: "a", label: "Ter feito diferença na saúde ou no bem-estar de alguém.", weights: { care: 3, science: 1, practical: 1 } },
      { id: "b", label: "Ter garantido que algo foi feito do jeito certo e justo.", weights: { justice: 3, organization: 1, social: 1 } },
      { id: "c", label: "Ter feito um negócio ou projeto crescer.", weights: { management: 2, strategy: 2, leadership: 1 } },
      { id: "d", label: "Ter visto alguém entender algo que antes não entendia.", weights: { education: 3, communication: 1, people: 1 } },
    ],
  },
  {
    id: "q5",
    question: "Numa conversa entre amigos, sobre o que você fica horas falando?",
    answers: [
      { id: "a", label: "Por que as pessoas agem e sentem do jeito que sentem.", weights: { behavior: 3, people: 1, care: 1 } },
      { id: "b", label: "Direitos, política e o que é certo ou errado.", weights: { justice: 3, social: 1, communication: 1 } },
      { id: "c", label: "Novidades de tecnologia, ciência ou inovação.", weights: { technology: 2, science: 2, creativity: 1 } },
      { id: "d", label: "Dinheiro, mercado e oportunidades de negócio.", weights: { strategy: 2, management: 1, analysis: 2 } },
    ],
  },
  {
    id: "q6",
    question: "Qual ambiente de trabalho parece mais a sua cara?",
    answers: [
      { id: "a", label: "Um lugar onde cuido de pessoas de perto.", weights: { care: 3, people: 1, practical: 1 } },
      { id: "b", label: "Uma sala de aula ou um espaço de aprendizagem.", weights: { education: 3, social: 1, communication: 1 } },
      { id: "c", label: "Uma empresa com metas, clientes e decisões rápidas.", weights: { management: 2, leadership: 2, strategy: 1 } },
      { id: "d", label: "Um lugar com sistemas, obras ou operações acontecendo.", weights: { practical: 2, technology: 2, organization: 1 } },
    ],
  },
  {
    id: "q7",
    question: "Diante de uma decisão importante, o que pesa mais para você?",
    answers: [
      { id: "a", label: "Os números e os dados disponíveis.", weights: { analysis: 3, strategy: 1, organization: 1 } },
      { id: "b", label: "Como as pessoas envolvidas vão ser afetadas.", weights: { people: 2, behavior: 1, social: 2 } },
      { id: "c", label: "As regras e as consequências de cada caminho.", weights: { justice: 2, organization: 2, analysis: 1 } },
      { id: "d", label: "Onde isso me leva a longo prazo.", weights: { strategy: 3, leadership: 1, management: 1 } },
    ],
  },
  {
    id: "q8",
    question: "Que tipo de desafio te dá mais energia?",
    answers: [
      { id: "a", label: "Convencer alguém de uma ideia.", weights: { communication: 3, strategy: 1, people: 1 } },
      { id: "b", label: "Fazer algo funcionar com precisão, sem erros.", weights: { organization: 2, practical: 2, analysis: 1 } },
      { id: "c", label: "Dar um jeito de incluir quem está ficando de fora.", weights: { social: 2, education: 1, care: 2 } },
      { id: "d", label: "Criar algo que ainda não existe.", weights: { creativity: 3, technology: 1, strategy: 1 } },
    ],
  },
  {
    id: "q9",
    question: "Se você tivesse uma tarde livre para aprender algo, escolheria…",
    answers: [
      { id: "a", label: "Como o corpo e a mente funcionam.", weights: { science: 2, behavior: 2, care: 1 } },
      { id: "b", label: "Como liderar e motivar pessoas.", weights: { leadership: 3, people: 1, behavior: 1 } },
      { id: "c", label: "Como proteger, automatizar ou melhorar um sistema.", weights: { technology: 3, analysis: 1, practical: 1 } },
      { id: "d", label: "Como contar histórias, criar conteúdo ou se expressar.", weights: { creativity: 2, communication: 2, education: 1 } },
    ],
  },
  {
    id: "q10",
    question: "Que marca você gostaria de deixar com o seu trabalho?",
    answers: [
      { id: "a", label: "Uma sociedade mais justa e segura.", weights: { justice: 2, social: 3 } },
      { id: "b", label: "Pessoas mais saudáveis e felizes.", weights: { care: 2, behavior: 2, people: 1 } },
      { id: "c", label: "Organizações mais eficientes e bem-sucedidas.", weights: { management: 2, organization: 1, strategy: 2 } },
      { id: "d", label: "Gente que aprendeu e se transformou.", weights: { education: 3, social: 1, communication: 1 } },
    ],
  },
];
