"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";

const RAIO = 34;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export default function QuizProcessing() {
  const [encontrou, setEncontrou] = useState(false);
  const arcoRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setEncontrou(true), 950);
    const arco = arcoRef.current;
    const tween =
      arco && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? gsap.fromTo(
            arco,
            { strokeDashoffset: CIRCUNFERENCIA },
            { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }
          )
        : null;
    return () => {
      window.clearTimeout(id);
      tween?.kill();
    };
  }, []);

  return (
    <section className="container-x flex min-h-[calc(100svh-96px)] flex-col items-center justify-center py-16 text-center text-white">
      <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden>
        <circle cx="44" cy="44" r={RAIO} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
        <circle
          ref={arcoRef}
          cx="44"
          cy="44"
          r={RAIO}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={CIRCUNFERENCIA}
          transform="rotate(-90 44 44)"
        />
      </svg>

      <h1
        data-autofocus
        tabIndex={-1}
        aria-live="polite"
        className="mt-10 max-w-[20ch] text-balance font-display text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] outline-none"
      >
        <span
          key={encontrou ? "encontrou" : "analisando"}
          className="block motion-safe:animate-[rise-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ "--rise": "12px" } as CSSProperties}
        >
          {encontrou ? "Encontramos cursos que combinam com o seu perfil." : "Analisando suas respostas…"}
        </span>
      </h1>
    </section>
  );
}
