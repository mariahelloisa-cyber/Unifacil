"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* O gsap.from() só esconde o texto quando roda; antes da pintura, no
   useLayoutEffect, isso acontece sem piscar. No SSR o React avisa sobre
   useLayoutEffect, daí a troca por useEffect (onde ele nunca executa). */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Variante = "titulo" | "texto";

/* Títulos entram mais longe e mais devagar; textos de apoio, de leve. No
   mobile a distância e o stagger encolhem para a entrada não parecer lenta. */
const AJUSTES: Record<Variante, Record<"desktop" | "mobile", { y: number; duracao: number; stagger: number }>> = {
  titulo: {
    desktop: { y: 34, duracao: 0.9, stagger: 0.055 },
    mobile: { y: 20, duracao: 0.75, stagger: 0.035 },
  },
  texto: {
    desktop: { y: 22, duracao: 0.75, stagger: 0 },
    mobile: { y: 14, duracao: 0.6, stagger: 0 },
  },
};

export default function AnimatedText({
  children,
  as = "p",
  variant = "texto",
  className,
  id,
  delay = 0,
  destaque,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  variant?: Variante;
  className?: string;
  id?: string;
  /** Segundos de espera — usado para o texto entrar logo depois do título. */
  delay?: number;
  /** Pinta um trecho do título sem quebrar a divisão por palavras. */
  destaque?: { texto: string; className: string };
}) {
  const ref = useRef<HTMLElement>(null);

  /* Só títulos entram palavra a palavra: dividir um <p> exigiria aria-label,
     que a role "paragraph" não expõe — o texto ficaria sem nome acessível. */
  const porPalavra = variant === "titulo" && typeof children === "string";
  /* O separador fica no array (split com grupo), então espaços e quebras
     continuam exatamente como estavam no texto original. */
  const partes = porPalavra ? (children as string).split(/(\s+)/) : null;

  /* Guarda onde cada pedaço começa no texto original: é assim que as palavras
     dentro do trecho destacado recebem a cor, sem precisar repeti-lo. */
  let cursor = 0;
  const pedacos = partes?.map((parte) => {
    const inicio = cursor;
    cursor += parte.length;
    return { parte, inicio };
  });

  const inicioDestaque = destaque ? (children as string).indexOf(destaque.texto) : -1;
  const fimDestaque = inicioDestaque >= 0 ? inicioDestaque + destaque!.texto.length : -1;

  useEfeitoAntesDaPintura(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const mm = gsap.matchMedia();

    /* As faixas precisam cobrir todas as larguras: o gsap só chama o callback
       quando ao menos uma condição casa (MatchMedia.add → `active && func`). */
    mm.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reduzido: "(prefers-reduced-motion: reduce)",
      },
      (contexto) => {
        const { reduzido, mobile } = contexto.conditions as { reduzido: boolean; mobile: boolean };
        /* Movimento reduzido: nada é escondido nem animado — o texto já nasce
           no lugar, que é o mesmo estado final da animação. */
        if (reduzido) return;

        const ajuste = AJUSTES[variant][mobile ? "mobile" : "desktop"];
        const palavras = elemento.querySelectorAll("[data-palavra]");

        gsap.from(palavras.length > 0 ? palavras : elemento, {
          y: ajuste.y,
          opacity: 0,
          duration: ajuste.duracao,
          stagger: ajuste.stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elemento,
            start: "top 85%",
            once: true,
          },
        });
      }
    );

    /* Mata tweens e ScrollTriggers e devolve os estilos inline: ao trocar de
       curso nada sobrevive da página anterior. */
    return () => {
      mm.revert();
    };
  }, [variant, delay]);

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      /* As palavras viram caixas inline-block, que alguns leitores de tela
         soletram picado — o nome acessível vem do texto inteiro. */
      aria-label={porPalavra ? (children as string) : undefined}
    >
      {porPalavra ? (
        <span aria-hidden="true">
          {pedacos!.map(({ parte, inicio }, i) =>
            parte.trim() === "" ? (
              <Fragment key={i}>{parte}</Fragment>
            ) : (
              <span
                key={i}
                data-palavra
                className={
                  inicio >= inicioDestaque && inicio < fimDestaque
                    ? `inline-block ${destaque!.className}`
                    : "inline-block"
                }
              >
                {parte}
              </span>
            )
          )}
        </span>
      ) : (
        children
      )}
    </Tag>
  );
}
