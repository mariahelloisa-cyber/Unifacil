"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackVocationalEvent } from "@/lib/vocational-quiz/analytics";
import { QUESTIONS } from "@/lib/vocational-quiz/questions";
import { useCardStack } from "./useCardStack";
import "./quiz-stack.css";
import "./vocational-cards.css";

/* Assets oficiais da marca (public/images). */
const LOGO_HORIZONTAL = { src: "/images/logo-horizontal.png", width: 1200, height: 416 };
const LOGO_MARK = { src: "/images/logo-mark.png", width: 512, height: 468 };

/** Símbolo oficial enorme ao fundo. */
function Watermark() {
  return (
    <span className="vq-card__watermark" aria-hidden="true">
      <Image
        src={LOGO_MARK.src}
        alt=""
        width={LOGO_MARK.width}
        height={LOGO_MARK.height}
        sizes="(min-width: 1024px) 640px, 110vw"
        draggable={false}
      />
    </span>
  );
}

/** Teste vocacional na página inicial: foto dos alunos pinada e dois cards
 *  que se empilham com GSAP + ScrollTrigger. O botão do 2º card leva direto
 *  à primeira pergunta em /teste-vocacional. */
export default function QuizIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  useCardStack(sectionRef, { center: true });

  return (
    <section
      ref={sectionRef}
      id="teste-vocacional"
      aria-label="Teste vocacional"
      className="quiz-stack-section vq-home"
    >
      {/* Fundo branco da seção — sem foto. A div continua aqui (vazia) porque
          o useCardStack usa ela como âncora do pin de fundo. */}
      <div className="quiz-stack-bg" aria-hidden="true" />

      <div className="quiz-stack-list">
        {/* CARD 01 — apresenta o teste (sem botão) */}
        <div className="quiz-stack-card" style={{ zIndex: 1 }}>
          <article className="quiz-stack-card__inner vq-card vq-card--intro" aria-labelledby="vq-card-intro-titulo">
            <Watermark />

            <div className="vq-card__body">
              <p className="vq-card__eyebrow">Teste vocacional</p>
              <h2 id="vq-card-intro-titulo" className="vq-card__title">
                <span className="block">Qual curso</span> <span className="block">combina com você?</span>
              </h2>
              <p className="vq-card__text">
                Descubra os cursos do programa que mais combinam com seus interesses, habilidades e jeito de pensar.
              </p>
              <p className="vq-card__meta">Leva cerca de 2 minutos.</p>
            </div>

            <Image
              className="vq-card__logo"
              src={LOGO_HORIZONTAL.src}
              alt="Universidade Fácil"
              width={LOGO_HORIZONTAL.width}
              height={LOGO_HORIZONTAL.height}
              sizes="290px"
            />
          </article>
        </div>

        <div className="quiz-stack-gap" aria-hidden="true" />

        {/* CARD 02 — CTA */}
        <div className="quiz-stack-card" style={{ zIndex: 2 }}>
          <article className="quiz-stack-card__inner vq-card vq-card--cta" aria-labelledby="vq-card-cta-titulo">
            <Watermark />

            <div className="vq-card__body">
              <p className="vq-card__eyebrow">Seu próximo passo</p>
              {/* Desktop/tablet: canto superior direito. Mobile: pequeno, entre label e título. */}
              <Image
                className="vq-card__logo vq-card__logo--top"
                src={LOGO_HORIZONTAL.src}
                alt="Universidade Fácil"
                width={LOGO_HORIZONTAL.width}
                height={LOGO_HORIZONTAL.height}
                sizes="230px"
              />
              <h2 id="vq-card-cta-titulo" className="vq-card__title">
                <span className="block">Pronto para</span> <span className="block">descobrir o curso</span>{" "}
                <span className="block">que tem a sua cara?</span>
              </h2>
              <p className="vq-card__text">
                Responda algumas perguntas rápidas e veja quais cursos têm mais afinidade com o seu perfil.
              </p>
              <Link
                href="/teste-vocacional"
                className="vq-card__button"
                onClick={() =>
                  trackVocationalEvent("vocational_quiz_started", {
                    question_count: QUESTIONS.length,
                    source: "home",
                  })
                }
              >
                Iniciar quiz
                <svg className="vq-card__arrow" width="30" height="20" viewBox="0 0 22 16" fill="none" aria-hidden="true">
                  <path d="M1 8h19M14 1.5 20.5 8 14 14.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
