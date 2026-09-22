import type { RefObject } from "react";
import Link from "next/link";
import type { QuizQuestion as QuizQuestionData } from "@/lib/vocational-quiz/types";
import QuizProgress from "./QuizProgress";

const LETRAS = ["A", "B", "C", "D", "E", "F"];

const CLASSE_VOLTAR =
  "-ml-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] font-bold text-sky-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const setaVoltar = (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
    <path d="M19 7H2M7.5 1 1.5 7l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function QuizQuestion({
  question,
  index,
  total,
  selectedAnswerId,
  onSelect,
  onBack,
  contentRef,
}: {
  question: QuizQuestionData;
  index: number;
  total: number;
  selectedAnswerId?: string;
  onSelect: (questionId: string, answerId: string) => void;
  onBack: () => void;
  /** Bloco que anima na troca de pergunta (a barra de progresso fica parada). */
  contentRef: RefObject<HTMLDivElement | null>;
}) {
  const tituloId = `vq-${question.id}-titulo`;

  return (
    <section aria-label="Teste vocacional" className="flex min-h-[calc(100svh-96px)] flex-col text-white">
      <div className="container-x pt-6 lg:pt-10">
        <QuizProgress current={index + 1} total={total} answered={index + (selectedAnswerId ? 1 : 0)} />
      </div>

      <div className="container-x flex flex-1 flex-col justify-center py-10 lg:py-14">
        <div ref={contentRef} className="mx-auto w-full max-w-[1080px]">
          <h1
            id={tituloId}
            data-autofocus
            tabIndex={-1}
            className="max-w-[22ch] text-balance font-display text-[clamp(2rem,4.4vw,3.9rem)] font-extrabold leading-[1.04] tracking-[-0.035em] outline-none"
          >
            {question.question}
          </h1>
          {index === 0 && (
            <p className="mt-4 text-[15px] font-semibold text-sky-300">Não existe resposta certa ou errada.</p>
          )}

          <div role="group" aria-labelledby={tituloId} className="mt-8 grid gap-3 sm:gap-4 md:mt-12 md:grid-cols-2">
            {question.answers.map((answer, i) => {
              const selecionada = answer.id === selectedAnswerId;
              return (
                <button
                  key={answer.id}
                  type="button"
                  aria-pressed={selecionada}
                  onClick={() => onSelect(question.id, answer.id)}
                  className={`group flex min-h-[72px] w-full items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 motion-safe:active:scale-[0.99] md:min-h-[128px] md:px-7 md:py-6 ${
                    selecionada
                      ? "border-accent bg-accent text-navy-950"
                      : "border-white/15 bg-white/[0.04] text-white hover:border-white/40 hover:bg-white/[0.08]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-[14px] font-extrabold transition-colors ${
                      selecionada ? "border-navy-950 bg-navy-950 text-white" : "border-white/25 text-sky-200 group-hover:border-white/50"
                    }`}
                  >
                    {selecionada ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      LETRAS[i]
                    )}
                  </span>
                  <span className="text-[17px] font-semibold leading-snug md:text-[19px]">{answer.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-x pb-8 lg:pb-10">
        {/* Na 1ª pergunta volta para a chamada do teste na página inicial. */}
        {index === 0 ? (
          <Link href="/#teste-vocacional" className={CLASSE_VOLTAR}>
            {setaVoltar}
            Voltar
          </Link>
        ) : (
          <button type="button" onClick={onBack} className={CLASSE_VOLTAR}>
            {setaVoltar}
            Voltar
          </button>
        )}
      </div>
    </section>
  );
}
