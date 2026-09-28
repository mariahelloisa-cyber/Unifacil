"use client";

import { useEffect, useRef, useState } from "react";

/* Prolonga, para dentro da seção de cima, a forma lilás (BlobDepoimentos) que
   a seção de baixo corta na borda de cima. Fica atrás do conteúdo da seção em
   que é colocado — o pai precisa ser `relative`, `isolate` e `overflow-hidden`.

   O ponto delicado é a emenda: onde o blob encosta na borda depende da largura
   da tela e da altura da outra seção. Por isso ela é medida no navegador —
   varre a linha logo abaixo da borda e pergunta ao próprio <path> do blob
   (isPointInFill) onde ele começa e termina — e a base desta forma nasce
   exatamente nesses dois pontos. */

/* Rota das bordas, em frações da largura (x) e da altura (y) da seção: a
   esquerda sobe na diagonal até ~11% no topo; a direita é uma curva só, que
   sai do topo em ~84% (atrás da coluna de cards da direita) e desce suave até
   a borda direita do blob embaixo — sem reentrâncias no meio, que apareciam
   recortadas pelos vãos entre os cards.
   `inclinacao` é quanto a borda do blob anda em x por pixel subindo, logo
   abaixo da emenda: o último controle fica sobre essa mesma reta, então a
   curva chega na emenda na direção em que o blob continua — sem quebra. */
function montarCaminho(W: number, H: number, xEsq: number, xDir: number, inclinacao: number) {
  const n = (v: number) => v.toFixed(1);
  const x = (fracao: number) => n(fracao * W);
  const y = (fracao: number) => n(fracao * H);
  const alcance = 0.3 * H;
  return [
    `M ${n(xEsq)} ${n(H + 1)}`,
    `C ${x(0.02)} ${y(0.7)}, ${x(0.05)} ${y(0.25)}, ${x(0.114)} -1`,
    `L ${x(0.84)} -1`,
    `C ${x(0.86)} ${y(0.4)}, ${n(xDir + inclinacao * alcance)} ${n(H - alcance)}, ${n(xDir)} ${n(H + 1)}`,
    "Z",
  ].join(" ");
}

/* Onde a emenda corta o blob perto da parte arredondada dele, a borda fica
   quase deitada e a inclinação explode — o controle iria longe e a curva
   faria uma barriga. Acima disso, a curva só não segue o blob à risca. */
const INCLINACAO_MAX = 0.6;

export default function ContinuacaoBlob({
  blobPathId,
  fill,
  className = "",
}: {
  /** id do <path> do BlobDepoimentos da seção logo abaixo. */
  blobPathId: string;
  /** Mesma cor do blob, para a emenda não aparecer. */
  fill: string;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [forma, setForma] = useState<{ W: number; H: number; d: string } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const secao = svg?.parentElement;
    const blob = document.getElementById(blobPathId) as SVGPathElement | null;
    if (!svg || !secao || !blob) return;

    const medir = () => {
      const caixa = secao.getBoundingClientRect();
      const W = caixa.width;
      const H = caixa.height;
      const ctm = blob.getScreenCTM();
      if (!W || !H || !ctm) return;

      const inversa = ctm.inverse();
      const preenchido = (xTela: number, yTela: number) =>
        blob.isPointInFill(new DOMPoint(xTela, yTela).matrixTransform(inversa));

      /* Varredura grossa (4px) e depois busca binária até meio pixel, para a
         emenda não mostrar degrau. */
      const refinar = (fora: number, dentro: number, yTela: number) => {
        while (Math.abs(dentro - fora) > 0.5) {
          const meio = (fora + dentro) / 2;
          if (preenchido(meio, yTela)) dentro = meio;
          else fora = meio;
        }
        return dentro;
      };

      const bordaDireita = (yTela: number) => {
        for (let xt = caixa.right; xt >= caixa.left; xt -= 4) {
          if (preenchido(xt, yTela)) return xt + 4 <= caixa.right ? refinar(xt + 4, xt, yTela) : xt;
        }
        return null;
      };
      const bordaEsquerda = (yTela: number) => {
        for (let xt = caixa.left; xt <= caixa.right; xt += 4) {
          if (preenchido(xt, yTela)) return xt - 4 >= caixa.left ? refinar(xt - 4, xt, yTela) : xt;
        }
        return null;
      };

      // Linha de varredura: 2px abaixo da borda, já dentro da seção do blob.
      const yEmenda = caixa.bottom + 2;
      const xDir = bordaDireita(yEmenda);
      const xEsq = bordaEsquerda(yEmenda);

      /* Direção da borda direita do blob logo abaixo da emenda: compara com
         outra varredura 40px mais funda. É quanto x muda por pixel subindo. */
      const PROFUNDIDADE = 40;
      const xDirFundo = bordaDireita(yEmenda + PROFUNDIDADE);
      const inclinacaoMedida = xDir !== null && xDirFundo !== null ? (xDir - xDirFundo) / PROFUNDIDADE : 0;
      const inclinacao = Math.max(-INCLINACAO_MAX, Math.min(INCLINACAO_MAX, inclinacaoMedida));

      // O blob não chega na borda nesta largura de tela: não há o que prolongar.
      if (xDir === null || xEsq === null) {
        setForma(null);
        return;
      }

      /* Blob colado na borda esquerda da tela: a forma começa fora dela, para
         a curva da esquerda não aparecer cortada. */
      const esq = xEsq - caixa.left <= 1 ? -40 : xEsq - caixa.left;
      setForma({ W, H, d: montarCaminho(W, H, esq, xDir - caixa.left, inclinacao) });
    };

    medir();

    // Mede de novo quando qualquer uma das duas seções muda de tamanho
    // (resize, fontes carregando, imagens das redes entrando)...
    const observador = new ResizeObserver(medir);
    observador.observe(secao);
    const secaoBlob = blob.closest("section");
    if (secaoBlob) observador.observe(secaoBlob);

    // ...e nos marcos em que o layout pode ter mudado sem mudar o tamanho
    // das duas: fontes prontas, página carregada, janela redimensionada.
    let ativo = true;
    document.fonts?.ready.then(() => {
      if (ativo) medir();
    });
    window.addEventListener("load", medir);
    window.addEventListener("resize", medir);

    return () => {
      ativo = false;
      observador.disconnect();
      window.removeEventListener("load", medir);
      window.removeEventListener("resize", medir);
    };
  }, [blobPathId]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      viewBox={forma ? `0 0 ${forma.W} ${forma.H}` : undefined}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible ${className}`}
    >
      {forma && <path d={forma.d} fill={fill} />}
    </svg>
  );
}
