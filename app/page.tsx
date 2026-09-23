import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PhotoRail from "@/components/PhotoRail";
import IngressoCards from "@/components/IngressoCards";
import SplitFeature from "@/components/SplitFeature";
import FaqAccordion from "@/components/FaqAccordion";
import QuizIntro from "@/components/vocational-quiz/QuizIntro";
import { getAllCourses, getCourseNiveis, getFeaturedCourses } from "@/lib/data/courses";
import { getSiteMediaUrl } from "@/lib/data/siteMedia";

/* Respostas tiradas do briefing do programa ("O que somos" e "Como funciona"). */
const faqs = [
  {
    pergunta: "O que é a Universidade Fácil?",
    resposta:
      "É um programa social de bolsas de estudo. Firmamos parcerias com universidades e escolas técnicas de todo o Brasil e adquirimos vagas antecipadamente em centenas de cursos — é isso que nos permite oferecer bolsas de 100% e descontos de até 80%.",
  },
  {
    pergunta: "Como funciona a bolsa de 100%?",
    resposta:
      "Ao adquirir um grande número de vagas, o programa recebe uma porcentagem de vagas totalmente gratuitas: são as bolsas de 100%, destinadas a alunos de baixa renda, para que mais pessoas possam estudar sem o peso financeiro.",
  },
  {
    pergunta: "De quanto é o desconto?",
    resposta:
      "As vagas adquiridas pelo programa são repassadas aos estudantes com descontos que podem chegar a 80% do valor tradicional do curso. E parte das vagas é bolsa de 100%, sem custo nenhum: são para estudantes com renda familiar de até 4 salários mínimos, inscritos em programas sociais do governo ou em situação de vulnerabilidade socioeconômica.",
  },
  {
    pergunta: "Quais cursos eu posso fazer?",
    resposta:
      "São centenas de opções: cursos profissionalizantes, EJA (Educação de Jovens e Adultos), técnicos, graduações e pós-graduações.",
  },
  {
    pergunta: "O curso é reconhecido pelo MEC?",
    resposta:
      "Sim. Os cursos do programa são feitos em instituições parceiras reconhecidas pelo MEC.",
  },
  {
    pergunta: "Qual a diferença entre bacharelado, licenciatura e tecnólogo?",
    resposta:
      "O bacharelado é a formação mais ampla; a licenciatura habilita para a docência; o tecnólogo é mais curto e focado numa área específica do mercado.",
  },
];

export default async function HomePage() {
  const [categorias, maisProcurados, todosOsCursos, heroVideoUrl] = await Promise.all([
    getCourseNiveis(),
    getFeaturedCourses(),
    getAllCourses(),
    getSiteMediaUrl("home_hero_video"),
  ]);

  return (
    <>
      <Hero videoUrl={heroVideoUrl} />

      {/* 1 — Escolha por categoria: um card com foto por categoria marcada como
          destaque no admin (Categorias → "Mostrar em Escolha por categoria") */}
      {/* pt igual ao espaço entre o título e os cards: o título fica no meio do branco. */}
      <section className="bg-white pb-[clamp(3.5rem,7vw,6.5rem)] pt-12 lg:pt-14">
        <Container>
          <Reveal>
            <PhotoRail
              titulo="Escolha por categoria"
              destaque="categoria"
              subtitulo="Centenas de cursos técnicos, EJA, graduações e pós-graduações com até 80% de desconto."
              itens={categorias.filter((c) => c.destaqueHome).map((c) => ({
                key: c.slug,
                href: `/${c.slug}`,
                nome: c.nome,
                imagemUrl: c.imagemUrl,
              }))}
            />
          </Reveal>
        </Container>
      </section>

      {/* Faixa de foto única — matricula-hero.jpg é provisória, até chegar a foto definitiva. */}
      <section className="relative aspect-[4/3] w-full overflow-hidden bg-navy-850 sm:aspect-[21/9]">
        <Image
          src="/images/matricula-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={95}
          className="object-cover"
        />
      </section>

      {/* Cursos mais procurados: os cursos marcados no admin (Cursos → "Mostrar em
          Cursos mais procurados na home"). Some sozinha se nenhum estiver marcado. */}
      {maisProcurados.length > 0 && (
        <section className="bg-white pt-[clamp(2rem,3.5vw,3rem)] pb-[clamp(3.5rem,7vw,6.5rem)]">
          <Container>
            <Reveal>
              <PhotoRail
                titulo="Cursos mais procurados"
                destaque="procurados"
                subtitulo="Os cursos que mais atraem alunos para o programa, com até 80% de desconto."
                verTodos={{ href: "/matricula#cursos", label: "Ver todos" }}
                compacto
                itens={maisProcurados.map((c) => ({
                  key: c.id,
                  href: `/${c.nivelSlug}/${c.slug}`,
                  nome: c.nome,
                  imagemUrl: c.capaUrl,
                  rotulo: c.nivelNome,
                }))}
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* 2 — Bolsa de 100% ou até 80% de desconto: dois cards que abrem o formulário */}
      <section className="relative isolate bg-surface pt-[clamp(2rem,3.9vw,3.5rem)] pb-[clamp(3rem,5.95vw,5.5rem)]">
        <Container>
          <IngressoCards
            cursos={todosOsCursos.map((c) => ({ id: c.id, nome: c.nome, nivel: c.nivelNome }))}
          />
        </Container>
      </section>

      {/* 3 — Split assimétrico full-bleed: por que a UniFácil */}
      <SplitFeature
        art="/images/sobre1.jpg"
        eyebrow="Por que a UniFácil?"
        title="Um programa para quem quer estudar e transformar a própria vida."
        body="A Universidade Fácil adquire vagas antecipadamente em universidades e escolas técnicas de todo o Brasil. Assim, oferece bolsas de 100% para alunos de baixa renda e descontos de até 80% em cursos de instituições reconhecidas pelo MEC."
        linkHref="/institucional"
        linkLabel="Conheça o programa"
        badge={{ top: "Instituições reconhecidas pelo", big: "MEC" }}
        cards={[
          { art: "/images/imagem1.jpg", label: "Bolsa de 100%" },
          { art: "/images/imagem2.jpg", label: "Até 80% de desconto" },
          { art: "/images/imagem3.jpg", label: "Centenas de cursos" },
        ]}
      />

      {/* 5 — Teste vocacional: só a chamada; as perguntas ficam em /teste-vocacional */}
      <QuizIntro />

      {/* 7 — FAQ em duas colunas */}
      <section className="section-y bg-tint-deep">
        <Container>
          <Reveal>
            <SectionHeading title="Perguntas frequentes" />
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
