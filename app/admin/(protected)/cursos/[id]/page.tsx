import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourseNiveis } from "@/lib/data/courses";
import { PageHeader } from "../../AdminUI";
import CourseForm from "../CourseForm";
import { updateCourse } from "../actions";

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: curso }, niveis] = await Promise.all([
    supabase
      .from("courses")
      /* "*": abre mesmo antes de o schema.sql criar as colunas novas. */
      .select("*")
      .eq("id", id)
      .maybeSingle(),
    getCourseNiveis(),
  ]);

  if (!curso) notFound();

  const updateCourseWithId = updateCourse.bind(null, id);

  return (
    <div>
      <PageHeader icon="cursos" title="Editar curso" description={curso.nome} />
      <div className="mt-6 max-w-5xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <CourseForm
          action={updateCourseWithId}
          niveis={niveis}
          submitLabel="Salvar alterações"
          defaultValues={{
            nome: curso.nome,
            nivelId: curso.nivel_id,
            area: curso.area,
            duracao: curso.duracao,
            capaUrl: curso.capa_url,
            descricao: curso.descricao,
            inicio: curso.inicio ?? "",
            cargaHoraria: curso.carga_horaria ?? "",
            avaliacao: curso.avaliacao ?? "",
            destaqueHome: curso.destaque_home,
          }}
        />
      </div>
    </div>
  );
}
