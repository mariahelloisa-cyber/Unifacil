import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import Container from "@/components/Container";
import BolsasHero from "@/components/BolsasHero";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import TextoEmergindo from "@/components/TextoEmergindo";
import { MatriculaInline } from "@/components/MatriculaButton";
import { getAllCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Bolsas de estudo",
  description: "Bolsas de 100% para estudantes de baixa renda e descontos de até 80% em centenas de cursos, em instituições reconhecidas pelo MEC. Simule a sua agora.",
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

const faqs = [
  {
    pergunta: "Quem pode se inscrever na bolsa de 100%?",
    resposta:
      "Estudantes com renda familiar de até 4 salários mínimos, inscritos em programas sociais do governo ou em situação de vulnerabilidade socioeconômica.",
  },
  {
    pergunta: "Como funciona o processo de seleção?",
    resposta:
      "Você preenche o formulário social, e nosso setor social avalia o seu perfil em até 10 dias úteis. Aprovado, pedimos os documentos para validação — com tudo certo, o acesso ao curso é liberado em até 48 horas.",
  },
  {
    pergunta: "Preciso pagar alguma taxa para me inscrever?",
    resposta: "Não. A inscrição e a matrícula pela bolsa de 100% não têm nenhuma taxa.",
  },
  {
    pergunta: "A bolsa pode ser cancelada depois da matrícula?",
    resposta:
      "Sim. Isso acontece em caso de ausência por mais de 30 dias consecutivos, reprovação em 3 disciplinas ou informações falsas apresentadas no cadastro.",
  },
  {
    pergunta: "Quais cursos participam do programa?",
    resposta:
      "Centenas de opções em instituições parceiras: cursos profissionalizantes, EJA, técnicos, graduações e pós-graduações.",
  },
  {
    pergunta: "E se eu não me enquadrar nos critérios da bolsa de 100%?",
    resposta:
      "Você ainda pode contar com desconto de até 80% do valor tradicional do curso, nas vagas que o programa adquire antecipadamente nas instituições parceiras.",
  },
];

export default async function BolsasPage() {
  const cursos = await getAllCourses();
  const opcoesDeCurso = cursos.map((c) => ({ id: c.id, nome: c.nome, nivel: c.nivelNome }));

  return (
    <>
      <BolsasHero />

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
              destaque={{ texto: "direito à bolsa de 100%.", className: "text-accent" }}
            >
              Baixa renda? Você pode ter direito à bolsa de 100%.
            </AnimatedText>

            <AnimatedText as="p" delay={0.12} className="t-lead mx-auto mt-6 max-w-xl text-muted">
              As bolsas de 100% são para famílias com renda de até 4 salários mínimos, inscritas em
              programas sociais do governo ou em situação de vulnerabilidade socioeconômica. Nosso
              setor social avalia seu perfil em até 10 dias úteis — informe seus dados e descubra se
              você pode estudar de graça.
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

      {/* Formulário — o mesmo formulário de matrícula, modo "vaga_gratuita":
          pede a renda, grava em public.matriculas e aparece no admin, igual
          aos outros pontos de entrada do site. */}
      <section id="simulador" className="scroll-mt-[122px] bg-white py-10 lg:scroll-mt-[130px] lg:py-14">
        <Container>
          {/* O cinza que era o fundo da seção virou um card arredondado sobre
              o branco — o conteúdo dentro dele não mudou. */}
          <div className="rounded-[32px] bg-[#faf8fc] p-7 sm:p-10 lg:p-14">
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                {/* Mesmo conteúdo e hierarquia do material do programa ("Bolsa
                    de estudos 100%"): cartaz em caixa alta, linha de apoio em
                    negrito, o corpo do texto e os passos da seleção numerados. */}
                <h2
                  className="font-display uppercase text-black"
                  style={{
                    fontSize: "clamp(2.75rem, 4.6vw, 4.25rem)",
                    fontWeight: 800,
                    lineHeight: 0.86,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Bolsa de
                  <br />
                  estudos
                  <br />
                  100%
                </h2>

                <p className="mt-2 text-[15px] font-bold leading-snug text-black">
                  Bolsas de 100% para quem precisa transformar o futuro agora
                </p>

                <div className="mt-5 space-y-4 text-[15px] leading-[1.6] text-[#3d3d3d]">
                  <p>
                    Somos um programa que estabelece parcerias com Universidades e Escolas Técnicas
                    em todo o Brasil, adquirindo um grande número de vagas em cursos
                    profissionalizantes, EJA, técnicos, graduações e pós-graduações.
                    Através dessas aquisições antecipadas, temos acesso a uma porcentagem de{" "}
                    <strong className="font-bold text-black">vagas totalmente gratuitas</strong>,
                    destinadas exclusivamente a estudantes de baixa renda.
                    Além das bolsas integrais, oferecemos vagas com{" "}
                    <strong className="font-bold text-black">descontos de até 80%</strong> sobre o
                    valor tradicional dos cursos.
                  </p>
                </div>

                <p className="mt-5 text-[15px] font-bold text-black">Como funciona o processo de seleção?</p>

                <ol className="mt-4 list-decimal space-y-3 pl-9 text-[15px] leading-[1.6] text-[#3d3d3d]">
                  <li>O candidato preenche o formulário social com seus dados.</li>
                  <li>A equipe do setor social avalia o perfil em até 10 dias úteis.</li>
                  <li>Após aprovação, os documentos são solicitados para validação.</li>
                  <li>
                    Com a documentação validada, o aluno recebe o acesso ao curso e pode iniciar em
                    até 48 horas.
                  </li>
                </ol>

                <p className="mt-5 text-[15px] font-bold text-black">
                  Quem pode se inscrever nas vagas 100% gratuitas?
                </p>

                <ul className="mt-4 list-disc space-y-3 pl-9 text-[15px] leading-[1.6] text-[#3d3d3d]">
                  <li>Estudantes com renda familiar de até 4 salários mínimos</li>
                  <li>Inscritos em programas sociais do governo</li>
                  <li>Pessoas em situação de vulnerabilidade socioeconômica</li>
                </ul>

                <p className="mt-5 text-[15px] leading-[1.6] text-[#3d3d3d]">
                  <strong className="font-bold text-black">Atenção:</strong> A bolsa pode ser
                  cancelada nos seguintes casos:
                </p>

                <ul className="mt-4 list-disc space-y-3 pl-9 text-[15px] leading-[1.6] text-[#3d3d3d]">
                  <li>Ausência nas aulas por mais de 30 dias consecutivos</li>
                  <li>Reprovação em 3 disciplinas</li>
                  <li>Apresentação de informações falsas no cadastro</li>
                </ul>

              </Reveal>

              <Reveal delay={90}>
                <MatriculaInline modo="vaga_gratuita" cursos={opcoesDeCurso} />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>


      {/* Respiro entre o formulário e o FAQ: uma frase só, que emerge palavra
          a palavra a partir do centro quando entra na tela. */}
      <section className="bg-navy-800 py-14 lg:py-20">
        <Container>
          <TextoEmergindo
            as="h2"
            texto="Ninguém deveria desistir de estudar por falta de dinheiro. É por isso que a bolsa de 100% existe."
            destaque={{ texto: "a bolsa de 100%", className: "text-gold" }}
            className="mx-auto max-w-[19ch] text-center font-display font-extrabold leading-[1.08] tracking-[-0.025em] text-white"
            style={{ fontSize: "clamp(2rem, 4.4vw, 3.75rem)" }}
          />

          {/* Saída para quem lê os critérios e não se encaixa: em vez de sair
              do site, segue para a matrícula, onde estão as vagas com desconto. */}
          <Reveal delay={200}>
            <p className="mx-auto mt-9 max-w-[52ch] text-center text-[15px] font-normal leading-relaxed text-white/75">
              Não se encaixa nos critérios da bolsa de 100%? Você ainda pode estudar com até 80% de
              desconto no curso que escolher.
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href="/matricula"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/40 px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-white/10"
              >
                Ver cursos com desconto
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 20 14"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  <path
                    d="M1 7h17M12.5 1 18.5 7l-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-navy-950">Perguntas sobre a <span className="text-accent">bolsa de 100%</span></h2>
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
