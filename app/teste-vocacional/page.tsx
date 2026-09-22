import type { Metadata } from "next";
import VocationalQuiz from "@/components/vocational-quiz/VocationalQuiz";
import { getAllCourses } from "@/lib/data/courses";
import { COURSE_AFFINITY_PROFILES } from "@/lib/vocational-quiz/courseAffinityProfiles";
import type { QuizCourse } from "@/lib/vocational-quiz/types";

export const metadata: Metadata = {
  title: "Teste vocacional",
  description:
    "Responda 10 perguntas rápidas e descubra quais cursos da Universidade Fácil combinam com o seu perfil. Leva cerca de 2 minutos.",
};

export default async function TesteVocacionalPage() {
  const cursos = await getAllCourses();

  const semPerfil = cursos.filter((c) => !Object.hasOwn(COURSE_AFFINITY_PROFILES, c.slug));
  if (semPerfil.length > 0) {
    console.warn(
      `[teste-vocacional] Cursos sem perfil em lib/vocational-quiz/courseAffinityProfiles.ts (não serão recomendados): ${semPerfil
        .map((c) => c.slug)
        .join(", ")}`
    );
  }

  /* Só o necessário para os cards do resultado — a grade, a descrição e o
     restante do curso não viajam para o navegador. */
  const elegiveis: QuizCourse[] = cursos
    .filter((c) => c.nivelSlug && Object.hasOwn(COURSE_AFFINITY_PROFILES, c.slug))
    .map((c) => ({
      slug: c.slug,
      nivelSlug: c.nivelSlug,
      nivelNome: c.nivelNome,
      nome: c.nome,
      area: c.area,
      modalidade: c.modalidade,
      duracao: c.duracao,
      capaUrl: c.capaUrl,
    }));

  return <VocationalQuiz courses={elegiveis} />;
}
