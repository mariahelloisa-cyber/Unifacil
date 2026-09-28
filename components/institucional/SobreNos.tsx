import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

/* >>> Textos da seção — é só trocar por aqui. Mesmo layout dos cards de
   ingresso da home (IngressoCards): título grande e tópicos curtos, uma ideia
   por linha, encerradas por vírgula e a última por ponto. */

const CARDS: { titulo: string; topicos: string[] }[] = [
  {
    titulo: "Visão",
    topicos: [
      "Ser o maior programa de inclusão educacional e empreendedorismo social do Brasil,",
      "Com a maior rede de representantes autônomos,",
      "Referência nacional em educação acessível e geração de renda.",
    ],
  },
  {
    titulo: "Missão",
    topicos: [
      "Formar mais de um milhão de brasileiros, entre alunos e representantes,",
      "Construir o maior grupo de representantes autônomos do país,",
      "Promover educação de qualidade e independência financeira.",
    ],
  },
  {
    titulo: "Nossos Valores",
    topicos: [
      "Inclusão: educação de qualidade para todos,",
      "Comprometimento: ética e transparência,",
      "Empreendedorismo Social: educação e renda,",
      "Transformação: vidas mudadas pelo conhecimento,",
      "Excelência: melhoria contínua,",
      "Colaboração: trabalho em equipe.",
    ],
  },
];

export default function SobreNos() {
  return (
    <section className="bg-white py-16 lg:py-20" aria-labelledby="sobre-nos-titulo">
      <Container>
        <Reveal className="mx-auto max-w-[1240px]">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-navy-800">Sobre nós</p>
          <h2
            id="sobre-nos-titulo"
            className="mt-1 font-display text-[clamp(2rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-navy-950"
          >
            O que nos move.
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[1240px] gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.titulo} delay={i * 80} className="h-full">
              <article className="flex h-full flex-col rounded-[15px] border-b-[10px] border-navy-850 bg-white p-[27px] shadow-[0_14px_36px_-20px_rgba(31,15,43,0.3)] ring-1 ring-navy-950/8 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(31,15,43,0.18)]">
                {/* Título numa linha só: a fonte é um pouco menor que a do t-card-h
                    para "Nossos Valores" caber inteiro no card mais estreito. */}
                <h3
                  className="t-card-h whitespace-nowrap text-navy-950"
                  style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.3rem)" }}
                >
                  {card.titulo}
                </h3>
                <ul className="mt-5 space-y-1.5 text-[14px] font-semibold leading-[1.45] text-muted">
                  {card.topicos.map((topico) => (
                    <li key={topico} className="flex gap-2.5">
                      <span aria-hidden className="mt-[7px] size-[3px] shrink-0 rounded-full bg-current" />
                      <span>{topico}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
