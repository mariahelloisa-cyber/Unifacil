/* Testes do scoring do teste vocacional — `npm test` (node:test nativo, sem
   dependências novas; o Node 24 executa TypeScript direto). */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { COURSE_AFFINITY_PROFILES } from "./courseAffinityProfiles.ts";
import { buildMainExplanation, buildShortExplanation } from "./explanation.ts";
import { QUESTIONS, QUIZ_VERSION } from "./questions.ts";
import {
  affinityLevel,
  calculateCourseSimilarity,
  calculateRawScores,
  calculateUserProfile,
  getMatchTraits,
  pickRecommendations,
  rankCourses,
  sanitizeAnswers,
} from "./scoring.ts";
import { parsePersistedQuiz } from "./storage.ts";
import { TRAITS } from "./types.ts";
import type { QuizAnswers, QuizCourse, QuizQuestion, TraitWeights } from "./types.ts";

const curso = (slug: string, nome = slug): QuizCourse => ({
  slug,
  nome,
  nivelSlug: "pos-graduacao",
  nivelNome: "Pós-Graduação",
  area: "",
  modalidade: "EAD",
  duracao: "",
  capaUrl: "",
});

const MINI_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "",
    answers: [
      { id: "a", label: "", weights: { analysis: 3, technology: 1 } },
      { id: "b", label: "", weights: { people: 2 } },
    ],
  },
  {
    id: "q2",
    question: "",
    answers: [
      { id: "a", label: "", weights: { analysis: 2 } },
      { id: "b", label: "", weights: { care: 3, people: 1 } },
    ],
  },
];

const MINI_PROFILES: Record<string, TraitWeights> = {
  dados: { analysis: 5, technology: 3 },
  pessoas: { people: 5, care: 2 },
  saude: { care: 5, people: 2 },
};
const MINI_CATALOGO = [curso("dados", "Dados"), curso("pessoas", "Pessoas"), curso("saude", "Saúde")];

const todasIguais = (id: string): QuizAnswers => Object.fromEntries(QUESTIONS.map((q) => [q.id, id]));
const catalogoReal = Object.keys(COURSE_AFFINITY_PROFILES).map((slug) => curso(slug));

describe("calculateRawScores / calculateUserProfile", () => {
  test("todas as respostas contam corretamente", () => {
    const bruto = calculateRawScores({ q1: "a", q2: "b" }, MINI_QUIZ);
    assert.equal(bruto.analysis, 3);
    assert.equal(bruto.technology, 1);
    assert.equal(bruto.care, 3);
    assert.equal(bruto.people, 1);
    assert.equal(bruto.leadership, 0);
  });

  test("com o quiz real, o total bruto é a soma dos pesos escolhidos", () => {
    const respostas = todasIguais("c");
    const esperado = QUESTIONS.reduce(
      (soma, q) =>
        soma + Object.values(q.answers.find((a) => a.id === "c")!.weights).reduce((s, v) => s + (v ?? 0), 0),
      0
    );
    const bruto = calculateRawScores(respostas, QUESTIONS);
    assert.equal(
      TRAITS.reduce((s, t) => s + bruto[t], 0),
      esperado
    );
  });

  test("trocar uma resposta não duplica pontuação", () => {
    const antes: QuizAnswers = { q1: "a", q2: "a" };
    const depois: QuizAnswers = { ...antes, q1: "b" };
    const bruto = calculateRawScores(depois, MINI_QUIZ);
    assert.deepEqual(bruto, calculateRawScores({ q2: "a", q1: "b" }, MINI_QUIZ));
    assert.equal(bruto.analysis, 2);
    assert.equal(bruto.people, 2);
    // Recalcular várias vezes não acumula nada.
    assert.deepEqual(calculateUserProfile(depois, MINI_QUIZ), calculateUserProfile(depois, MINI_QUIZ));
  });

  test("perfil normalizado fica entre 0 e 1", () => {
    const perfil = calculateUserProfile({ q1: "a", q2: "a" }, MINI_QUIZ);
    assert.equal(perfil.analysis, 1);
    for (const t of TRAITS) assert.ok(perfil[t] >= 0 && perfil[t] <= 1, t);
  });

  test("respostas com ids inexistentes são ignoradas", () => {
    assert.deepEqual(sanitizeAnswers({ q1: "z", q2: "b", q99: "a" }, MINI_QUIZ), { q2: "b" });
    assert.equal(calculateRawScores({ q1: "z" }, MINI_QUIZ).analysis, 0);
  });
});

describe("calculateCourseSimilarity", () => {
  test("ausência de dimensões não gera NaN", () => {
    const vazio = calculateUserProfile({}, QUESTIONS);
    for (const perfil of Object.values(COURSE_AFFINITY_PROFILES)) {
      const s = calculateCourseSimilarity(vazio, perfil);
      assert.ok(Number.isFinite(s));
      assert.equal(s, 0);
    }
    assert.equal(calculateCourseSimilarity({ analysis: 1 }, {}), 0);
    assert.equal(calculateCourseSimilarity({ analysis: Number.NaN, care: 2 }, { care: 3 }), 1);
  });

  test("vetores proporcionais têm similaridade 1", () => {
    assert.ok(Math.abs(calculateCourseSimilarity({ analysis: 2, care: 1 }, { analysis: 4, care: 2 }) - 1) < 1e-12);
  });
});

describe("rankCourses", () => {
  test("cursos são ordenados por afinidade", () => {
    const perfil = calculateUserProfile({ q1: "a", q2: "a" }, MINI_QUIZ);
    const ranking = rankCourses(perfil, MINI_CATALOGO, MINI_PROFILES);
    assert.equal(ranking[0].course.slug, "dados");
    for (let i = 1; i < ranking.length; i++) assert.ok(ranking[i - 1].score >= ranking[i].score);

    const real = rankCourses(calculateUserProfile(todasIguais("b"), QUESTIONS), catalogoReal, COURSE_AFFINITY_PROFILES);
    for (let i = 1; i < real.length; i++) assert.ok(real[i - 1].score >= real[i].score);
  });

  test("só retorna cursos existentes e com perfil", () => {
    const perfis = { ...MINI_PROFILES, fantasma: { analysis: 5 } };
    const catalogo = [...MINI_CATALOGO, curso("sem-perfil")];
    const slugs = rankCourses({ analysis: 1 }, catalogo, perfis).map((r) => r.course.slug);
    assert.ok(!slugs.includes("fantasma"));
    assert.ok(!slugs.includes("sem-perfil"));
    assert.deepEqual([...slugs].sort(), ["dados", "pessoas", "saude"]);
  });

  test("é determinístico (mesmas respostas, mesmo ranking)", () => {
    const perfil = calculateUserProfile(todasIguais("d"), QUESTIONS);
    const a = rankCourses(perfil, catalogoReal, COURSE_AFFINITY_PROFILES).map((r) => r.course.slug);
    const b = rankCourses(perfil, [...catalogoReal].reverse(), COURSE_AFFINITY_PROFILES).map((r) => r.course.slug);
    assert.deepEqual(a, b);
  });

  test("usuários com respostas diferentes recebem rankings diferentes", () => {
    const top = (id: string) =>
      rankCourses(calculateUserProfile(todasIguais(id), QUESTIONS), catalogoReal, COURSE_AFFINITY_PROFILES)
        .slice(0, 5)
        .map((r) => r.course.slug);
    const rankings = ["a", "b", "c", "d"].map(top);
    for (let i = 0; i < rankings.length; i++) {
      for (let j = i + 1; j < rankings.length; j++) assert.notDeepEqual(rankings[i], rankings[j]);
    }
  });
});

describe("pickRecommendations", () => {
  test("top 3 não possui duplicatas, mesmo com slug repetido no catálogo", () => {
    const catalogo = [...MINI_CATALOGO, curso("dados", "Dados (duplicado)")];
    const top = pickRecommendations(rankCourses({ analysis: 1, people: 1 }, catalogo, MINI_PROFILES), MINI_PROFILES);
    const slugs = top.map((r) => r.course.slug);
    assert.equal(slugs.length, 3);
    assert.equal(new Set(slugs).size, 3);
  });

  test("com o catálogo real, sempre 3 cursos distintos", () => {
    for (const id of ["a", "b", "c", "d"]) {
      const perfil = calculateUserProfile(todasIguais(id), QUESTIONS);
      const top = pickRecommendations(rankCourses(perfil, catalogoReal, COURSE_AFFINITY_PROFILES), COURSE_AFFINITY_PROFILES);
      assert.equal(new Set(top.map((r) => r.course.slug)).size, 3);
    }
  });

  test("pula cursos com perfil praticamente igual a um já escolhido", () => {
    const perfis = { a: { analysis: 5 }, "a-clone": { analysis: 4 }, b: { analysis: 3, care: 3 } };
    const catalogo = [curso("a"), curso("a-clone"), curso("b")];
    const top = pickRecommendations(rankCourses({ analysis: 1 }, catalogo, perfis), perfis, 2);
    assert.deepEqual(
      top.map((r) => r.course.slug),
      ["a", "b"]
    );
  });
});

describe("dados do quiz", () => {
  test("perguntas têm ids únicos, 4 respostas e pesos válidos", () => {
    assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, QUESTIONS.length);
    for (const q of QUESTIONS) {
      assert.equal(q.answers.length, 4, q.id);
      assert.equal(new Set(q.answers.map((a) => a.id)).size, 4, q.id);
      for (const a of q.answers) {
        for (const [t, v] of Object.entries(a.weights)) {
          assert.ok((TRAITS as readonly string[]).includes(t), `${q.id}.${a.id}: ${t}`);
          assert.ok(Number.isFinite(v) && v! > 0, `${q.id}.${a.id}: ${t}`);
        }
      }
    }
  });

  test("todas as dimensões podem ser pontuadas pelo quiz", () => {
    for (const t of TRAITS) {
      assert.ok(
        QUESTIONS.some((q) => q.answers.some((a) => (a.weights[t] ?? 0) > 0)),
        t
      );
    }
  });

  test("perfis dos cursos usam dimensões válidas na escala 1–5", () => {
    for (const [slug, perfil] of Object.entries(COURSE_AFFINITY_PROFILES)) {
      assert.ok(Object.keys(perfil).length > 0, slug);
      for (const [t, v] of Object.entries(perfil)) {
        assert.ok((TRAITS as readonly string[]).includes(t), `${slug}: ${t}`);
        assert.ok(Number.isInteger(v) && v! >= 1 && v! <= 5, `${slug}: ${t}`);
      }
    }
  });
});

describe("explicação e faixas", () => {
  test("explicação usa as dimensões que mais contribuíram", () => {
    const traits = getMatchTraits({ management: 1, leadership: 0.8, care: 0.1 }, { management: 5, leadership: 4, analysis: 3 });
    assert.deepEqual(traits, ["management", "leadership"]);
    assert.match(buildMainExplanation(traits), /gestão e liderança/);
    assert.match(buildShortExplanation(traits), /organizar recursos.*com afinidade para liderança\./);
    assert.ok(buildMainExplanation([]).length > 0);
  });

  test("faixas de afinidade", () => {
    assert.equal(affinityLevel(0.95), "muito-alta");
    assert.equal(affinityLevel(0.75), "alta");
    assert.equal(affinityLevel(0.2), "boa");
  });
});

describe("parsePersistedQuiz", () => {
  test("descarta versão antiga, JSON inválido e formato estranho", () => {
    assert.equal(parsePersistedQuiz(JSON.stringify({ version: QUIZ_VERSION - 1, status: "quiz", answers: {} })), null);
    assert.equal(parsePersistedQuiz("{oops"), null);
    assert.equal(parsePersistedQuiz(JSON.stringify({ version: QUIZ_VERSION, status: "hack" })), null);
  });

  test("não deixa pular pergunta sem resposta e limpa ids inválidos", () => {
    const salvo = parsePersistedQuiz(
      JSON.stringify({ version: QUIZ_VERSION, status: "quiz", currentQuestion: 7, answers: { q1: "a", q2: "x" } })
    );
    assert.deepEqual(salvo, { version: QUIZ_VERSION, status: "quiz", currentQuestion: 1, answers: { q1: "a" } });
  });

  test("resultado só é restaurado com o quiz completo", () => {
    const incompleto = parsePersistedQuiz(JSON.stringify({ version: QUIZ_VERSION, status: "result", answers: { q1: "a" } }));
    assert.equal(incompleto?.status, "quiz");
    const completo = parsePersistedQuiz(JSON.stringify({ version: QUIZ_VERSION, status: "result", answers: todasIguais("a") }));
    assert.equal(completo?.status, "result");
  });
});
