"use client";

import { useEffect, useRef } from "react";

/* A linha entra pela borda esquerda, faz um laço duplo (um em cima do outro,
   cruzando no meio), segue numa onda suave para a direita, faz um laço menor e
   termina descendo num arco até sair pela borda de baixo. */
const PATH =
  "M 0 230 C 25 218, 55 216, 75 222 C 105 232, 133 255, 130 280 C 127 305, 95 312, 70 300 C 50 288, 48 255, 62 235 C 72 220, 88 210, 103 202 C 125 188, 135 150, 122 125 C 110 102, 75 98, 60 118 C 45 140, 62 185, 103 202 C 125 210, 150 210, 175 210 C 210 208, 230 195, 255 198 C 280 202, 297 225, 297 250 C 297 280, 275 297, 258 295 C 238 292, 238 262, 255 245 C 272 228, 305 228, 330 230 C 380 238, 405 290, 405 335";

const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

/* Linha decorativa que se desenha uma única vez quando a seção entra na tela.
   Fica presa ao canto inferior esquerdo do elemento pai, atrás do conteúdo: o
   pai precisa ser `relative` e `overflow-hidden`, e o conteúdo, `relative` com
   z-index maior. A largura vem por `className`; a altura sai do aspect-ratio. */
export default function ScrollDrawPath({
  color = "#744A90",
  strokeWidth = 16,
  duration = 3000,
  delay = 150,
  threshold = 0.3,
  className = "",
}: {
  color?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    // Medição: o comprimento real do traço vira o tamanho do "tracejado". Com
    // dasharray = dashoffset = comprimento, o único traço fica todo deslocado
    // para fora e a linha começa invisível.
    const length = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = `${length}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      path.style.visibility = "visible";
      return;
    }

    path.style.strokeDashoffset = `${length}`;
    path.style.visibility = "visible";

    // Disparo: observa a seção (o pai do SVG). Quando a fração pedida dela
    // aparece, anima uma vez só e desliga o observer — voltar a rolar não
    // repete nem apaga a linha.
    const target = svg.parentElement ?? svg;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        // Transição: força um reflow para o navegador registrar o offset
        // inicial antes de trocar para 0 — sem isso ele pula direto ao fim.
        path.getBoundingClientRect();
        path.style.transition = `stroke-dashoffset ${duration}ms ${EASING} ${delay}ms`;
        path.style.strokeDashoffset = "0";
      },
      { threshold }
    );
    io.observe(target);

    return () => io.disconnect();
  }, [duration, delay, threshold]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 427 338"
      preserveAspectRatio="xMinYMax meet"
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 left-0 z-0 aspect-[427/338] ${className}`}
    >
      {/* Começa oculto no HTML do servidor: só aparece depois de medido, para
          não piscar desenhado inteiro antes da animação. */}
      <path
        ref={pathRef}
        d={PATH}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ visibility: "hidden" }}
      />
    </svg>
  );
}
