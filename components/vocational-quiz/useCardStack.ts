"use client";

import { useEffect, useLayoutEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Estado final do card que vai para trás quando o próximo sobe. */
export const CARD_ANTERIOR = { scale: 0.82, rotateX: 28, rotateZ: 3, y: -30 };
/** Distância mínima entre o header e o topo do card pinado. */
const PIN_GAP = 24;

/**
 * Pilha de cards com GSAP + ScrollTrigger (usada na home e no resultado).
 *
 * Estrutura esperada dentro de `sectionRef`:
 *   .quiz-stack-bg               → fundo pinado durante toda a sequência
 *   .quiz-stack-card             → wrapper pinado (pinSpacing: false), com perspective
 *     .quiz-stack-card__inner    → peça inteira que recebe scale/rotateX/rotateZ/y
 *
 * `center`: pina cada card centralizado na altura útil (abaixo do header) em
 * vez de colado no topo.
 */
export function useCardStack(
  sectionRef: RefObject<HTMLElement | null>,
  { center = false, key }: { center?: boolean; key?: unknown } = {}
) {
  useEfeitoAntesDaPintura(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Header sticky: pins começam logo abaixo dele (mesmo padrão do
       EditorialScroll da página institucional). */
    const chrome = document.querySelector<HTMLElement>("[data-site-chrome]");
    const alturaChrome = () => chrome?.offsetHeight ?? 0;
    const topoCard = (card: HTMLElement) => {
      if (!center) return alturaChrome() + PIN_GAP;
      const livre = window.innerHeight - alturaChrome() - card.offsetHeight;
      return Math.round(alturaChrome() + Math.max(PIN_GAP, livre / 2));
    };

    let chromeMedido = -1;
    const sincronizarChrome = () => {
      const h = alturaChrome();
      if (h === chromeMedido) return false;
      chromeMedido = h;
      section.style.setProperty("--chrome-h", `${h}px`);
      return true;
    };
    sincronizarChrome();

    // scroll-behavior: smooth atrapalha o ScrollTrigger ao restaurar posição.
    const html = document.documentElement;
    const scrollBehaviorAnterior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Movimento reduzido ou tela baixa demais: nada é criado e o CSS mostra
         uma lista comum. */
      mm.add("(prefers-reduced-motion: no-preference) and (min-height: 520px)", () => {
        const bg = section.querySelector<HTMLElement>(".quiz-stack-bg");
        const cards = gsap.utils.toArray<HTMLElement>(".quiz-stack-card", section);

        /* Card mais alto que a área útil nunca seria visto inteiro pinado:
           nesse caso a seção vira lista estática. */
        const util = window.innerHeight - alturaChrome();
        if (cards.some((c) => c.offsetHeight > util)) {
          section.classList.add("quiz-stack--static");
          return () => section.classList.remove("quiz-stack--static");
        }

        // 1. Fundo pinado durante toda a sequência.
        if (bg) {
          ScrollTrigger.create({
            trigger: bg,
            start: () => `top ${alturaChrome()}px`,
            endTrigger: section,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        }

        cards.forEach((card, index) => {
          // 2–4. Cada card sobe com o scroll e fica pinado, sem pin-spacing,
          // para o próximo passar por cima dele.
          ScrollTrigger.create({
            trigger: card,
            start: () => `top ${topoCard(card)}px`,
            endTrigger: section,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });

          // 5. O card que chega controla a transformação do anterior. Scrub
          // puro: rolar para cima devolve exatamente o estado anterior.
          if (index > 0) {
            const anterior = cards[index - 1].querySelector(".quiz-stack-card__inner");
            if (!anterior) return;
            gsap.fromTo(
              anterior,
              { scale: 1, rotateX: 0, rotateZ: 0, y: 0 },
              {
                ...CARD_ANTERIOR,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: () => `top ${topoCard(card)}px`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        });
      });
    }, section);

    /* Fontes, imagens (logos, foto) e a entrada da tela mudam medidas:
       recalcula quando tudo assenta. */
    let vivo = true;
    const refrescar = () => {
      if (vivo) ScrollTrigger.refresh();
    };
    const timer = window.setTimeout(refrescar, 450);
    document.fonts?.ready.then(refrescar);
    if (document.readyState !== "complete") window.addEventListener("load", refrescar, { once: true });

    const pendentes = Array.from(section.querySelectorAll("img")).filter((img) => !img.complete);
    pendentes.forEach((img) => img.addEventListener("load", refrescar, { once: true }));

    const ro = new ResizeObserver(() => {
      if (sincronizarChrome()) ScrollTrigger.refresh();
    });
    if (chrome) ro.observe(chrome);

    return () => {
      vivo = false;
      window.clearTimeout(timer);
      window.removeEventListener("load", refrescar);
      pendentes.forEach((img) => img.removeEventListener("load", refrescar));
      ro.disconnect();
      // Desfaz pins (pin-spacers) e transforms antes de o React remover o DOM.
      ctx.revert();
      html.style.scrollBehavior = scrollBehaviorAnterior;
    };
  }, [sectionRef, center, key]);
}
