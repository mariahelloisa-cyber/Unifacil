"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Mesmo motivo do TextoEmergindo: zerar os números antes da pintura evita que
   o valor final pisque antes da contagem. No SSR, useEffect (nunca executa). */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type NumeroPrograma = {
  valor: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
};

const formatar = (n: number) => Math.round(n).toLocaleString("pt-BR");

/** Grade de números do programa que contam do zero até o valor quando entram
 *  na tela, uma vez só. O HTML do servidor já traz o valor final — é o que
 *  aparece sem JavaScript e com movimento reduzido. */
export default function NumerosPrograma({ itens }: { itens: NumeroPrograma[] }) {
  const ref = useRef<HTMLDListElement>(null);

  useEfeitoAntesDaPintura(() => {
    const lista = ref.current;
    if (!lista) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const alvos = Array.from(lista.querySelectorAll<HTMLElement>("[data-valor]"));

      alvos.forEach((alvo, i) => {
        const final = Number(alvo.dataset.valor);
        const contador = { v: 0 };
        alvo.textContent = formatar(0);

        gsap.to(contador, {
          v: final,
          duration: 1.6,
          delay: i * 0.12,
          ease: "power2.out",
          onUpdate: () => {
            alvo.textContent = formatar(contador.v);
          },
          scrollTrigger: { trigger: lista, start: "top 85%", once: true },
        });
      });

      /* Ao desmontar no meio da contagem, devolve o valor certo. */
      return () => {
        alvos.forEach((alvo) => {
          alvo.textContent = formatar(Number(alvo.dataset.valor));
        });
      };
    });

    return () => mm.revert();
  }, [itens]);

  return (
    <dl ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* O div do Reveal é o agrupador de cada par dt/dd — o único nível de
          div que o <dl> aceita —, então o card é ele mesmo. */}
      {itens.map((item, i) => (
        <Reveal
          key={item.rotulo}
          delay={i * 80}
          className="flex h-full flex-col rounded-[18px] bg-tint px-5 py-6 sm:px-7 sm:py-8"
        >
          {/* dt vem depois no visual, mas antes no DOM, como pede o <dl>. */}
          <dt className="order-2 mt-2 text-[14px] font-semibold leading-snug text-navy-900 sm:text-[15px]">
            {item.rotulo}
          </dt>
          <dd
            className="order-1 font-display font-extrabold leading-none tracking-[-0.04em] text-accent"
            style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
          >
            {item.prefixo && (
              <span className="mr-1 align-top text-[0.4em] font-bold tracking-normal">{item.prefixo}</span>
            )}
            <span data-valor={item.valor}>{formatar(item.valor)}</span>
            {item.sufixo}
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
