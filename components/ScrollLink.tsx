"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Âncora que rola suavemente até um elemento da própria página, descontando a
 * altura do header sticky — mesmo cálculo do VocationalQuiz.
 *
 * Continua sendo um <a href="#id"> de verdade: sem JS, ou antes da
 * hidratação, o clique ainda leva ao destino (só que de um salto).
 *
 * O scrollTo com behavior explícito é necessário porque o EditorialScroll
 * desliga o `scroll-behavior: smooth` do <html> enquanto está montado.
 */
export default function ScrollLink({
  alvo,
  className = "",
  children,
}: {
  /** id do elemento de destino, sem o "#". */
  alvo: string;
  className?: string;
  children: ReactNode;
}) {
  const rolar = (e: MouseEvent<HTMLAnchorElement>) => {
    const destino = document.getElementById(alvo);
    if (!destino) return; // sem o alvo, o href resolve sozinho
    e.preventDefault();

    const chrome = document.querySelector<HTMLElement>("[data-site-chrome]")?.offsetHeight ?? 0;
    const topo = destino.getBoundingClientRect().top;
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: window.scrollY + topo - chrome,
      behavior: suave ? "smooth" : "instant",
    });
  };

  return (
    <a href={`#${alvo}`} onClick={rolar} className={className}>
      {children}
    </a>
  );
}
