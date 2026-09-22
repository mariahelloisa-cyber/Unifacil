import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import PhotoRail from "@/components/PhotoRail";
import BeneficiosCurso from "@/components/BeneficiosCurso";
import PorQueEscolher from "@/components/PorQueEscolher";
import CourseBannerCta from "@/components/CourseBannerCta";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import TrustBadges from "@/components/TrustBadges";
import MatriculaButton from "@/components/MatriculaButton";
import { SITE } from "@/lib/constants";
import { getAllCourses, getCourseNiveis } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Matrícula",
  description:
    "Garanta sua bolsa na Universidade Fácil: escolha o curso, clique em Matricule-se e preencha seus dados — um consultor entra em contato para finalizar tudo com você.",
};

/* O botão "Matricule-se" (aqui e na página de cada curso) abre o formulário
   de matrícula; os pedidos caem em /admin/matriculas e um consultor entra em
   contato. Os passos abaixo descrevem esse caminho. */
const passos = [
  {
    n: "1",
    t: "Escolha o seu curso",
    d: "Navegue por centenas de cursos profissionalizantes, EJA, técnicos, graduações e pós-graduações.",
  },
  {
    n: "2",
    t: "Clique em “Saiba mais”",
    d: "Na página do curso você vê a grade curricular, a duração e a modalidade. O valor com desconto você consulta com um consultor.",
  },
  {
    n: "3",
    t: "Clique em “Matricule-se”",
    d: "Preencha o formulário com nome completo, CPF, e-mail, telefone e o curso desejado.",
  },
  {
    n: "4",
    t: "Fale com um consultor",
    d: "Um consultor entra em contato, confere seus documentos, confirma o desconto da sua bolsa e garante sua vaga na instituição parceira.",
  },
];

const documentos = [
  {
    titulo: "Documento com foto",
    texto: "RG ou CNH, frente e verso — pode ser uma foto tirada pelo celular.",
    icone: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="9" cy="10.5" r="2.1" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5.8 16.5c.7-1.6 1.9-2.4 3.2-2.4s2.5.8 3.2 2.4M15 9.5h4M15 13h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    titulo: "CPF",
    texto: "Basta informar o número ao consultor, sem precisar de cópia impressa.",
    icone: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <path d="M7 10.5h4M7 14h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    titulo: "Histórico ou diploma",
    texto: "Certificado do Ensino Médio para a graduação; diploma de graduação para a pós.",
    icone: (
      <>
        <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path
          d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    titulo: "Comprovante de endereço",
    texto: "Uma conta recente no seu nome ou no nome de alguém da sua família.",
    icone: (
      <>
        <path d="M3 10.5 12 4l9 6.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M5.5 10.5V20h13v-9.5M10 20v-5h4v5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
  },
];

const faqs = [
  {
    pergunta: "Preciso fazer prova para me matricular?",
    resposta:
      "Não. A matrícula direta dispensa prova: você escolhe o curso, clica em Matricule-se, preenche seus dados e um consultor finaliza a inscrição com você.",
  },
  {
    pergunta: "Onde fica o formulário de matrícula?",
    resposta:
      "É só clicar em Matricule-se, aqui ou na página do curso. O formulário pede nome completo, CPF, e-mail, telefone e o curso desejado; depois disso um consultor entra em contato com você.",
  },
  {
    pergunta: "Quando eu começo a estudar?",
    resposta:
      "Assim que os documentos são conferidos e a sua vaga é confirmada na instituição parceira, o consultor te passa as orientações para começar o curso.",
  },
  {
    pergunta: "Quanto eu vou pagar?",
    resposta:
      "Depende do curso e da instituição parceira. As vagas do programa têm descontos de até 80% sobre o valor tradicional, e alunos de baixa renda podem ter acesso às vagas gratuitas. O consultor informa o valor do seu curso.",
  },
  {
    pergunta: "Posso me matricular em mais de um curso?",
    resposta:
      "Pode. Fale dos dois cursos na mesma conversa: o consultor organiza as duas matrículas e explica como ficam as mensalidades.",
  },
];

export default async function MatriculaPage() {
  const [niveis, todosOsCursos] = await Promise.all([getCourseNiveis(), getAllCourses()]);
  const opcoesDeCurso = todosOsCursos.map((c) => ({ id: c.id, nome: c.nome, nivel: c.nivelNome }));

  /* "Falar com um consultor" continua no WhatsApp, para quem quer tirar
     dúvidas antes de se matricular. */
  const whatsappHref = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Olá! Quero tirar uma dúvida sobre a matrícula na Universidade Fácil."
  )}`;

  return (
    <>
      <PageHero
        eyebrow="Matrícula"
        title="Seu futuro começa no curso que você escolher."
        description="Escolha um curso e garanta sua bolsa com até 80% de desconto. Sem prova: preencha seus dados e um consultor finaliza tudo com você."
        imageUrl="/images/matricula-hero.jpg"
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#cursos"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Escolher meu curso
            <svg
              width="19"
              height="14"
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
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 font-bold text-white transition-colors hover:bg-white/15"
          >
            Falar com um consultor
          </a>
        </div>
      </PageHero>

      {/* Faixa de selos — a mesma da página do ENEM. As versões "-corte" não
          têm a margem transparente embutida nos arquivos originais. */}
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

      <BeneficiosCurso />
      
      {/* Passo 1 na prática — a mesma seção "Escolha por categoria" da home,
          para a escolha do curso acontecer aqui mesmo em vez de mandar o
          visitante voltar ao menu. */}
      <section
        id="cursos"
        className="scroll-mt-[122px] bg-white pb-14 pt-2 sm:pb-16 lg:scroll-mt-[130px] lg:pb-20 xl:pb-24"
      >
        <Container>
          <Reveal>
            <PhotoRail
              titulo="Escolha por categoria"
              destaque="categoria"
              subtitulo="Centenas de cursos técnicos, EJA, graduações e pós-graduações com até 80% de desconto."
              itens={niveis
                .filter((n) => n.destaqueHome)
                .map((n) => ({
                  key: n.slug,
                  href: `/${n.slug}`,
                  nome: n.nome,
                  imagemUrl: n.imagemUrl,
                }))}
            />
          </Reveal>
        </Container>
      </section>

      {/* Faixa escura de CTA — atalho para quem já sabe o curso e quer se
          matricular direto, sem passar pela página do curso. */}
      <section className="relative overflow-hidden bg-navy-950">
        <Image
          src="/images/fachada.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-navy-950/80" />
        <Container className="relative py-16 text-center lg:py-20">
          <Reveal>
            <h2 className="t-h2 mx-auto max-w-3xl text-white">Já sabe o que quer cursar?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-sky-200">
              Preencha seus dados e escolha o curso. Um consultor entra em contato para fazer a
              inscrição e tirar suas dúvidas.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MatriculaButton
                cursos={opcoesDeCurso}
                className="inline-flex items-center justify-center rounded-full bg-accent px-9 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Matricule-se
              </MatriculaButton>
              <a
                href="#cursos"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-9 py-4 font-bold text-white transition-colors hover:bg-white/15"
              >
                Ver os cursos primeiro
              </a>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-14">
              <TrustBadges dark />
            </div>
          </Reveal>
        </Container>
      </section>


      <PorQueEscolher />


    {/* FAQ */}
      {/* Mesmo azul da forma orgânica da seção acima, como no "Como funciona"
          da página do ENEM. */}
      <section className="section-y bg-[#d9c9e6]">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-navy-950">
              Perguntas sobre a <span className="text-accent">matrícula</span>
            </h2>
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
