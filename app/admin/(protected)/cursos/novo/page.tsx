import Link from "next/link";
import { getCourseNiveis } from "@/lib/data/courses";
import { PageHeader } from "../../AdminUI";
import CourseForm from "../CourseForm";
import { createCourse } from "../actions";

export default async function NovoCursoPage() {
  const niveis = await getCourseNiveis();

  return (
    <div>
      <PageHeader icon="cursos" title="Novo curso" description="Cadastre um curso novo no site." />

      {niveis.length === 0 ? (
        <p className="mt-6 max-w-5xl rounded-2xl bg-white p-6 text-sm text-muted ring-1 ring-navy-950/5">
          Cadastre uma{" "}
          <Link href="/admin/cursos/niveis/novo" className="font-semibold text-accent hover:underline">
            Categoria
          </Link>{" "}
          antes de criar um curso.
        </p>
      ) : (
        <div className="mt-6 max-w-5xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
          <CourseForm action={createCourse} niveis={niveis} submitLabel="Criar curso" />
        </div>
      )}
    </div>
  );
}
