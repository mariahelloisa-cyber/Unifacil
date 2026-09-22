import { QUESTIONS, QUIZ_VERSION } from "./questions.ts";
import { isQuizComplete, sanitizeAnswers } from "./scoring.ts";
import type { QuizAnswers, QuizQuestion } from "./types.ts";

/* Estado do teste com persistência no sessionStorage (um refresh acidental
   não perde o progresso). Só guarda ids de pergunta/resposta — nenhum dado
   pessoal. Funciona como store externo do useSyncExternalStore: o servidor
   sempre renderiza a tela inicial e o cliente assume o estado salvo na
   hidratação, sem setState dentro de efeito. */

export const STORAGE_KEY = "la-vocational-quiz";

/* A tela de abertura mora na home (QuizIntro); /teste-vocacional já começa
   na primeira pergunta. */
export type QuizStatus = "quiz" | "result";

export type PersistedQuiz = {
  version: number;
  status: QuizStatus;
  currentQuestion: number;
  answers: QuizAnswers;
};

export const INITIAL_QUIZ: PersistedQuiz = {
  version: QUIZ_VERSION,
  status: "quiz",
  currentQuestion: 0,
  answers: {},
};

/** Valida e normaliza o que veio do storage. Versão diferente, JSON inválido
 *  ou formato estranho = descarta (null). */
export function parsePersistedQuiz(
  raw: string | null,
  questions: QuizQuestion[] = QUESTIONS,
  version: number = QUIZ_VERSION
): PersistedQuiz | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const d = data as Partial<PersistedQuiz>;
  if (d.version !== version) return null;
  if (d.status !== "quiz" && d.status !== "result") return null;

  const answers = sanitizeAnswers(
    d.answers && typeof d.answers === "object" ? (d.answers as QuizAnswers) : {},
    questions
  );

  if (d.status === "result" && isQuizComplete(answers, questions)) {
    return { version, status: "result", currentQuestion: questions.length - 1, answers };
  }
  /* Nunca deixa pular pergunta sem resposta: a posição fica, no máximo, na
     primeira ainda não respondida. */
  const primeiraAberta = questions.findIndex((q) => !answers[q.id]);
  const limite = primeiraAberta === -1 ? questions.length - 1 : primeiraAberta;
  const pedido = Number.isInteger(d.currentQuestion) ? (d.currentQuestion as number) : 0;
  return { version, status: "quiz", currentQuestion: Math.min(Math.max(pedido, 0), limite), answers };
}

let memoria: PersistedQuiz | null = null;
const ouvintes = new Set<() => void>();

function lerStorage(): PersistedQuiz {
  try {
    return parsePersistedQuiz(window.sessionStorage.getItem(STORAGE_KEY)) ?? INITIAL_QUIZ;
  } catch {
    // sessionStorage bloqueado (modo privado, iframe): segue só em memória.
    return INITIAL_QUIZ;
  }
}

export const quizStore = {
  subscribe(ouvinte: () => void) {
    ouvintes.add(ouvinte);
    return () => {
      ouvintes.delete(ouvinte);
    };
  },
  getSnapshot(): PersistedQuiz {
    if (!memoria) memoria = lerStorage();
    return memoria;
  },
  getServerSnapshot(): PersistedQuiz {
    return INITIAL_QUIZ;
  },
  set(proximo: PersistedQuiz) {
    memoria = proximo;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(proximo));
    } catch {
      /* sem storage: o estado em memória continua valendo */
    }
    ouvintes.forEach((o) => o());
  },
};
