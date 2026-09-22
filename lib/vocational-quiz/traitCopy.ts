import type { Trait } from "./types.ts";

/* Textos das dimensões para montar a explicação do resultado. Tudo
   determinístico e local: nenhuma API ou IA gera esses textos. */
export const TRAIT_COPY: Record<Trait, { label: string; phrase: string }> = {
  analysis: {
    label: "análise e lógica",
    phrase: "você gosta de olhar para números e informações até encontrar o padrão por trás deles",
  },
  technology: {
    label: "tecnologia",
    phrase: "você demonstra curiosidade por ferramentas, sistemas e soluções digitais",
  },
  science: {
    label: "ciência",
    phrase: "você se interessa por entender como o corpo, a natureza e as coisas funcionam de verdade",
  },
  management: {
    label: "gestão",
    phrase: "você demonstra interesse em organizar recursos e transformar ideias em planos",
  },
  leadership: {
    label: "liderança",
    phrase: "você tende a assumir a frente, tomar decisões e conduzir pessoas",
  },
  strategy: {
    label: "estratégia",
    phrase: "você pensa no longo prazo e gosta de enxergar o caminho antes de dar o passo",
  },
  organization: {
    label: "organização",
    phrase: "você valoriza método, processos bem definidos e trabalho feito com precisão",
  },
  communication: {
    label: "comunicação",
    phrase: "você tende a se sentir confortável transmitindo ideias e conectando pessoas",
  },
  creativity: {
    label: "criatividade",
    phrase: "você busca caminhos novos e gosta de criar o que ainda não existe",
  },
  people: {
    label: "relacionamento com pessoas",
    phrase: "você se energiza no contato com gente, na troca e no trabalho em equipe",
  },
  care: {
    label: "cuidado com o outro",
    phrase: "você se realiza quando consegue fazer diferença no bem-estar de alguém",
  },
  behavior: {
    label: "comportamento humano",
    phrase: "você tem curiosidade genuína sobre por que as pessoas pensam e agem como agem",
  },
  education: {
    label: "ensino",
    phrase: "você gosta de ajudar alguém a aprender, evoluir e ganhar autonomia",
  },
  justice: {
    label: "justiça e ética",
    phrase: "você se importa com regras claras, direitos e com o que é certo",
  },
  social: {
    label: "impacto social",
    phrase: "você quer que o seu trabalho melhore a vida da comunidade ao seu redor",
  },
  practical: {
    label: "atuação prática",
    phrase: "você prefere pôr a mão na massa e ver o resultado acontecer",
  },
};
