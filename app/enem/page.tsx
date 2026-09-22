import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import Container from "@/components/Container";
import EnemHero from "@/components/EnemHero";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import EnemDescontoForm from "@/components/EnemDescontoForm";
import { getAllCourses, getCourseNiveis } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Nota do Enem vale desconto",
  description: "Use a nota do seu Enem de qualquer edição anterior na Universidade Fácil e garanta desconto na mensalidade, sem precisar fazer uma nova prova.",
};

/* Frases da faixa que corre no rodapé da seção escura. Edite à vontade:
   entram e saem daqui, na ordem em que aparecem. */
const FRASES_MARQUEE = [
  "Educação acessível para todos",
  "Transformando vidas",
  "Seu futuro começa agora",
  "Até 100% de desconto",
  "Prepare-se para o mercado",
  "Estude. Evolua. Conquiste.",
];

const destaques = [
  {
    titulo: "Descontos exclusivos",
    texto: "Condições especiais para o seu futuro.",
    icone: (
      <>
        <circle cx="7.5" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.5" cy="16.5" r="2.6" stroke="currentColor" strokeWidth="2" />
        <path d="M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    titulo: "Processo seguro",
    texto: "Seus dados protegidos com a gente.",
    icone: (
      <path
        d="M12 3.2 19 6v5.2c0 4.2-2.9 7.9-7 9.1-4.1-1.2-7-4.9-7-9.1V6l7-2.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
  {
    titulo: "Atendimento rápido",
    texto: "Em poucos minutos você fala com a nossa equipe.",
    icone: (
      <path
        d="M13.2 2.5 5 13.2h5.6l-.8 8.3 8.2-10.7h-5.6l.8-8.3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
];

const passos = [
  { n: "1", t: "Escolha seu curso", d: "Selecione a graduação ou pós-graduação que você quer cursar." },
  { n: "2", t: "Informe sua nota", d: "Preencha o formulário com a nota do ENEM de qualquer edição anterior." },
  { n: "3", t: "Receba seu desconto", d: "A equipe de matrículas calcula o desconto que a sua nota garante." },
  { n: "4", t: "Garanta sua vaga", d: "Finalize a matrícula já com o desconto aplicado na mensalidade." },
];

const faqs = [
  {
    pergunta: "Minha nota do ENEM é de anos atrás, ainda vale?",
    resposta: "Sim. Aceitamos a nota de qualquer edição anterior do ENEM, não precisa ser a mais recente.",
  },
  {
    pergunta: "Como sei quanto de desconto vou receber?",
    resposta:
      "Preencha o formulário desta página com a sua nota — quanto maior ela for, maior o desconto que a equipe de matrículas calcula para você.",
  },
  {
    pergunta: "Preciso levar o boletim impresso na matrícula?",
    resposta: "Não. Basta informar o número de inscrição e a nota do ENEM no momento da matrícula.",
  },
];

export default async function EnemPage() {
  const [niveis, cursos] = await Promise.all([getCourseNiveis(), getAllCourses()]);

  return (
    <>
      <EnemHero />

      {/* Faixa de selos dividindo o hero da seção escura — mesmo azul da
          AnnouncementBar. Usa as versões "-corte": os arquivos originais têm
          margem transparente embutida (35% acima e abaixo na logo), então
          aumentar a altura só esticava o vazio, não a marca. */}
      <div className="bg-accent">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-4 sm:gap-x-20">
          <Image
            src="/images/logobranca-corte.png"
            alt="Universidade Fácil"
            width={1200}
            height={416}
            className="h-10 w-auto sm:h-14"
          />
          <Image
            src="/images/mecbranca-corte.png"
            alt="Instituições parceiras reconhecidas pelo MEC"
            width={179}
            height={44}
            className="h-8 w-auto sm:h-11"
          />
        </Container>
      </div>

      {/* Quanto menor a renda, maior a chance da bolsa — faixa com o grafismo
          da marca à esquerda, o card inclinado à direita e as frases correndo
          rente à base. */}
      <section className="relative isolate overflow-hidden bg-tint-deep">
        {/* Grafismo abstrato: o mesmo blob do resto do site, preso ao canto
            inferior esquerdo. O tom é só um degrau do fundo (sky-200 sobre
            tint-deep) para o fundo continuar lendo como uma cor só. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-[32%] h-[80%] w-[95%] sm:-left-[18%] sm:w-[68%] lg:-left-[8%] lg:w-[44%]"
        >
          <BlobDepoimentos fill="#e2d6ec" manterProporcao />
        </div>

        <Container className="relative z-10 pt-10 lg:pt-14">
          <div className="mx-auto max-w-2xl text-center">
            <AnimatedText
              as="h2"
              variant="titulo"
              className="t-h2 text-navy-950"
              destaque={{ texto: "maior a chance da bolsa.", className: "text-accent" }}
            >
              Quanto menor a renda, maior a chance da bolsa.
            </AnimatedText>

            <AnimatedText as="p" delay={0.12} className="t-lead mx-auto mt-6 max-w-xl text-muted">
              As bolsas gratuitas são destinadas a alunos de baixa renda e cada pedido é analisado pela
              nossa equipe de matrículas — informe a renda da sua família e descubra se você pode
              estudar de graça.
            </AnimatedText>

            <AnimatedText as="div" delay={0.24} className="mt-10">
              <a
                href="#simulador"
                className="group inline-flex h-14 items-center justify-between gap-5 rounded-full bg-gold pl-8 pr-3 text-base font-bold text-navy-950 transition-colors hover:bg-gold-hover sm:h-16"
              >
                Simule agora
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/10 transition-transform group-hover:translate-x-1">
                  <svg width="18" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                    <path
                      d="M1 7h17M12.5 1 18.5 7l-6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </AnimatedText>
          </div>

        </Container>

        {/* Faixa correndo, rente à base da seção. */}
        <div className="relative z-10 mt-9 pb-10 lg:mt-12">
          <InfiniteMarquee items={FRASES_MARQUEE} />
        </div>
      </section>

      {/* Formulário */}
      <section id="simulador" className="section-y scroll-mt-[122px] bg-[#faf8fc] lg:scroll-mt-[130px]">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-[3px] w-10 shrink-0 rounded-full bg-gold" aria-hidden />
              <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-muted">
                Simulador de descontos
              </span>
            </div>

            <h2 className="t-h2 mt-6 max-w-[13ch] text-navy-950">Simule seu desconto agora</h2>

            <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-muted">
              Preencha seus dados, o curso desejado e a sua nota do ENEM. Ao enviar, você abre o WhatsApp já
              com tudo preenchido para a nossa equipe calcular o seu desconto.
            </p>

            <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-0">
              {destaques.map((d, i) => (
                <div
                  key={d.titulo}
                  className={i > 0 ? "sm:border-l sm:border-navy-950/10 sm:pl-6" : "sm:pr-6"}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft text-gold-ink">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      {d.icone}
                    </svg>
                  </span>
                  <h3 className="mt-4 text-[15px] font-extrabold leading-snug text-navy-950">{d.titulo}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{d.texto}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={90}>
            <EnemDescontoForm niveis={niveis} cursos={cursos} />
          </Reveal>
        </Container>
      </section>

      {/* Como funciona — mesmo azul da forma orgânica da seção seguinte. */}
      <section className="section-y bg-[#d9c9e6]">
        <Container>
          <Reveal>
            <h2 className="t-h2 max-w-2xl text-navy-950">Como funciona em 4 passos</h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 70}>
                <div className="h-full rounded-2xl border-t-4 border-accent bg-white p-7">
                  <span className="font-display text-4xl font-extrabold text-accent">{p.n}</span>
                  <h3 className="mt-4 text-lg font-bold text-navy-950">{p.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Outras formas de ingressar — o padding vertical é menor que o
          section-y padrão para compensar a imagem maior: a seção cresce em
          largura de arte, não em altura. A forma orgânica é a mesma do
          "Como ingressar" das páginas de curso. */}
      <section className="relative overflow-hidden bg-surface py-10 lg:py-12">
        <BlobDepoimentos fill="#d9c9e6" manterProporcao />

        {/* Fora do Container e esticada por inset-y-0 na altura inteira do
            <section>: o object-contain a deixa do maior tamanho possível
            dentro dessa altura fixa, sem crescer a seção — se a largura
            pedida for grande demais, quem trava o tamanho é a altura. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[3%] hidden w-[460px] lg:block xl:w-[560px]"
        >
          <Image
            src="/images/ingresso-corte.png"
            alt=""
            fill
            sizes="560px"
            className="object-contain object-bottom"
          />
        </div>

        <Container className="relative z-10">
          <Reveal>
            <h2 className="t-h2 text-navy-950">Outras formas de ingressar</h2>
            <p className="t-lead mt-5 max-w-2xl text-muted">
              Prefere se matricular direto? Também temos esse caminho.
            </p>
          </Reveal>

          {/* Cards na coluna estreita da esquerda; a coluna da direita fica
              vazia de propósito — é onde a foto ancorada na base aparece. */}
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Reveal delay={70}>
                <Link
                  href="/matricula"
                  className="flex h-full flex-col rounded-2xl bg-navy-950 p-6 text-white transition-transform hover:-translate-y-1 sm:min-h-[270px]"
                >
                  <h3 className="t-h3">Faça sua matrícula direta</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-sky-200">
                    A via mais rápida: preencha seus dados e finalize a inscrição direto pelo site.
                  </p>
                  <span className="mt-auto pt-6 font-bold text-gold">Ver como funciona →</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-navy-950">Perguntas sobre o desconto do <span className="text-accent">ENEM</span></h2>
          </Reveal>
          <Reveal>
            <div className="mt-12">
              <FaqAccordion items={faqs} />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
