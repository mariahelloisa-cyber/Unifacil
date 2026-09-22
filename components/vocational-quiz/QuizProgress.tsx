"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export default function QuizProgress({
  current,
  total,
  answered,
}: {
  /** Pergunta exibida, começando em 1. */
  current: number;
  total: number;
  /** Quantas perguntas já têm resposta — é o que a barra mostra. */
  answered: number;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const primeiraRef = useRef(true);
  const valor = total > 0 ? Math.min(answered / total, 1) : 0;

  useEfeitoAntesDaPintura(() => {
    const fill = fillRef.current;
    if (!fill) return;
    if (primeiraRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      primeiraRef.current = false;
      gsap.set(fill, { scaleX: valor });
      return;
    }
    gsap.to(fill, { scaleX: valor, duration: 0.45, ease: "power2.out", overwrite: true });
  }, [valor]);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-[15px] font-extrabold tracking-tight text-white">
          <span aria-hidden>
            {doisDigitos(current)} <span className="text-sky-300/70">/ {doisDigitos(total)}</span>
          </span>
          <span className="sr-only">
            Pergunta {current} de {total}
          </span>
        </p>
        <p className="t-label uppercase text-sky-300">Teste vocacional</p>
      </div>
      <div
        role="progressbar"
        aria-label="Progresso do teste"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        className="mt-3 h-1 overflow-hidden rounded-full bg-white/12"
      >
        <span ref={fillRef} className="block h-full origin-left scale-x-0 rounded-full bg-accent" />
      </div>
    </div>
  );
}
