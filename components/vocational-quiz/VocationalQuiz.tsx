"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { trackVocationalEvent } from "@/lib/vocational-quiz/analytics";
import { COURSE_AFFINITY_PROFILES } from "@/lib/vocational-quiz/courseAffinityProfiles";
import { QUESTIONS } from "@/lib/vocational-quiz/questions";
import { calculateUserProfile, pickRecommendations, rankCourses } from "@/lib/vocational-quiz/scoring";
import { INITIAL_QUIZ, quizStore } from "@/lib/vocational-quiz/storage";
import type { QuizAnswers, QuizCourse } from "@/lib/vocational-quiz/types";
import QuizProcessing from "./QuizProcessing";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";

/* Mesmo padrão do AnimatedText: estados de animação aplicados antes da
   pintura, sem o aviso de useLayoutEffect no SSR. */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Tempo com a opção destacada antes de ir para a próxima pergunta. */
const SELECAO_MS = 260;
/** Tela "Analisando suas respostas…" — curta de propósito. */
const PROCESSAMENTO_MS = 1700;

function movimentoReduzido() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function recomendar(answers: QuizAnswers, courses: QuizCourse[]) {
  const perfil = calculateUserProfile(answers, QUESTIONS);
  return pickRecommendations(rankCourses(perfil, courses, COURSE_AFFINITY_PROFILES), COURSE_AFFINITY_PROFILES, 3);
}

export default function VocationalQuiz({ courses }: { courses: QuizCourse[] }) {
  /* Estado persistido (status, pergunta atual, respostas) mora no store com
     sessionStorage; aqui só o que é transitório. */
  const quiz = useSyncExternalStore(quizStore.subscribe, quizStore.getSnapshot, quizStore.getServerSnapshot);
  const [processing, setProcessing] = useState(false);

  const quizState = processing ? "processing" : quiz.status;
  const { currentQuestion, answers } = quiz;

  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const directionRef = useRef<1 | -1>(1);
  const userNavRef = useRef(false);
  const lastStateRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const userProfile = useMemo(() => calculateUserProfile(answers, QUESTIONS), [answers]);
  const results = useMemo(
    () => (quiz.status === "result" ? recomendar(answers, courses) : []),
    [quiz.status, answers, courses]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const esperar = (ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  /** Anima a saída do conteúdo atual e só então troca o estado. */
  const sair = (escopo: "tela" | "pergunta", direcao: 1 | -1, trocar: () => void) => {
    busyRef.current = true;
    directionRef.current = direcao;
    userNavRef.current = true;
    const concluir = () => {
      trocar();
      busyRef.current = false;
    };
    const alvo = escopo === "pergunta" ? questionRef.current : screenRef.current;
    if (!alvo || movimentoReduzido()) return concluir();
    /* Saindo do resultado só com opacidade: um transform no wrapper viraria o
       bloco de contenção dos cards pinados pelo ScrollTrigger. */
    const deslocamento = quizStore.getSnapshot().status === "result" ? {} : { y: -20 * direcao };
    gsap.to(alvo, { autoAlpha: 0, ...deslocamento, duration: 0.22, ease: "power2.in", onComplete: concluir });
  };

  /* Entrada da nova tela/pergunta. Na primeira pintura não anima: o HTML do
     servidor já está visível e escondê-lo agora faria piscar. */
  const chaveTela = quizState === "quiz" ? `quiz-${currentQuestion}` : quizState;
  useEfeitoAntesDaPintura(() => {
    const anterior = lastStateRef.current;
    lastStateRef.current = quizState;
    if (anterior === null) return;

    const mesmaTela = anterior === "quiz" && quizState === "quiz";
    const alvo = mesmaTela ? questionRef.current : screenRef.current;
    if (!alvo) return;

    if (movimentoReduzido()) {
      gsap.set(alvo, { clearProps: "opacity,visibility,transform" });
    } else if (quizState === "result") {
      // Resultado: sem transform no wrapper (ele contém os pins da pilha).
      gsap.fromTo(alvo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.fromTo(
        alvo,
        { autoAlpha: 0, y: 20 * directionRef.current },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", clearProps: "transform" }
      );
    }
    if (!movimentoReduzido()) {
      const cascata = alvo.querySelectorAll("[data-stagger]");
      if (cascata.length > 0) {
        gsap.from(cascata, { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.08, delay: 0.08, ease: "power3.out" });
      }
    }

    /* Só depois de uma ação da pessoa: sobe até o topo do teste (o header é
       sticky) e leva o foco ao novo título, para teclado e leitor de tela. */
    if (userNavRef.current) {
      userNavRef.current = false;
      const root = rootRef.current;
      const chrome = document.querySelector<HTMLElement>("[data-site-chrome]")?.offsetHeight ?? 0;
      if (root) {
        const topo = root.getBoundingClientRect().top;
        if (topo < chrome) window.scrollTo({ top: window.scrollY + topo - chrome, behavior: "instant" });
      }
      alvo.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    }
  }, [chaveTela]);

  const finalizar = () => {
    const snap = quizStore.getSnapshot();
    const top = recomendar(snap.answers, courses);
    trackVocationalEvent("vocational_quiz_completed", {
      recommended_course_slug: top[0]?.course.slug ?? "",
      recommended_courses: top.map((r) => r.course.slug).join(","),
    });
    sair("tela", 1, () => {
      setProcessing(false);
      quizStore.set({ ...quizStore.getSnapshot(), status: "result" });
    });
  };

  const responder = (questionId: string, answerId: string) => {
    if (busyRef.current) return;
    const snap = quizStore.getSnapshot();
    const index = QUESTIONS.findIndex((q) => q.id === questionId);
    if (index !== snap.currentQuestion) return;

    busyRef.current = true;
    // Guarda só o id: o perfil é sempre recalculado a partir de `answers`.
    quizStore.set({ ...snap, answers: { ...snap.answers, [questionId]: answerId } });
    trackVocationalEvent("vocational_question_answered", {
      question_id: questionId,
      answer_id: answerId,
      question_number: index + 1,
    });

    esperar(SELECAO_MS, () => {
      if (index === QUESTIONS.length - 1) {
        sair("tela", 1, () => {
          setProcessing(true);
          busyRef.current = true; // nada clicável até o resultado
          esperar(PROCESSAMENTO_MS, finalizar);
        });
      } else {
        sair("pergunta", 1, () => {
          const atual = quizStore.getSnapshot();
          quizStore.set({ ...atual, currentQuestion: index + 1 });
        });
      }
    });
  };

  const voltar = () => {
    if (busyRef.current) return;
    // Na 1ª pergunta o "Voltar" é um link para a chamada na home (QuizQuestion).
    if (quizStore.getSnapshot().currentQuestion === 0) return;
    sair("pergunta", -1, () => {
      const atual = quizStore.getSnapshot();
      quizStore.set({ ...atual, currentQuestion: atual.currentQuestion - 1 });
    });
  };

  const refazer = () => {
    if (busyRef.current) return;
    trackVocationalEvent("vocational_quiz_restarted", { from_state: quizStore.getSnapshot().status });
    sair("tela", 1, () => quizStore.set({ ...INITIAL_QUIZ, status: "quiz" }));
  };

  const cliqueCurso = (slug: string, position: number) => {
    trackVocationalEvent("vocational_course_clicked", { recommended_course_slug: slug, position });
  };

  const pergunta = QUESTIONS[Math.min(currentQuestion, QUESTIONS.length - 1)];

  return (
    <div ref={rootRef} className="bg-navy-950">
      <div ref={screenRef}>
        {quizState === "quiz" && (
          <QuizQuestion
            question={pergunta}
            index={currentQuestion}
            total={QUESTIONS.length}
            selectedAnswerId={answers[pergunta.id]}
            onSelect={responder}
            onBack={voltar}
            contentRef={questionRef}
          />
        )}

        {quizState === "processing" && <QuizProcessing />}

        {quizState === "result" && (
          <QuizResult
            results={results}
            userProfile={userProfile}
            onRestart={refazer}
            onCourseClick={cliqueCurso}
          />
        )}
      </div>
    </div>
  );
}
