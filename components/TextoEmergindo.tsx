"use client";

import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Mesmo motivo do AnimatedText: o gsap.from() só esconde as palavras quando
   roda, e no useLayoutEffect isso acontece antes da pintura, sem piscar. No
   SSR o React avisa sobre useLayoutEffect, daí a troca por useEffect. */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* De onde o stagger parte: "center" espalha do meio para as pontas, que é o
   efeito de tinta se abrindo no papel. */
type Origem = "start" | "center" | "end" | "random";

/** Texto que emerge palavra a palavra — cada uma cresce do zero e sai do
 *  desfoque, espalhando a partir do centro da frase.
 *
 *  Diferente do modelo original, a animação não dispara na montagem: numa
 *  seção no meio da página ela já teria acabado quando o visitante chegasse
 *  ali. O ScrollTrigger segura até a frase entrar na tela. */
export default function TextoEmergindo({
  texto,
  as = "p",
  className,
  style,
  destaque,
  origem = "center",
  duracao = 0.5,
  delay = 0,
  stagger = 0.03,
}: {
  texto: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  style?: CSSProperties;
  /** Pinta um trecho da frase sem quebrar a divisão por palavras. */
  destaque?: { texto: string; className: string };
  origem?: Origem;
  duracao?: number;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  /* O separador fica no array (split com grupo), então os espaços e as
     quebras continuam exatamente como estavam no texto original. */
  const partes = texto.split(/(\s+)/);

  /* Onde cada pedaço começa no texto original: é assim que as palavras dentro
     do trecho destacado recebem a cor, sem precisar repeti-lo. */
  const pedacos = partes.map((parte, i) => ({
    parte,
    inicio: partes.slice(0, i).reduce((total, anterior) => total + anterior.length, 0),
  }));

  const inicioDestaque = destaque ? texto.indexOf(destaque.texto) : -1;
  const fimDestaque = inicioDestaque >= 0 ? inicioDestaque + destaque!.texto.length : -1;

  useEfeitoAntesDaPintura(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        normal: "(prefers-reduced-motion: no-preference)",
        reduzido: "(prefers-reduced-motion: reduce)",
      },
      (contexto) => {
        const { reduzido } = contexto.conditions as { reduzido: boolean };
        /* Movimento reduzido: nada é escondido nem animado — a frase já nasce
           no lugar, que é o mesmo estado final da animação. */
        if (reduzido) return;

        const palavras = elemento.querySelectorAll("[data-palavra]");

        gsap.from(palavras, {
          opacity: 0,
          scale: 0,
          filter: "blur(4px)",
          duration: duracao,
          delay,
          stagger: { each: stagger, from: origem },
          ease: "power2.out",
          scrollTrigger: {
            trigger: elemento,
            start: "top 85%",
            once: true,
          },
        });
      }
    );

    /* Mata tweens e ScrollTriggers e devolve os estilos inline. */
    return () => {
      mm.revert();
    };
  }, [origem, duracao, delay, stagger]);

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      /* As palavras viram caixas inline-block, que alguns leitores de tela
         soletram picado — o nome acessível vem da frase inteira. */
      aria-label={texto}
    >
      <span aria-hidden="true">
        {pedacos.map(({ parte, inicio }, i) =>
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
    </Tag>
  );
}
