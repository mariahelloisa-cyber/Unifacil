import { TRAITS } from "./types.ts";
import type {
  AffinityLevel,
  QuizAnswers,
  QuizCourse,
  QuizQuestion,
  RankedCourse,
  Trait,
  TraitVector,
  TraitWeights,
} from "./types.ts";

/* ==========================================================================
   Scoring do teste vocacional — funções puras, sem React e sem aleatoriedade.

   1. calculateUserProfile: soma os pesos das respostas escolhidas e divide
      cada dimensão pelo máximo que ela poderia atingir no quiz. Sem essa
      normalização, dimensões que aparecem em mais respostas dominariam o
      vetor só por estarem mais presentes nas perguntas.
   2. calculateCourseSimilarity: similaridade de cosseno entre o vetor do
      usuário e o perfil do curso — compara a FORMA do perfil (proporção entre
      as dimensões), não a quantidade bruta de pontos.
   3. rankCourses: ordena todos os cursos reais que têm perfil.
   4. pickRecommendations: pega os melhores evitando cursos quase idênticos
      (ex.: três variações de Direito Penal no pódio).
   ========================================================================== */

function safe(n: number | undefined): number {
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0;
}

export function emptyVector(): TraitVector {
  return Object.fromEntries(TRAITS.map((t) => [t, 0])) as TraitVector;
}

/** Converte pesos parciais em vetor completo (ausente/inválido/negativo = 0). */
export function toVector(weights: TraitWeights): TraitVector {
  const v = emptyVector();
  for (const t of TRAITS) v[t] = safe(weights[t]);
  return v;
}

/** Mantém só respostas que existem no quiz atual (ids desconhecidos somem). */
export function sanitizeAnswers(answers: QuizAnswers, questions: QuizQuestion[]): QuizAnswers {
  const limpo: QuizAnswers = {};
  for (const q of questions) {
    const escolhida = answers[q.id];
    if (escolhida && q.answers.some((a) => a.id === escolhida)) limpo[q.id] = escolhida;
  }
  return limpo;
}

export function isQuizComplete(answers: QuizAnswers, questions: QuizQuestion[]): boolean {
  return questions.every((q) => q.answers.some((a) => a.id === answers[q.id]));
}

/** Soma bruta dos pesos das respostas escolhidas. Recalculada do zero a cada
 *  chamada: trocar uma resposta nunca soma duas vezes. */
export function calculateRawScores(answers: QuizAnswers, questions: QuizQuestion[]): TraitVector {
  const total = emptyVector();
  for (const q of questions) {
    const resposta = q.answers.find((a) => a.id === answers[q.id]);
    if (!resposta) continue;
    for (const t of TRAITS) total[t] += safe(resposta.weights[t]);
  }
  return total;
}

/** Quanto cada dimensão pode somar no máximo (melhor resposta de cada pergunta). */
export function calculateMaxScores(questions: QuizQuestion[]): TraitVector {
  const max = emptyVector();
  for (const q of questions) {
    for (const t of TRAITS) {
      max[t] += Math.max(0, ...q.answers.map((a) => safe(a.weights[t])));
    }
  }
  return max;
}

/** Perfil do usuário: cada dimensão de 0 a 1 (fração do máximo possível). */
export function calculateUserProfile(answers: QuizAnswers, questions: QuizQuestion[]): TraitVector {
  const bruto = calculateRawScores(answers, questions);
  const max = calculateMaxScores(questions);
  const perfil = emptyVector();
  for (const t of TRAITS) perfil[t] = max[t] > 0 ? bruto[t] / max[t] : 0;
  return perfil;
}

/** Similaridade de cosseno (0–1, já que todos os pesos são ≥ 0). Vetor zerado
 *  em qualquer lado retorna 0 — nunca NaN. */
export function calculateCourseSimilarity(user: TraitWeights, course: TraitWeights): number {
  let dot = 0;
  let nu = 0;
  let nc = 0;
  for (const t of TRAITS) {
    const u = safe(user[t]);
    const c = safe(course[t]);
    dot += u * c;
    nu += u * u;
    nc += c * c;
  }
  if (nu === 0 || nc === 0) return 0;
  return dot / (Math.sqrt(nu) * Math.sqrt(nc));
}

/** Dimensões que mais explicam o match: força no usuário × força no curso. */
export function getMatchTraits(user: TraitWeights, course: TraitWeights, limit = 3): Trait[] {
  return TRAITS.map((t) => ({ t, peso: safe(user[t]) * safe(course[t]) }))
    .filter((x) => x.peso > 0)
    .sort((a, b) => b.peso - a.peso) // sort estável: empate mantém a ordem de TRAITS
    .slice(0, limit)
    .map((x) => x.t);
}

/** Dimensões mais fortes do usuário, independentemente de curso. */
export function getTopUserTraits(user: TraitWeights, limit = 3): Trait[] {
  return TRAITS.map((t) => ({ t, v: safe(user[t]) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v)
    .slice(0, limit)
    .map((x) => x.t);
}

/** Ordena os cursos reais por afinidade. Só entram cursos presentes em
 *  `courses` E com perfil; slugs repetidos contam uma vez. Empate: nome, slug. */
export function rankCourses<C extends QuizCourse>(
  user: TraitWeights,
  courses: C[],
  profiles: Record<string, TraitWeights>
): RankedCourse<C>[] {
  const vistos = new Set<string>();
  const ranking: RankedCourse<C>[] = [];

  for (const course of courses) {
    if (vistos.has(course.slug)) continue;
    const perfil = Object.prototype.hasOwnProperty.call(profiles, course.slug)
      ? profiles[course.slug]
      : undefined;
    if (!perfil) continue;
    vistos.add(course.slug);
    ranking.push({
      course,
      score: calculateCourseSimilarity(user, perfil),
      topTraits: getMatchTraits(user, perfil),
    });
  }

  return ranking.sort(
    (a, b) =>
      b.score - a.score ||
      a.course.nome.localeCompare(b.course.nome, "pt-BR") ||
      a.course.slug.localeCompare(b.course.slug)
  );
}

/** Seleciona `count` recomendações na ordem do ranking, pulando cursos cujo
 *  perfil é praticamente igual ao de um já escolhido. Se não houver opções
 *  distintas suficientes, completa com os próximos do ranking. */
export function pickRecommendations<C extends QuizCourse>(
  ranked: RankedCourse<C>[],
  profiles: Record<string, TraitWeights>,
  count = 3,
  maxProfileSimilarity = 0.97
): RankedCourse<C>[] {
  const escolhidos: RankedCourse<C>[] = [];

  for (const item of ranked) {
    if (escolhidos.length >= count) break;
    const parecido = escolhidos.some(
      (e) => calculateCourseSimilarity(profiles[e.course.slug] ?? {}, profiles[item.course.slug] ?? {}) >= maxProfileSimilarity
    );
    if (!parecido) escolhidos.push(item);
  }

  for (const item of ranked) {
    if (escolhidos.length >= count) break;
    if (!escolhidos.some((e) => e.course.slug === item.course.slug)) escolhidos.push(item);
  }

  return escolhidos;
}

/* Faixas qualitativas do cosseno. Calibradas simulando combinações de
   resposta com o catálogo real: o 1º colocado tem mediana ~0,76 e p90 ~0,84.
   Nunca exibimos o número como "% de compatibilidade" — é só uma pontuação
   relativa do quiz, não uma probabilidade científica. */
export const AFFINITY_THRESHOLDS = { muitoAlta: 0.8, alta: 0.7 } as const;

export function affinityLevel(score: number): AffinityLevel {
  if (score >= AFFINITY_THRESHOLDS.muitoAlta) return "muito-alta";
  if (score >= AFFINITY_THRESHOLDS.alta) return "alta";
  return "boa";
}

export const AFFINITY_LABEL: Record<AffinityLevel, string> = {
  "muito-alta": "Muito alta afinidade",
  alta: "Alta afinidade",
  boa: "Boa afinidade",
};
