"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./intro.css";

/* ==========================================================================
   Intro / preloader editorial

   Camada fullscreen que troca frames em corte seco (sem crossfade), com duas
   frases grandes — uma no topo e outra na base — e etiquetas pequenas no
   meio. No fim o painel inteiro sobe com translateY(-100%), revelando a
   página, que já está renderizada atrás desde o primeiro paint.

   >>> É SÓ AQUI QUE SE MEXE: a SEQUENCIA abaixo e as constantes de tempo.

   As imagens ficam em /public/frames/ (frame-01.jpg … frame-08.jpg). Para
   trocar, basta sobrescrever os arquivos com o mesmo nome — ou editar os
   caminhos aqui. Recomendado: JPG de ~1600px de largura e 120–250 KB cada,
   já que todas são baixadas antes da sequência começar.
   ========================================================================== */

type Frame = {
  /** Caminho a partir de /public. */
  image: string;
  /** Frase grande do topo. "\n" quebra a linha — o desenho é feito para
   *  2 linhas; com 3 o texto pode não caber na tela. */
  topo: string;
  /** Frase grande da base. Mesma regra do topo. */
  base: string;
  /** Tempo do frame em ms. Entre 60 e 90 é a faixa que dá a sensação de
   *  stop-motion; o último costuma segurar mais. */
  duration: number;
};

const SEQUENCIA: Frame[] = [
  { image: "/frames/frame-01.jpg", topo: "PROGRAMA DE\nBOLSAS©2026", base: "TRANSFORMANDO\nVIDAS.", duration: 90 },
  { image: "/frames/frame-02.jpg", topo: "PROGRAMA DE\nBOLSAS©2026", base: "TRANSFORMANDO\nVIDAS.", duration: 70 },
  { image: "/frames/frame-03.jpg", topo: "PROGRAMA DE\nBOLSAS©2026", base: "TRANSFORMANDO\nVIDAS.", duration: 70 },
  { image: "/frames/frame-02.jpg", topo: "PROGRAMA DE\nBOLSAS©2026", base: "TRANSFORMANDO\nVIDAS.", duration: 60 },

  { image: "/frames/frame-04.jpg", topo: "BOLSAS DE\nATÉ 100%", base: "EDUCAÇÃO\nPARA TODOS.", duration: 80 },
  { image: "/frames/frame-05.jpg", topo: "BOLSAS DE\nATÉ 100%", base: "EDUCAÇÃO\nPARA TODOS.", duration: 70 },
  { image: "/frames/frame-06.jpg", topo: "BOLSAS DE\nATÉ 100%", base: "EDUCAÇÃO\nPARA TODOS.", duration: 70 },
  { image: "/frames/frame-05.jpg", topo: "BOLSAS DE\nATÉ 100%", base: "EDUCAÇÃO\nPARA TODOS.", duration: 60 },

  { image: "/frames/frame-07.jpg", topo: "UNIVERSIDADE\nFÁCIL©2026", base: "ESTUDAR FICOU\nMAIS FÁCIL.", duration: 80 },
  { image: "/frames/frame-08.jpg", topo: "UNIVERSIDADE\nFÁCIL©2026", base: "ESTUDAR FICOU\nMAIS FÁCIL.", duration: 70 },
  { image: "/frames/frame-07.jpg", topo: "UNIVERSIDADE\nFÁCIL©2026", base: "ESTUDAR FICOU\nMAIS FÁCIL.", duration: 70 },
  { image: "/frames/frame-08.jpg", topo: "UNIVERSIDADE\nFÁCIL©2026", base: "ESTUDAR FICOU\nMAIS FÁCIL.", duration: 260 },
];

/** Etiquetas pequenas do meio da tela. String vazia esconde a etiqueta. */
const ETIQUETA_ESQ = "UNIVERSIDADE\nFÁCIL";
const ETIQUETA_DIR = "RECONHECIDO\nPELO MEC";

/** Pausa depois do último frame, antes do painel subir (ms). */
const PAUSA_FINAL = 220;
/** Duração da saída (ms). Precisa bater com --intro-saida no intro.css. */
const SAIDA = 900;
/** Entrada das frases (ms) — máscara + deslize curto. */
const ENTRADA_FRASE = 140;
/** Teto do preload: se as imagens demorarem mais que isso, a sequência começa
 *  assim mesmo em vez de prender o usuário numa tela parada. */
const LIMITE_PRELOAD = 2500;
/** true = a intro aparece só na primeira visita da aba (sessionStorage);
 *  false = toda vez que a página monta. */
const UMA_VEZ_POR_SESSAO = false;

const CHAVE_SESSAO = "uf:intro-vista";

/* Cada imagem e cada frase viram UM nó no DOM, reaproveitado pelos frames que
   as repetem: a troca é só ligar/desligar uma classe, sem re-render do React
   e sem nenhuma imagem sendo baixada no meio da sequência. Topo e base são
   deduplicados separadamente, então cada um só reanima quando ele muda. */
const IMAGENS = Array.from(new Set(SEQUENCIA.map((f) => f.image)));
const TOPOS = Array.from(new Set(SEQUENCIA.map((f) => f.topo)));
const BASES = Array.from(new Set(SEQUENCIA.map((f) => f.base)));
const TRILHA = SEQUENCIA.map((f) => ({
  img: IMAGENS.indexOf(f.image),
  topo: TOPOS.indexOf(f.topo),
  base: BASES.indexOf(f.base),
  dur: f.duration,
}));

/* Mesmo padrão do EditorialScroll: efeito antes da pintura no cliente, sem o
   aviso de useLayoutEffect no SSR. */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function IntroAnimation() {
  const [montado, setMontado] = useState(true);
  const raizRef = useRef<HTMLDivElement>(null);

  useEfeitoAntesDaPintura(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let jaViu = false;
    try {
      jaViu = UMA_VEZ_POR_SESSAO && sessionStorage.getItem(CHAVE_SESSAO) === "1";
    } catch {
      /* modo privado pode bloquear o storage — segue mostrando a intro. */
    }

    /* Movimento reduzido: nada de sequência nem de trava de scroll. O site
       aparece direto. */
    if (reduzido || jaViu) {
      setMontado(false);
      return;
    }

    try {
      if (UMA_VEZ_POR_SESSAO) sessionStorage.setItem(CHAVE_SESSAO, "1");
    } catch {
      /* idem */
    }

    /* ---- trava de scroll ----
       html e body juntos: o elemento que rola varia entre navegadores e o
       resto do site já usa os dois padrões (Header e MatriculaButton).
       A largura da barra de rolagem vira padding no body: sem isso a página
       alargaria ~15px ao travar e os pins do EditorialScroll (medidos ainda
       durante a intro) ficariam calculados na largura errada. */
    const html = document.documentElement;
    const body = document.body;
    const overflowHtml = html.style.overflow;
    const overflowBody = body.style.overflow;
    const paddingBody = body.style.paddingRight;
    const barra = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (barra > 0) body.style.paddingRight = `${barra}px`;
    window.scrollTo(0, 0);

    let vivo = true;
    let raf = 0;
    const timers: number[] = [];

    const destravar = () => {
      html.style.overflow = overflowHtml;
      body.style.overflow = overflowBody;
      body.style.paddingRight = paddingBody;
    };

    const encerrar = () => {
      if (!vivo) return;
      vivo = false;
      destravar();
      setMontado(false);
    };

    const imgs = Array.from(raiz.querySelectorAll<HTMLImageElement>("[data-frame]"));
    const topos = Array.from(raiz.querySelectorAll<HTMLElement>("[data-topo]"));
    const bases = Array.from(raiz.querySelectorAll<HTMLElement>("[data-base]"));

    const entrar = (el: HTMLElement) => {
      el.animate(
        [{ transform: "translate3d(0, 108%, 0)" }, { transform: "translate3d(0, 0, 0)" }],
        { duration: ENTRADA_FRASE, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    };

    /* O frame 0 já nasce ativo no JSX — daí imgAtual começar em 0 (nada a
       fazer). As frases começam em -1 porque a primeira ainda precisa animar
       a entrada. */
    let imgAtual = 0;
    let topoAtual = -1;
    let baseAtual = -1;

    const trocarFrase = (
      nos: HTMLElement[],
      anterior: number,
      proximo: number
    ) => {
      if (proximo === anterior) return anterior;
      nos[anterior]?.classList.remove("is-ativa");
      const el = nos[proximo];
      if (el) {
        el.classList.add("is-ativa");
        entrar(el);
      }
      return proximo;
    };

    const mostrar = (i: number) => {
      const passo = TRILHA[i];

      if (passo.img !== imgAtual) {
        imgs[imgAtual]?.classList.remove("is-ativa");
        imgs[passo.img]?.classList.add("is-ativa");
        imgAtual = passo.img;
      }

      topoAtual = trocarFrase(topos, topoAtual, passo.topo);
      baseAtual = trocarFrase(bases, baseAtual, passo.base);
    };

    const sair = () => {
      timers.push(
        window.setTimeout(() => {
          if (!vivo) return;
          raiz.classList.add("is-saindo");
          /* A remoção do DOM espera a transição acabar (+ folga), para o
             painel não sumir no meio do movimento. */
          timers.push(window.setTimeout(encerrar, SAIDA + 80));
        }, PAUSA_FINAL)
      );
    };

    /* ---- sequência ----
       rAF com relógio próprio: o instante de troca é acumulado a partir das
       durações, então um frame perdido não desalinha o resto (e uma aba em
       segundo plano volta já no ponto certo em vez de arrastar a intro). */
    const iniciar = () => {
      if (!vivo) return;
      let i = 0;
      let inicioFrame = performance.now();
      mostrar(0);

      const passo = (agora: number) => {
        if (!vivo) return;
        let trocou = false;
        while (agora - inicioFrame >= TRILHA[i].dur) {
          inicioFrame += TRILHA[i].dur;
          i += 1;
          trocou = true;
          if (i >= TRILHA.length) {
            sair();
            return;
          }
        }
        if (trocou) mostrar(i);
        raf = requestAnimationFrame(passo);
      };

      raf = requestAnimationFrame(passo);
    };

    /* ---- preload ----
       decode() resolve só quando a imagem está pronta para pintar, então a
       sequência nunca esbarra num frame vazio. Erro numa imagem não trava
       nada, e o LIMITE_PRELOAD garante que a intro sempre sai. */
    const decodificadas = Promise.all(imgs.map((img) => img.decode().catch(() => undefined)));
    const comTeto = Promise.race([
      decodificadas,
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, LIMITE_PRELOAD))),
    ]);
    comTeto.then(iniciar);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      timers.forEach((t) => clearTimeout(t));
      destravar();
    };
  }, []);

  if (!montado) return null;

  return (
    <div ref={raizRef} className="intro" role="presentation" aria-hidden>
      <div className="intro__frames">
        {IMAGENS.map((src, i) => (
          // next/image não serve aqui: são frames trocados em ms, todos
          // pré-carregados de uma vez e sempre em cover na viewport inteira.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden
            draggable={false}
            decoding="async"
            /* A sequência só começa quando TODAS decodificam, então todas são
               prioridade alta — senão perdem a banda para o preload do hero
               (fachada.png) que está renderizado aqui atrás. */
            fetchPriority="high"
            className={`intro__frame${i === 0 ? " is-ativa" : ""}`}
            data-frame={i}
          />
        ))}
      </div>

      <div className="intro__shade" />

      <div className="intro__texto">
        <span className="intro__mask">
          {TOPOS.map((t, i) => (
            <span key={i} className={`intro__frase${i === 0 ? " is-ativa" : ""}`} data-topo={i}>
              {t}
            </span>
          ))}
        </span>

        <div className="intro__etiquetas">
          <span className="intro__etiqueta">{ETIQUETA_ESQ}</span>
          <span className="intro__etiqueta intro__etiqueta--dir">{ETIQUETA_DIR}</span>
        </div>

        <span className="intro__mask">
          {BASES.map((t, i) => (
            <span key={i} className={`intro__frase${i === 0 ? " is-ativa" : ""}`} data-base={i}>
              {t}
            </span>
          ))}
        </span>
      </div>

      {/* Sem JS o painel ficaria parado na frente do site para sempre. */}
      <noscript dangerouslySetInnerHTML={{ __html: "<style>.intro{display:none !important}</style>" }} />
    </div>
  );
}
