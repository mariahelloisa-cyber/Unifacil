"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./oportunidades.css";
import diferenciais from "@/app/assets/diferenciais.webp";

/* >>> Textos da seção — é só trocar por aqui. Os cards são os diferenciais do
   briefing (os dois PDFs), cada um apontando para a página que continua o
   assunto. A quantidade de cards é livre: os controles e os pontinhos se
   ajustam. */

const CABECALHO = {
  titulo: "Nossos diferenciais",
  subtitulo: "O que faz da Universidade Fácil um dos caminhos mais acessíveis para estudar",
};

const BANNER = {
  imagem: diferenciais,
  linhaFina: "Universidade Fácil",
  chamada: "Educação\nacessível",
};

const CARDS: { titulo: string; texto: string; cta: string; href: string }[] = [
  {
    titulo: "Acessibilidade financeira",
    texto: "Uma das opções educacionais mais acessíveis do país, com bolsas gratuitas e descontos de até 80%.",
    cta: "Conheça as bolsas",
    href: "/bolsas",
  },
  {
    titulo: "Vagas gratuitas",
    texto: "Parte das vagas é destinada gratuitamente a alunos de baixa renda, que estudam sem pagar mensalidade.",
    cta: "Simular minha bolsa",
    href: "/bolsas",
  },
  {
    titulo: "Diversidade de cursos",
    texto: "Centenas de opções — profissionalizantes, técnicos, EJA, graduações e pós — para todos os perfis.",
    cta: "Escolher meu curso",
    href: "/inscricao",
  },
  {
    titulo: "Parcerias com instituições",
    texto: "Acordos com universidades e escolas técnicas de todo o Brasil, em cursos reconhecidos pelo MEC.",
    cta: "Como me matricular",
    href: "/matricula",
  },
  {
    titulo: "Impacto social real",
    texto: "Educação de qualidade para quem mais precisa, ajudando a construir uma sociedade mais justa.",
    cta: "Falar com a gente",
    href: "/contato",
  },
  {
    titulo: "Oportunidade de renda",
    texto: "Seja um representante autônomo, com ganhos proporcionais ao desempenho, suporte e treinamentos.",
    cta: "Quero ser representante",
    href: "/contato",
  },
];

function Seta({ sentido }: { sentido: "anterior" | "proximo" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={sentido === "anterior" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
    </svg>
  );
}

export default function Oportunidades() {
  const trilhaRef = useRef<HTMLUListElement>(null);
  const [indice, setIndice] = useState(0);
  /* Quantos cards cabem na janela. 0 = ainda não medido (é o valor do SSR,
     então a primeira pintura do cliente bate com a do servidor). */
  const [visiveis, setVisiveis] = useState(0);

  const maximo = visiveis > 0 ? Math.max(0, CARDS.length - visiveis) : 0;

  useEffect(() => {
    const trilha = trilhaRef.current;
    if (!trilha) return;

    /* A largura de cada card vem do CSS (--op-visiveis muda por breakpoint),
       então a posição do trilho é medida do layout real em vez de calculada
       à mão — sobrevive a resize e a mudança de fonte. */
    const aplicar = () => {
      const v = parseInt(getComputedStyle(trilha).getPropertyValue("--op-visiveis"), 10) || 1;
      setVisiveis(v);

      const max = Math.max(0, CARDS.length - v);
      const i = Math.min(indice, max);
      if (i !== indice) {
        setIndice(i);
        return; // o próximo ciclo posiciona
      }

      const cards = trilha.children;
      const base = (cards[0] as HTMLElement | undefined)?.offsetLeft ?? 0;
      const alvo = (cards[i] as HTMLElement | undefined)?.offsetLeft ?? 0;
      trilha.style.transform = `translate3d(${base - alvo}px, 0, 0)`;
    };

    aplicar();
    window.addEventListener("resize", aplicar);
    return () => window.removeEventListener("resize", aplicar);
  }, [indice]);

  /* Rolagem infinita: passou do último volta ao primeiro, e vice-versa. */
  const ir = (delta: number) =>
    setIndice((i) => {
      const prox = i + delta;
      if (prox > maximo) return 0;
      if (prox < 0) return maximo;
      return prox;
    });

  /* Enquanto não mediu, todos contam como visíveis: nada fica escondido de
     leitor de tela nem fora da ordem de tabulação sem necessidade. */
  const naJanela = (i: number) => visiveis === 0 || (i >= indice && i < indice + visiveis);

  return (
    <section className="op" aria-labelledby="op-titulo">
      <div className="op__wrap">
        <div className="op__palco">
          {/* Banner: o card em destaque encosta por cima da borda direita dele. */}
          <div className="op__banner">
            <Image
              src={BANNER.imagem}
              placeholder="blur"
              alt=""
              fill
              sizes="(min-width: 1200px) 432px, (min-width: 768px) 32vw, 100vw"
              className="op__banner-img"
            />
            <div className="op__banner-veu" />
            <div className="op__banner-texto">
              <p className="op__banner-fina">{BANNER.linhaFina}</p>
              <p className="op__banner-chamada">{BANNER.chamada}</p>
            </div>
          </div>

          <div className="op__head">
            <h2 id="op-titulo" className="op__titulo">
              {CABECALHO.titulo}
            </h2>
            <p className="op__subtitulo">{CABECALHO.subtitulo}</p>
          </div>

          {/* A janela fica à frente do banner e recorta na própria borda. */}
          <div className="op__janela">
            <ul className="op__trilha" ref={trilhaRef}>
              {CARDS.map((card, i) => (
                <li
                  key={card.titulo}
                  className={`op__card${i === indice ? " is-destaque" : ""}`}
                  aria-hidden={!naJanela(i)}
                >
                  <h3 className="op__card-titulo">{card.titulo}</h3>
                  <p className="op__card-texto">{card.texto}</p>
                  <Link href={card.href} className="op__card-link" tabIndex={naJanela(i) ? undefined : -1}>
                    {card.cta}
                    <Seta sentido="proximo" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seta, pontinhos e seta, centralizados. */}
          <div className="op__controles">
            <button
              type="button"
              className="op__seta"
              aria-label="Item anterior"
              onClick={() => ir(-1)}
            >
              <Seta sentido="anterior" />
            </button>

            <ul className="op__pontos">
              {CARDS.map((card, i) => (
                <li key={card.titulo}>
                  <button
                    type="button"
                    className={`op__ponto${i === indice ? " is-ativo" : ""}`}
                    aria-label={`Ir para o item ${i + 1}`}
                    aria-current={i === indice}
                    onClick={() => setIndice(Math.min(i, maximo))}
                  />
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="op__seta"
              aria-label="Próximo item"
              onClick={() => ir(1)}
            >
              <Seta sentido="proximo" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
