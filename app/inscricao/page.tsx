import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { MatriculaInline } from "@/components/MatriculaButton";
import { getAllCourses } from "@/lib/data/courses";
import { ORIGEM_MATRICULA, type OrigemMatricula } from "@/lib/matricula";

export const metadata: Metadata = {
  title: "Inscrição",
  description: "Faça sua inscrição na Universidade Fácil: escolha o curso, preencha seus dados e garanta sua vaga.",
};

const HEROS: Record<OrigemMatricula, { title: string; description: string }> = {
  matricula: {
    title: "Garanta sua vaga",
    description: "Preencha seus dados e escolha o curso. Um consultor entra em contato para finalizar sua matrícula.",
  },
  vaga_gratuita: {
    title: "Simule sua bolsa de 100%",
    description: "Preencha seus dados, a sua renda e o curso. Um consultor verifica sua elegibilidade para a bolsa de 100%.",
  },
  simulacao: {
    title: "Quero meu desconto",
    description: "Preencha seus dados e escolha o curso. Um consultor volta com o valor do seu desconto.",
  },
};

/* Destino do "Matricule-se"/"Simule seu desconto" do rodapé e do menu: o
   mesmo formulário do botão da página de curso, com o curso escolhido numa
   lista. ?modo= troca entre matrícula, vaga gratuita e simulação. */
export default async function InscricaoPage({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string }>;
}) {
  const { modo: modoParam } = await searchParams;
  const modo: OrigemMatricula = modoParam && Object.hasOwn(ORIGEM_MATRICULA, modoParam) ? (modoParam as OrigemMatricula) : "matricula";

  const cursos = await getAllCourses();
  const hero = HEROS[modo];

  return (
    <>
      <PageHero eyebrow="Inscrição" title={hero.title} description={hero.description} art="campus" />
      <section className="section-y bg-white">
        <Container className="max-w-2xl">
          <MatriculaInline
            modo={modo}
            cursos={cursos.map((c) => ({ id: c.id, nome: c.nome, nivel: c.nivelNome }))}
          />
        </Container>
      </section>
    </>
  );
}
