"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackVocationalEvent } from "@/lib/vocational-quiz/analytics";
import { QUESTIONS } from "@/lib/vocational-quiz/questions";

/* Fica fechada até o fim da sessão do navegador: quem dispensou a faixa não a
   vê de novo a cada página. */
const CHAVE_FECHADA = "uf-quiz-bar-fechada";

/** Faixa fixa no rodapé chamando para o teste vocacional. Ela mora logo abaixo
 *  da seção "Educação acessível para todos" e sobe sozinha quando o fim dessa
 *  seção chega à janela — o <div> sentinela marca esse ponto no fluxo. */
export default function QuizBottomBar() {
  const sentinelaRef = useRef<HTMLDivElement>(null);
  const faixaRef = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  /* Em ref, não em estado: quem já dispensou a faixa não precisa de um render
     extra na entrada — o observer abaixo simplesmente nunca a abre. */
  const fechadaRef = useRef(false);

  useEffect(() => {
    const el = sentinelaRef.current;
    if (!el) return;
    try {
      fechadaRef.current = sessionStorage.getItem(CHAVE_FECHADA) === "1";
    } catch {
      /* navegação privada: trata como nunca dispensada */
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        /* Aparece assim que a sentinela entra pela base da janela e continua
           no ar depois que ela sobe para fora (top negativo). */
        const chegou = entry.isIntersecting || entry.boundingClientRect.top < 0;
        setVisivel(chegou && !fechadaRef.current);
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* A altura real da faixa vira variável global: o botão do WhatsApp sobe e o
     rodapé ganha folga sem ninguém chutar um valor fixo (globals.css). */
  useEffect(() => {
    const el = faixaRef.current;
    if (!el) return;
    const medir = () =>
      document.documentElement.style.setProperty("--quiz-bar-h", `${el.offsetHeight}px`);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    document.body.dataset.quizBar = visivel ? "on" : "off";
    return () => {
      delete document.body.dataset.quizBar;
    };
  }, [visivel]);

  function fechar() {
    fechadaRef.current = true;
    setVisivel(false);
    try {
      sessionStorage.setItem(CHAVE_FECHADA, "1");
    } catch {
      /* navegação privada: fecha só nesta página */
    }
  }

  return (
    <>
      <div ref={sentinelaRef} aria-hidden className="h-px w-full" />

      {/* inert (e não aria-hidden): tira o link e o botão do foco enquanto a
          faixa está escondida, sem deixar foco preso fora da tela. */}
      <div
        ref={faixaRef}
        role="region"
        aria-label="Teste vocacional"
        inert={!visivel}
        className={`quiz-bar fixed inset-x-0 bottom-0 z-40 bg-navy-950 shadow-[0_-12px_40px_rgba(31,15,43,0.35)] ${
          visivel ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      >
        <div className="container-x flex min-h-[58px] items-center gap-3 sm:gap-5 lg:min-h-[74px] lg:gap-6">
          {/* Foto com o canto superior direito cortado na diagonal. */}
          <div
            className="relative hidden h-[74px] w-[268px] shrink-0 lg:block"
            style={{ clipPath: "polygon(0 0, calc(100% - 42px) 0, 100% 100%, 0 100%)" }}
          >
            <Image
              src="/images/estudantes.webp"
              alt=""
              fill
              sizes="268px"
              className="object-cover object-[center_32%]"
            />
          </div>

          {/* No celular a frase curta evita uma faixa de quatro linhas; da
              largura de tablet para cima entra a frase inteira. */}
          <p className="max-w-[24ch] text-[13px] font-extrabold leading-[1.18] text-white sm:text-[14px] lg:max-w-[22ch] lg:text-[16px]">
            <span className="sm:hidden">Qual curso é ideal para você?</span>
            <span className="hidden sm:inline">
              Está com dúvida sobre qual é o curso ideal para você?
            </span>
          </p>

          <svg
            className="hidden shrink-0 text-gold lg:block"
            width="48"
            height="22"
            viewBox="0 0 48 22"
            fill="currentColor"
            aria-hidden
          >
            <path d="M0 0 21 11 0 22z" />
            <path d="M26 0 47 11 26 22z" />
          </svg>

          <p className="hidden max-w-[36ch] text-[12.5px] font-semibold leading-[1.3] text-sky-200 xl:block">
            Faça o <strong className="font-bold text-white">teste vocacional</strong> gratuito e
            maximize suas chances de sucesso.
          </p>

          <Link
            href="/teste-vocacional"
            onClick={() =>
              trackVocationalEvent("vocational_quiz_started", {
                question_count: QUESTIONS.length,
                source: "home_bar",
              })
            }
            className="ml-auto shrink-0 rounded-full bg-gold px-4 py-2 text-[12.5px] font-bold text-navy-950 transition-colors hover:bg-gold-hover lg:px-7 lg:py-2.5 lg:text-[13.5px]"
          >
            Fazer o teste
          </Link>

          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar aviso do teste vocacional"
            className="-mr-1 shrink-0 p-1 text-white/60 transition-colors hover:text-white lg:ml-2"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
