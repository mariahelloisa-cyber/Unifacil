/* Teste vocacional — tipos compartilhados entre dados, scoring e interface.

   As dimensões foram escolhidas a partir do catálogo real de cursos (quase todo
   pós-graduação): Direito, gestão/MBA, finanças, marketing e comunicação,
   psicologia e terapias, saúde, educação e inclusão, engenharias e TI. */

export const TRAITS = [
  "analysis", // números, dados, lógica, padrões
  "technology", // sistemas, ferramentas e soluções digitais
  "science", // corpo humano, biologia, natureza, método científico
  "management", // organizar recursos e fazer um negócio/projeto funcionar
  "leadership", // conduzir pessoas e tomar decisões
  "strategy", // visão de longo prazo, planejamento, mercado
  "organization", // processos, método, precisão, qualidade
  "communication", // transmitir ideias, argumentar, apresentar
  "creativity", // criar, inovar, expressão
  "people", // relacionamento, negociação, trabalho em equipe
  "care", // cuidar da saúde e do bem-estar de alguém
  "behavior", // entender a mente e o comportamento humano
  "education", // ensinar e acompanhar o desenvolvimento de alguém
  "justice", // leis, normas, ética, defesa de direitos
  "social", // impacto coletivo, comunidade, sustentabilidade
  "practical", // mão na massa, atuação técnica e de campo
] as const;

export type Trait = (typeof TRAITS)[number];

export type TraitWeights = Partial<Record<Trait, number>>;

/** Vetor completo: toda dimensão presente (0 quando não pontuou). */
export type TraitVector = Record<Trait, number>;

export type QuizAnswer = {
  id: string;
  label: string;
  weights: TraitWeights;
};

export type QuizQuestion = {
  id: string;
  question: string;
  answers: QuizAnswer[];
};

/** Respostas escolhidas: { q1: "b", q2: "d" }. O perfil é sempre recalculado
 *  a partir daqui — nunca acumulado — então voltar e trocar não duplica. */
export type QuizAnswers = Record<string, string>;

/** Dados mínimos de um curso real que o quiz precisa (subconjunto de Course). */
export type QuizCourse = {
  slug: string;
  nivelSlug: string;
  nivelNome: string;
  nome: string;
  area: string;
  modalidade: string;
  duracao: string;
  capaUrl: string;
};

export type AffinityLevel = "muito-alta" | "alta" | "boa";

export type RankedCourse<C extends QuizCourse = QuizCourse> = {
  course: C;
  /** Similaridade de cosseno entre o perfil do usuário e o do curso (0–1).
   *  É uma pontuação RELATIVA deste quiz, não uma probabilidade científica. */
  score: number;
  /** Dimensões que mais contribuíram para o match (maior primeiro). */
  topTraits: Trait[];
};
