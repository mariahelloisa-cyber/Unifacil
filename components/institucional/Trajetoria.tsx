"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Container from "@/components/Container";
import "./trajetoria.css";

/* Mesmo padrão do EditorialScroll: efeito antes da pintura no cliente, sem o
   aviso de useLayoutEffect no SSR. */
const useEfeitoAntesDaPintura = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* >>> Os passos. Ficam alternados (esquerda/direita) na ordem em que estão.
   Pode acrescentar ou remover itens à vontade: a linha e o acendimento se
   ajustam sozinhos ao número de passos. */
const PASSOS: { titulo: string; texto: string }[] = [
  {
    titulo: "Lorem ipsum dolor sit amet",
    texto:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
  },
  {
    titulo: "quae ab illo inventore veritatis",
    texto:
      "aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem",
  },
  {
    titulo: "qui dolorem ipsum quia dolor sit amet",
    texto:
      "magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit",
  },
];

/** Tempo que a linha leva para ir do topo até o fim, em segundos. */
const DURACAO = 1.2;

export default function Trajetoria() {
  const raizRef = useRef<HTMLElement>(null);

  useEfeitoAntesDaPintura(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    /* Movimento reduzido: o CSS já monta tudo aceso e a linha cheia. Sai sem
       tocar em nada. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = gsap.utils.selector(raiz);
    const um = <T extends HTMLElement = HTMLElement>(sel: string) => q(sel)[0] as T;

    const trilho = um(".traj__trilho");
    const linha = um(".traj__linha");
    const preenchida = um(".traj__linha-fill");
    const ponta = um(".traj__ponta");
    const itens = q(".traj__item") as HTMLElement[];
    const pontos = q(".traj__ponto") as HTMLElement[];
    if (!trilho || !linha || !preenchida || !itens.length) return;

    /* Sem JS o CSS mostra tudo aceso. Esta classe é o que apaga os itens para
       a animação acontecer — nada depende do script para ficar legível. */
    raiz.classList.add("is-animada");

    /* Medidas em cache: o onUpdate roda a cada quadro e não pode ficar lendo
       o layout. Medidas tiradas na hora de tocar, com a página já assentada. */
    let alturaLinha = 0;
    let centros: number[] = [];
    const medir = () => {
      const caixaLinha = linha.getBoundingClientRect();
      alturaLinha = caixaLinha.height;
      centros = pontos.map((p) => {
        const r = p.getBoundingClientRect();
        return r.top + r.height / 2 - caixaLinha.top;
      });
    };

    const acesos = itens.map(() => false);

    /* Uma função só pinta o quadro inteiro a partir do progresso: a linha
       preenche, o brilho da ponta desce junto, e cada passo acende quando a
       ponta passa pelo ponto dele. */
    const desenhar = (p: number) => {
      const y = p * alturaLinha;
      gsap.set(preenchida, { scaleY: p });
      gsap.set(ponta, { y, autoAlpha: p > 0.001 && p < 0.999 ? 1 : 0 });

      itens.forEach((item, i) => {
        const ligado = y >= centros[i];
        if (ligado !== acesos[i]) {
          item.classList.toggle("is-on", ligado);
          acesos[i] = ligado;
        }
      });
    };

    /* O tween é num objeto descartável: serve só para o relógio. Quem pinta é
       o onUpdate da timeline. Velocidade constante — é uma luz percorrendo a
       linha, não um movimento com aceleração. */
    const proxy = { p: 0 };
    const tl = gsap
      .timeline({
        paused: true,
        onUpdate() {
          desenhar(this.progress());
        },
      })
      .to(proxy, { p: 1, duration: DURACAO, ease: "none" });

    desenhar(0);

    /* Toca inteira assim que a seção entra na tela, uma vez só. A margem
       negativa embaixo segura o disparo até ela estar de fato à vista. */
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        io.disconnect();
        medir();
        tl.play();
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(trilho);

    return () => {
      io.disconnect();
      tl.kill();
      raiz.classList.remove("is-animada");
      itens.forEach((i) => i.classList.remove("is-on"));
      gsap.set([preenchida, ponta], { clearProps: "all" });
    };
  }, []);

  return (
    <section ref={raizRef} className="traj" aria-labelledby="traj-titulo">
      <Container>
        <div className="traj__head">
          <p className="traj__eyebrow">Como funciona</p>
          <h2 id="traj-titulo" className="traj__titulo">
            Tragetória <span className="traj__marca text-gold">Universidade Fácil</span>
          </h2>
        </div>

        <div className="traj__trilho">
          {/* Fica atrás dos passos e cobre toda a altura da lista. */}
          <div className="traj__linha" aria-hidden>
            <div className="traj__linha-fill" />
            <div className="traj__ponta" />
          </div>

          <ol className="traj__lista">
            {PASSOS.map((passo, i) => (
              <li key={passo.titulo} className={`traj__item traj__item--${i % 2 === 0 ? "esq" : "dir"}`}>
                <div className="traj__texto">
                  <h3 className="traj__item-titulo">{passo.titulo}</h3>
                  <p className="traj__item-texto">{passo.texto}</p>
                </div>
                <span className="traj__ponto" aria-hidden />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
