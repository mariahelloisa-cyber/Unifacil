import Link from "next/link";
import ScrollDrawPath from "@/components/ScrollDrawPath";

/* Duas pontas de seta apontando para a esquerda, encostadas uma na outra. */
function SetaDupla({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 160" className={className} aria-hidden>
      <g fill="currentColor" stroke="currentColor" strokeWidth="24" strokeLinejoin="round">
        <polygon points="12,80 112,12 112,148" />
        <polygon points="108,80 208,12 208,148" />
      </g>
    </svg>
  );
}

/* "Por que a UniFácil?" — faixa em roxo sólido, em duas partes: em cima o
   texto que apresenta o programa, com a seta dupla da marca à direita; embaixo
   a chamada final com o CTA à direita e, à esquerda, o laço que se desenha
   quando a seção entra na tela. */
export default function PorQueUniFacil() {
  return (
    <section className="relative isolate overflow-hidden bg-accent">
      {/* Canto inferior esquerdo, embaixo dos parágrafos, com a altura saindo
          do aspect-ratio do desenho. Em telas largas (xl) o desenho cresce
          para 60% e desce 8% da própria altura: fica maior vazando pela borda
          de baixo, sem subir até o texto nem aumentar a seção. Até lg fica em
          50% — maior que isso, o arco final chega embaixo do botão. Abaixo de
          lg o conteúdo vira uma coluna só, e o pb-48 da parte de baixo reserva
          o espaço para a linha no pé da seção. */}
      <ScrollDrawPath className="w-[90%] opacity-50 md:w-1/2 md:opacity-100 xl:w-[60%] xl:translate-y-[8%]" />

      <div className="container-x relative z-10 pt-14 lg:pt-16">
        {/* Parte de cima */}
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-[720px]">
            <h2
              className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-gold-soft"
              style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
            >
              <strong className="font-extrabold">Estudar</strong> não precisa ser
              <br className="hidden sm:block" /> um sonho distante
            </h2>

            <div className="mt-7 space-y-5 text-[15px] leading-snug text-sky-100 lg:text-base">
              <p>
                Fazer uma faculdade ou um curso técnico é uma das decisões mais importantes da vida — e,
                para muita gente, o preço da mensalidade fecha essa porta antes mesmo de começar.
              </p>
              <p>
                <strong className="font-bold text-gold-soft">A boa notícia:</strong> a Universidade
                Fácil adquire vagas antecipadamente em universidades e escolas técnicas de todo o
                Brasil. Assim, oferece bolsas de 100% para alunos de baixa renda e descontos de até 80%
                em instituições reconhecidas pelo MEC.
              </p>
            </div>
          </div>

          <SetaDupla className="hidden w-[190px] shrink-0 text-gold-soft lg:block" />
        </div>

        {/* Parte de baixo: a coluna da esquerda fica vazia de propósito — é o
            espaço do laço, que está posicionado na seção inteira. */}
        <div className="mt-12 grid gap-10 pb-48 lg:mt-10 lg:min-h-[440px] lg:grid-cols-2 lg:pb-0">
          <div aria-hidden className="hidden lg:block" />

          <div className="flex flex-col items-center justify-center text-center lg:items-end lg:pb-16 lg:text-right">
            <h3
              className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-gold-soft"
              style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
            >
              Pronto para dar
              <br />
              <strong className="font-extrabold">o primeiro passo?</strong>
            </h3>

            <p className="mt-6 max-w-[400px] text-[15px] leading-snug text-sky-100 lg:text-base">
              <strong className="font-bold text-gold-soft">Em poucos minutos você garante a sua bolsa:</strong>{" "}
              escolha o curso, preencha seus dados e um consultor entra em contato para finalizar tudo
              com você.
            </p>

            <Link
              href="/institucional"
              className="mt-9 inline-flex w-full max-w-[440px] items-center justify-center rounded-full bg-gold-soft px-8 py-3.5 text-lg font-bold text-accent transition-colors hover:bg-white"
            >
              Conheça o programa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
