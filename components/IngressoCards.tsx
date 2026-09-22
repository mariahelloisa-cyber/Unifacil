"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MatriculaButton, { type CursoOpcao } from "./MatriculaButton";

type Ingresso = {
  titulo: string;
  /* A descrição vira tópicos curtos, como na referência: uma ideia por linha,
     encerradas por vírgula e a última por ponto. */
  topicos: string[];
  cta: string;
  /* Os dois botões abrem o formulário de matrícula; muda o texto e o que fica
     registrado no admin (a simulação pede também a renda). */
  modo: "vaga_gratuita" | "simulacao";
  /* Paleta por card — mesma família azul da marca, do mais escuro ao mais vivo. */
  card: string;
  titleColor: string;
  bodyColor: string;
  button: string;
};

/* As duas frentes do programa (briefing): vagas gratuitas para baixa renda e
   vagas compradas repassadas com até 80% de desconto. */
const ingresso: Ingresso[] = [
  {
    titulo: "Seu futuro não depende do seu bolso.",
    topicos: [
      "Parte das vagas do programa é 100% gratuita,",
      "Reservada para alunos de baixa renda,",
      "E um consultor acompanha você até a matrícula.",
    ],
    cta: "Simular minha vaga gratuita",
    modo: "vaga_gratuita",
    card: "bg-navy-950",
    titleColor: "text-white",
    bodyColor: "text-sky-200",
    button: "bg-accent text-white hover:bg-accent-hover",
  },
  {
    titulo: "Pague até 80% menos no seu curso.",
    topicos: [
      "Centenas de cursos, do EJA à pós-graduação,",
      "Em instituições reconhecidas pelo MEC,",
      "Peça sem compromisso e descubra o seu desconto.",
    ],
    cta: "Quero meu desconto",
    modo: "simulacao",
    card: "bg-accent",
    titleColor: "text-white",
    bodyColor: "text-white/85",
    button: "bg-white text-accent hover:bg-accent-soft",
  },
];

/* A seção inteira compartilha um único observer: assim o título dispara primeiro
   e os cards entram em cascata a partir do mesmo instante, como na referência. */
export default function IngressoCards({ cursos }: { cursos: CursoOpcao[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  /* Guarda a própria classe de fundo do card sob o cursor (bg-navy-950, …),
     então a seção reaproveita exatamente a cor já definida em `ingresso`. */
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const state = shown ? "is-in" : "";

  return (
    /* max-w-[1180px] espelha o CourseFinder: alinha o título e o subtítulo
       com o "Cursos mais procurados" da seção acima. */
    <div ref={ref} className="mx-auto max-w-[1180px]">
      {/* Camada que pinta a seção inteira (inset-0 resolve na <section>, que é
          relative isolate). Fica atrás do conteúdo e só transiciona a cor. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-500 ease-out ${
          hovered ?? "bg-surface"
        }`}
      />

      {/* Cabeçalho: título grande à esquerda, link no canto superior direito */}
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <h2
          className={`rise t-h2 max-w-[16ch] transition-colors duration-500 ease-out ${
            hovered ? "text-white" : "text-navy-950"
          } ${state}`}
          style={
            { "--rise": "40px", fontSize: "clamp(1.75rem, 3.4vw, 3.05rem)" } as React.CSSProperties
          }
        >
          Educação acessível para todos.
        </h2>
        
      </div>

      <p
        className={`rise mt-4 max-w-2xl text-[15px] font-semibold leading-relaxed transition-colors duration-500 ease-out ${
          hovered ? "text-sky-200" : "text-navy-800"
        } ${state}`}
        style={{ "--rise": "30px", "--delay": "120ms" } as React.CSSProperties}
      >
        Compramos vagas antecipadamente nas instituições parceiras. É assim que chegamos a esses valores.
      </p>

      {/* A largura cai junto com a altura (85%) para os cards encolherem sem
          distorcer a proporção; o grid em si — colunas e ordem — não muda. */}
      <div className="mt-7 grid gap-3 sm:mx-auto sm:max-w-[85%] sm:grid-cols-2 lg:mt-9 lg:grid-cols-2">
        {ingresso.map((item, i) => (
          <div
            key={item.titulo}
            className={`rise ${state}`}
            style={
              {
                "--rise": `${56 + i * 22}px`,
                "--delay": `${240 + i * 110}ms`,
              } as React.CSSProperties
            }
          >
            <div
              onMouseEnter={() => setHovered(item.card)}
              onMouseLeave={() => setHovered(null)}
              className={`flex h-full min-h-[391px] flex-col rounded-[15px] border-b-[10px] border-gold p-[27px] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(31,15,43,0.18)] lg:min-h-[450px] ${item.card}`}
            >
              <h3 className={`t-card-h max-w-[10ch] ${item.titleColor}`}>{item.titulo}</h3>
              <ul className={`mt-5 max-w-[32ch] space-y-1.5 text-[14px] font-semibold leading-[1.45] ${item.bodyColor}`}>
                {item.topicos.map((topico) => (
                  <li key={topico} className="flex gap-2.5">
                    <span aria-hidden className="mt-[7px] size-[3px] shrink-0 rounded-full bg-current" />
                    <span>{topico}</span>
                  </li>
                ))}
              </ul>
              {/* mt-auto empurra o botão para a base: o vazio entre descrição e
                  botão cresce sozinho e os botões ficam na mesma linha. */}
              <MatriculaButton
                modo={item.modo}
                cursos={cursos}
                className={`mt-auto flex h-[43px] w-full items-center justify-center rounded-xl px-5 text-center text-[13px] font-bold transition-colors ${item.button}`}
              >
                {item.cta}
              </MatriculaButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
