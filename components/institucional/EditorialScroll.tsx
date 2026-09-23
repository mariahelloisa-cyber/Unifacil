"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import "./editorial.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Mesmo padrão do AnimatedText: estados iniciais aplicados antes da pintura,
   sem o aviso de useLayoutEffect no SSR. */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Raio final do vídeo da seção 04, em px de tela — o mesmo rounded-[28px]
 *  do bloco "Vamos conversar?". */
const RAIO_FILM = 28;

export default function EditorialScroll() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEfeitoAntesDaPintura(() => {
    const root = rootRef.current;
    if (!root) return;

    /* O header é sticky: os pins começam logo abaixo dele, e as seções
       pinadas usam a altura útil (100svh − header) via --chrome-h. */
    const chrome = document.querySelector<HTMLElement>("[data-site-chrome]");
    const alturaChrome = () => chrome?.offsetHeight ?? 0;
    let chromeMedido = -1;
    const sincronizarChrome = () => {
      const h = alturaChrome();
      if (h === chromeMedido) return false;
      chromeMedido = h;
      root.style.setProperty("--chrome-h", `${h}px`);
      return true;
    };
    sincronizarChrome();

    /* scroll-behavior: smooth do <html> atrapalha o ScrollTrigger ao restaurar
       a posição no refresh — desligado só enquanto a página está montada. */
    const html = document.documentElement;
    const scrollBehaviorAnterior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const q = gsap.utils.selector(root);
    const um = <T extends HTMLElement = HTMLElement>(sel: string) => q(sel)[0] as T;
    const inicioPin = () => `top ${alturaChrome()}px`;

    /** Parallax interno leve (yPercent −5 → 5) do miolo de uma .ed-fig. */
    const parallax = (fig: Element) => {
      const miolo = fig.querySelector(".ed-fig__inner");
      if (!miolo) return;
      gsap.fromTo(
        miolo,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)",
          reduzido: "(prefers-reduced-motion: reduce)",
        },
        (contexto) => {
          const { desktop, mobile, reduzido } = contexto.conditions as Record<string, boolean>;
          const video = um<HTMLVideoElement>(".ed-film video");

          /* Movimento reduzido: o CSS já monta a composição final. Nada de
             pin, scrub ou autoplay — o vídeo ganha controles. */
          if (reduzido) {
            video.controls = true;
            return () => {
              video.controls = false;
            };
          }

          const largo = !mobile;

          /* ---------------- 01 · Intro ----------------
             Mídia enorme → retângulo de .ed-intro__end (canto inferior
             direito). Só transform (x/y/scale, origem no topo-esquerdo); os
             offsets não sofrem com o transform, então o destino é sempre
             medido do layout real, inclusive depois de resize. */
          const intro = um(".ed-intro");
          const introMedia = um(".ed-intro__media");
          const introFim = um(".ed-intro__end");
          const introTextos = q(".ed-intro__foot > *");

          if (largo) {
            const alvo = () => ({
              s: introFim.offsetWidth / introMedia.offsetWidth,
              x: introFim.offsetLeft - introMedia.offsetLeft,
              y: introFim.offsetTop - introMedia.offsetTop,
            });

            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: intro,
                  start: inicioPin,
                  end: () => `+=${window.innerHeight * (desktop ? 1.9 : 1.4)}`,
                  scrub: 1,
                  pin: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              })
              // 0–20%: respiro com a mídia grande
              .to(
                introMedia,
                {
                  x: () => alvo().x,
                  y: () => alvo().y,
                  scale: () => alvo().s,
                  ease: "power2.inOut",
                  duration: 0.55,
                },
                0.2
              )
              // ~56–88%: label e parágrafo entram enquanto a mídia assenta
              .fromTo(
                introTextos,
                { autoAlpha: 0, y: 32 },
                { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.08, ease: "power2.out" },
                0.56
              )
              // até 100%: composição final estável antes de soltar o pin
              .to({}, { duration: 0.12 }, 0.88);
          } else {
            gsap.fromTo(
              introTextos,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: um(".ed-intro__foot"), start: "top 92%", end: "top 62%", scrub: 1 },
              }
            );
            gsap.fromTo(
              introMedia,
              { clipPath: "inset(18% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: { trigger: introMedia, start: "top 95%", end: "top 50%", scrub: 1 },
              }
            );
          }

          /* ---------------- 02 · Destaques ---------------- */
          const titulo = um(".ed-works__title");
          gsap.fromTo(
            titulo.querySelectorAll(".ed-line"),
            { yPercent: 40, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              stagger: 0.2,
              ease: "none",
              scrollTrigger: { trigger: titulo, start: "top 88%", end: "top 48%", scrub: 1 },
            }
          );

          q(".ed-block").forEach((bloco) => {
            const fig = bloco.querySelector(".ed-fig")!;
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: bloco, start: "top 90%", end: "top 35%", scrub: 1 },
              })
              .fromTo(
                bloco.querySelectorAll(".ed-block__meta > *"),
                { y: 36, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.5 },
                0
              )
              .fromTo(fig, { clipPath: "inset(22% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0);
            parallax(fig);

            // Texto extra abaixo da imagem (só no bloco 01).
            const extra = bloco.querySelector(".ed-block__extra");
            if (extra) {
              gsap.fromTo(
                extra.children,
                { y: 32, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.15,
                  ease: "none",
                  scrollTrigger: { trigger: extra, start: "top 92%", end: "top 60%", scrub: 1 },
                }
              );
            }
          });

          /* ---------------- 03 · Feature ---------------- */
          const feature = um(".ed-feature__media");
          gsap.fromTo(
            feature,
            { scale: 0.94, opacity: 0.6 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: feature, start: "top 95%", end: largo ? "top 20%" : "top 45%", scrub: 1 },
            }
          );
          gsap.fromTo(
            q(".ed-feature__head > *"),
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.15,
              ease: "none",
              scrollTrigger: { trigger: um(".ed-feature__head"), start: "top 90%", end: "top 55%", scrub: 1 },
            }
          );

          /* ---------------- 04 · Film ----------------
             O vídeo ocupa a seção inteira e encolhe pelo centro até o card
             de .ed-film__end — o mesmo formato do bloco "Vamos conversar?".
             Escala uniforme (transform) até cobrir o destino + clip-path para
             acertar a proporção, sem animar width/height. O clip é aplicado
             antes do transform, por isso insets e raio estão em px "não
             escalados". */
          const film = um(".ed-film");
          const filmMedia = um(".ed-film__media");
          const filmFim = um(".ed-film__end");
          const filmItens = q(".ed-film [data-ed-item]");

          if (largo) {
            const geo = () => {
              const w0 = film.clientWidth;
              const h0 = film.clientHeight;
              const s = Math.max(filmFim.offsetWidth / w0, filmFim.offsetHeight / h0);
              const cl = (w0 - filmFim.offsetWidth / s) / 2;
              const ct = (h0 - filmFim.offsetHeight / s) / 2;
              return {
                s,
                x: filmFim.offsetLeft - s * cl,
                y: filmFim.offsetTop - s * ct,
                clip: `inset(${ct}px ${cl}px ${ct}px ${cl}px round ${RAIO_FILM / s}px)`,
              };
            };

            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: film,
                  start: inicioPin,
                  end: () => `+=${window.innerHeight * (desktop ? 2 : 1.5)}`,
                  scrub: 1,
                  pin: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              })
              // 0–10%: fullscreen parado
              .fromTo(
                filmMedia,
                { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px round 0px)" },
                {
                  x: () => geo().x,
                  y: () => geo().y,
                  scale: () => geo().s,
                  clipPath: () => geo().clip,
                  ease: "power2.inOut",
                  duration: 0.6,
                },
                0.1
              )
              // escurece até o tom do card do CTA, para o texto ficar legível
              .fromTo(um(".ed-film__shade"), { opacity: 0.25 }, { opacity: 1, duration: 0.5 }, 0.1)
              // ~56–94%: "Vamos conversar?", título e botão surgem no card
              .fromTo(
                filmItens,
                { autoAlpha: 0, y: 36 },
                { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.08, ease: "power2.out" },
                0.56
              )
              .to({}, { duration: 0.02 }, 0.98);
          } else {
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: film, start: "top 80%", end: "top 15%", scrub: 1 },
              })
              .fromTo(
                filmMedia,
                { clipPath: "inset(0% 0% 0% 0% round 0px)" },
                { clipPath: "inset(4% 4% 4% 4% round 20px)", duration: 1 },
                0
              )
              .fromTo(filmItens, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5 }, 0.4);
          }

          /* O vídeo só toca enquanto a seção está na tela. Com pin, o gatilho
             é o pin-spacer — ele é quem tem a altura que inclui a duração do
             pin; o próprio <section> faria o vídeo pausar no meio. */
          const spacer = film.parentElement?.classList.contains("pin-spacer") ? film.parentElement : film;
          ScrollTrigger.create({
            trigger: spacer,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (self.isActive) {
                video.muted = true;
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            },
          });
        }
      );
    }, root);

    /* Fontes e imagens mudam medidas: recalcula depois que chegam. O header
       muda de altura quando o aviso do topo é fechado. */
    let vivo = true;
    const refrescar = () => {
      if (vivo) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refrescar);
    if (document.readyState !== "complete") window.addEventListener("load", refrescar, { once: true });

    const ro = new ResizeObserver(() => {
      if (sincronizarChrome()) ScrollTrigger.refresh();
    });
    if (chrome) ro.observe(chrome);

    return () => {
      vivo = false;
      ro.disconnect();
      window.removeEventListener("load", refrescar);
      ctx.revert();
      html.style.scrollBehavior = scrollBehaviorAnterior;
    };
  }, []);

  return (
    <div ref={rootRef} className="ed">
      {/* 01 · Intro */}
      <section className="ed-intro" aria-labelledby="ed-intro-titulo">
        <h2 id="ed-intro-titulo" className="ed-display ed-intro__head">
          <span className="ed-line">Estudar ficou</span>
          <span className="ed-line">mais fácil.</span>
        </h2>

        <div className="ed-intro__media">
          <Image
            src="/images/alunos.jpg"
            alt="Grupo de alunos sorrindo em uma selfie"
            fill
            sizes="(min-width: 768px) 96vw, 92vw"
            className="object-cover object-[center_45%]"
          />
        </div>

        <div className="ed-intro__foot">
          <p className="ed-label ed-intro__label"> Sobre o programa </p>
          <p className="ed-intro__text">
            A Universidade Fácil é um programa social de bolsas de estudo: firmamos parcerias com
            universidades e escolas técnicas para levar educação de qualidade a quem mais precisa.
          </p>
        </div>

        <div className="ed-intro__end" aria-hidden />
      </section>

      {/* 02 · Destaques */}
      <section className="ed-works" aria-labelledby="ed-works-titulo">
        <div className="ed-grid">
          <h2 id="ed-works-titulo" className="ed-display ed-works__title">
            <span className="ed-line">Conhecimento que</span>
            <span className="ed-line">transforma vidas.</span>
          </h2>

          <article className="ed-block ed-block--a">
            <div className="ed-block__meta">
              <p className="ed-label ed-block__tag">
                <span>Do EJA à pós-graduação</span>

              </p>
              <h3 className="ed-block__title">Centenas de cursos para todos os perfis</h3>
              <p className="ed-block__text">
                Cursos profissionalizantes, EJA, técnicos, graduações e pós-graduações em
                instituições parceiras de todo o Brasil.
              </p>
            </div>
            <div className="ed-fig">
              <div className="ed-fig__inner">
                <Image
                  src="/images/matricula-hero.jpg"
                  alt="Grupo de estudantes estudando juntos em uma mesa"
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mesmo texto e estilo do bloco "Aqui você aprende de verdade",
                em branco por causa do fundo escuro. */}
            {/* Deslocado para a direita no tablet/desktop (quanto maior, mais à direita). */}
            <div className="ed-block__extra md:ml-[20%] md:mt-12 lg:ml-[60%] lg:-mr-[28%] lg:mt-20">
              <p className="mt-10 max-w-[46ch] text-[16px] font-semibold leading-relaxed text-white">
                Adquirimos vagas antecipadamente, em grande quantidade, nas instituições parceiras.
                Com isso, o programa recebe uma porcentagem de vagas totalmente gratuitas — as bolsas
                de 100%, destinadas a alunos de baixa renda — e repassa as demais com descontos de
                até 80% do valor tradicional. São os menores custos do Brasil, ou até mesmo nenhum
                custo.
              </p>
              <p className="mt-6 border-l-4 border-accent pl-6 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-[1.15] text-white">
                Educação de qualidade<br></br> ao alcance de todos
              </p>
            </div>
          </article>

          <article className="ed-block ed-block--b">
            <div className="ed-block__meta">
              <p className="ed-label ed-block__tag">
                <span></span>
                <span>Impacto social</span>
              </p>
              <h3 className="ed-block__title">Educação que muda histórias.</h3>
              <p className="ed-block__text">
               
              </p>
            </div>
            <div className="ed-fig">
              <div className="ed-fig__inner">
                <Image
                  src="/images/historia.jpg"
                  alt="Alunos sorrindo juntos"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 40vw, 75vw"
                  className="object-cover object-[center_30%]"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 03 · Feature */}
      <section className="ed-feature" aria-labelledby="ed-feature-titulo">
        <div className="ed-feature__inner">
          <div className="ed-feature__head">
            <p className="ed-label ed-feature__label">Nossa missão</p>
            <h2 id="ed-feature-titulo" className="ed-display ed-feature__title">
              Um milhão de brasileiros formados.
            </h2>
          </div>
          <div className="ed-feature__media">
            <Image
              src="/images/imagem3.jpg"
              alt="Estudante sorrindo enquanto usa o celular na rua"
              fill
              sizes="(min-width: 1024px) 67vw, (min-width: 768px) 84vw, 100vw"
              className="object-cover object-[45%_30%]"
            />
          </div>
          <p className="ed-feature__caption">
            {/* Missão, do briefing da Universidade Fácil. */}
            Formar mais de um milhão de brasileiros em cursos de ensino médio, técnico e superior,
            sendo referência nacional para jovens de baixa renda que têm o desejo e a determinação
            de estudar e transformar suas vidas através da educação.
          </p>
        </div>
      </section>

      {/* 04 · Film */}
      <section className="ed-film" aria-labelledby="ed-film-titulo">
        <div className="ed-film__media">
          <video
            src="/images/videos/institucional.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Vídeo institucional da Universidade Fácil"
          />
          <div className="ed-film__shade" />
        </div>

        {/* Mesmo conteúdo e visual do bloco "Vamos conversar?". */}
        <div className="ed-film__content">
          <p className="text-[15px] font-semibold text-sky-200" data-ed-item>
            Vamos conversar?
          </p>
          <h2 id="ed-film-titulo" className="t-h2 mx-auto mt-5 max-w-4xl text-white" data-ed-item>
            Uma conversa pode mudar o rumo da sua vida.
          </h2>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-navy-950 transition-colors hover:bg-sky-100"
            data-ed-item
          >
            Falar com um consultor
          </a>
        </div>

        <div className="ed-film__end" aria-hidden />
      </section>

    </div>
  );
}
