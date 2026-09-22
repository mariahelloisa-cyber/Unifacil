import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import CategoryHero from "@/components/CategoryHero";
import MarqueeBar from "@/components/MarqueeBar";
import CourseFinder from "@/components/CourseFinder";
import { getAllCourses, getCourseNiveis, getCourseNivelBySlug } from "@/lib/data/courses";

export async function generateStaticParams() {
  const niveis = await getCourseNiveis();
  return niveis.map((n) => ({ nivel: n.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nivel: string }>;
}): Promise<Metadata> {
  const { nivel } = await params;
  const nivelInfo = await getCourseNivelBySlug(nivel);
  if (!nivelInfo) return {};
  return { title: nivelInfo.nome, description: nivelInfo.descricao };
}

export default async function NivelPage({ params }: { params: Promise<{ nivel: string }> }) {
  const { nivel } = await params;
  const [nivelInfo, cursos] = await Promise.all([
    getCourseNivelBySlug(nivel),
    getAllCourses(),
  ]);

  if (!nivelInfo) notFound();

  return (
    <>
      <CategoryHero eyebrow={nivelInfo.nome} title={nivelInfo.titulo} description={nivelInfo.descricao} />
      <MarqueeBar />
      <section
        id="cursos"
        className="scroll-mt-[122px] bg-white pb-14 pt-8 sm:pb-16 sm:pt-10 lg:scroll-mt-[130px] lg:pb-20 lg:pt-12 xl:pb-24"
      >
        <Container>
          {/* O mesmo catálogo com filtros da /matricula: todos os cursos, abrindo
              com esta categoria marcada em "Formação" (dá para trocar ou somar outras). */}
          <CourseFinder courses={cursos} formacaoInicial={nivelInfo.nome} />
        </Container>
      </section>
    </>
  );
}
