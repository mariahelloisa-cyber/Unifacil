"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* Fotos usadas enquanto o item não tem foto própria no admin — entram em
   sequência, na ordem dos cards. */
const FOTOS_PADRAO = [
  "/images/sobre1.jpg",
  "/images/matricula-hero.jpg",
  "/images/alunos.jpg",
  "/images/estudantes.jpg",
];

export type PhotoRailItem = {
  key: string;
  href: string;
  nome: string;
  imagemUrl: string;
  /* Linha pequena acima do nome (ex.: a categoria do curso). */
  rotulo?: string;
};

/* Trilho de cards quadrados com foto e nome no rodapé — usado em "Escolha por
   categoria" e "Cursos mais procurados". Usa o .rail do globals.css — 4 por
   vez no desktop, com espiada no mobile.

   No toque o navegador já desliza (com o snap do .rail). No mouse dá para
   clicar e arrastar: ao soltar, o trilho segue com a velocidade do gesto e
   assenta no card mais próximo. As setas usam a mesma animação. */
export default function PhotoRail({
  titulo,
  destaque,
  subtitulo,
  verTodos,
  itens,
  compacto = false,
}: {
  titulo: string;
  /* Trecho do título pintado de amarelo; com ele, o resto do título fica roxo. */
  destaque?: string;
  subtitulo: string;
  /* Link "Ver todos" acima dos cards, à direita — opcional. */
  verTodos?: { href: string; label: string };
  itens: PhotoRailItem[];
  /* Menos espaço entre o subtítulo e os cards. */
  compacto?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const atualizar = () => {
      setPodeVoltar(rail.scrollLeft > 4);
      setPodeAvancar(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
    };
    atualizar();
    rail.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      rail.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, [itens.length]);

  const animacao = useRef<number | null>(null);
  const arraste = useRef<{
    x: number;
    scroll: number;
    moveu: boolean;
    amostras: { x: number; t: number }[];
  } | null>(null);
  const bloquearClique = useRef(false);

  const pararAnimacao = () => {
    if (animacao.current !== null) cancelAnimationFrame(animacao.current);
    animacao.current = null;
  };

  /* Início de cada card, dentro do limite de rolagem. */
  const pontosDeParada = (rail: HTMLDivElement) => {
    const max = rail.scrollWidth - rail.clientWidth;
    const pontos = Array.from(rail.children, (el) =>
      Math.min(max, (el as HTMLElement).offsetLeft - rail.offsetLeft),
    );
    return [...new Set([0, ...pontos, max])].sort((a, b) => a - b);
  };

  const maisProximo = (rail: HTMLDivElement, alvo: number) =>
    pontosDeParada(rail).reduce((melhor, p) =>
      Math.abs(p - alvo) < Math.abs(melhor - alvo) ? p : melhor,
    );

  /* Desliza até `destino` com ease-out. O snap do CSS fica desligado durante a
     animação, senão ele puxa o trilho a cada quadro. */
  const deslizarPara = (destino: number) => {
    const rail = railRef.current;
    if (!rail) return;
    pararAnimacao();
    const inicio = rail.scrollLeft;
    const distancia = destino - inicio;
    const reduzir = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (Math.abs(distancia) < 1 || reduzir) {
      rail.scrollLeft = destino;
      rail.style.scrollSnapType = "";
      return;
    }
    const duracao = Math.min(750, 320 + Math.abs(distancia) * 0.35);
    const t0 = performance.now();
    rail.style.scrollSnapType = "none";
    const passo = (agora: number) => {
      const p = Math.min(1, (agora - t0) / duracao);
      const ease = 1 - Math.pow(1 - p, 4);
      rail.scrollLeft = inicio + distancia * ease;
      if (p < 1) {
        animacao.current = requestAnimationFrame(passo);
      } else {
        animacao.current = null;
        rail.style.scrollSnapType = "";
      }
    };
    animacao.current = requestAnimationFrame(passo);
  };

  const rolar = (direcao: 1 | -1) => {
    const rail = railRef.current;
    if (rail)
      deslizarPara(
        maisProximo(rail, rail.scrollLeft + direcao * rail.clientWidth),
      );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    pararAnimacao();
    arraste.current = {
      x: e.clientX,
      scroll: rail.scrollLeft,
      moveu: false,
      amostras: [{ x: e.clientX, t: performance.now() }],
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arraste.current;
    const rail = railRef.current;
    if (!a || !rail) return;
    const dx = e.clientX - a.x;
    if (!a.moveu) {
      if (Math.abs(dx) < 6) return; /* abaixo disso ainda é um clique */
      a.moveu = true;
      rail.setPointerCapture(e.pointerId);
      rail.style.scrollSnapType = "none";
      rail.classList.add("is-dragging");
    }
    rail.scrollLeft = a.scroll - dx;
    const agora = performance.now();
    a.amostras.push({ x: e.clientX, t: agora });
    while (a.amostras.length > 2 && agora - a.amostras[0].t > 100)
      a.amostras.shift();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const a = arraste.current;
    const rail = railRef.current;
    arraste.current = null;
    if (!a?.moveu || !rail) return;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(e.pointerId))
      rail.releasePointerCapture(e.pointerId);
    bloquearClique.current = true;

    /* Velocidade dos últimos ~100ms (px/ms) projeta até onde o gesto levaria. */
    const primeira = a.amostras[0];
    const ultima = a.amostras[a.amostras.length - 1];
    const tempo = Math.max(1, ultima.t - primeira.t);
    const velocidade =
      performance.now() - ultima.t > 80 ? 0 : (ultima.x - primeira.x) / tempo;
    deslizarPara(maisProximo(rail, rail.scrollLeft - velocidade * 280));
  };

  /* Soltar depois de arrastar não pode abrir o card que estava sob o mouse. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (!bloquearClique.current) return;
    bloquearClique.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => pararAnimacao, []);

  if (itens.length === 0) return null;

  return (
    <div className="mx-auto max-w-[1280px]">
      <h2 className={`text-center font-display text-[2.25rem] font-extrabold leading-[1.02] tracking-tight lg:text-[52px] ${destaque ? "text-navy-800" : "text-black"}`}>
        {destaque && titulo.includes(destaque) ? (
          <>
            {titulo.slice(0, titulo.indexOf(destaque))}
            <span className="text-gold">{destaque}</span>
            {titulo.slice(titulo.indexOf(destaque) + destaque.length)}
          </>
        ) : (
          titulo
        )}
      </h2>
      <p className="mt-4 text-center text-[17px] font-light leading-relaxed text-black/70 lg:whitespace-nowrap lg:text-[19px]">
        {subtitulo}
      </p>

      {verTodos && (
        <div
          className={`flex justify-end ${compacto ? "mt-4 lg:mt-5" : "mt-10 lg:mt-12"}`}
        >
          <Link
            href={verTodos.href}
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold transition-colors hover:text-gold-hover"
          >
            {verTodos.label}
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M1.5 1.5 6 6l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}

      <div
        className={`relative ${verTodos ? "mt-4" : compacto ? "mt-8 lg:mt-9" : "mt-10 lg:mt-12"}`}
      >
        <div
          ref={railRef}
          className="rail rail-drag"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          onWheel={pararAnimacao}
          onTouchStart={pararAnimacao}
        >
          {itens.map((item, i) => (
            <Link
              key={item.key}
              href={item.href}
              className="group relative block aspect-square overflow-hidden bg-navy-850"
            >
              <Image
                src={item.imagemUrl || FOTOS_PADRAO[i % FOTOS_PADRAO.length]}
                alt=""
                fill
                /* O card é quadrado e as fotos costumam ser horizontais: o
                   object-cover corta as laterais, então a imagem precisa ser
                   ~2x mais larga que o card para não ser ampliada (e borrar). */
                sizes="(min-width: 1024px) 640px, (min-width: 640px) 92vw, 156vw"
                quality={95}
                draggable={false}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/80 to-transparent"
              />
              <span className="absolute bottom-4 left-4 right-4 text-white">
                {item.rotulo && (
                  <span className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-white/75">
                    {item.rotulo}
                  </span>
                )}
                <span className="block text-[15px] font-extrabold uppercase leading-tight tracking-wide sm:text-base">
                  {item.nome}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <SetaRail direcao={-1} visivel={podeVoltar} onClick={() => rolar(-1)} />
        <SetaRail direcao={1} visivel={podeAvancar} onClick={() => rolar(1)} />
      </div>
    </div>
  );
}

function SetaRail({
  direcao,
  visivel,
  onClick,
}: {
  direcao: 1 | -1;
  visivel: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direcao === 1 ? "Próximos" : "Anteriores"}
      tabIndex={visivel ? 0 : -1}
      className={`absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-950 shadow-[0_4px_14px_rgba(31,15,43,0.14)] backdrop-blur-sm transition-[opacity,background-color] duration-300 hover:bg-gold sm:flex ${
        direcao === 1 ? "-right-4" : "-left-4"
      } ${visivel ? "opacity-70 hover:opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <svg
        width="13"
        height="10"
        viewBox="0 0 20 14"
        fill="none"
        aria-hidden
        className={direcao === -1 ? "rotate-180" : ""}
      >
        <path
          d="M1 7h17M12.5 1 18.5 7l-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
