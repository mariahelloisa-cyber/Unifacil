import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "@/components/CourseDetail";
import {
  getCourseBySlug,
  getCourseNiveis,
  getCoursesByNivelSlug,
} from "@/lib/data/courses";

export async function generateStaticParams() {
  const niveis = await getCourseNiveis();
  const paramsByNivel = await Promise.all(
    niveis.map(async (n) => {
      const cursos = await getCoursesByNivelSlug(n.slug);
      return cursos.map((c) => ({ nivel: n.slug, slug: c.slug }));
    })
  );
  return paramsByNivel.flat();
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nivel: string; slug: string }>;
}): Promise<Metadata> {
  const { nivel, slug } = await params;
  const course = await getCourseBySlug(nivel, slug);
  if (!course) return {};
  return { title: course.nome, description: course.resumo || course.descricao };
}

export default async function CursoPage({
  params,
}: {
  params: Promise<{ nivel: string; slug: string }>;
}) {
  const { nivel, slug } = await params;
  const course = await getCourseBySlug(nivel, slug);
  if (!course) notFound();

  return <CourseDetail course={course} />;
}
