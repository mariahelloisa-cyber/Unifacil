"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type CourseFormState = { error?: string } | undefined;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

/* O formulário só tem os campos da página do curso (Duração, Carga horária,
   Modalidade, Início, Avaliação) além de nome/nível/área/capa. Destaques,
   "para quem", "onde atuar", grade e resumo saíram do admin: ficam fora do
   update para o que já estava salvo não ser apagado. */
function parseForm(formData: FormData) {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  return {
    nome: texto("nome"),
    nivel_id: texto("nivel_id"),
    area: texto("area"),
    duracao: texto("duracao"),
    descricao: texto("descricao"),
    inicio: texto("inicio"),
    carga_horaria: texto("carga_horaria"),
    avaliacao: texto("avaliacao"),
    destaque_home: formData.get("destaque_home") === "on",
  };
}

/* PGRST204/42703: o banco ainda não tem uma coluna nova (schema.sql não rodou). */
function mensagemDeErro(error: { code?: string }) {
  if (error.code === "23505") return "Já existe um curso com esse slug.";
  if (error.code === "PGRST204" || error.code === "42703")
    return "O banco ainda não tem os campos novos: rode o supabase/schema.sql no SQL Editor do Supabase.";
  return "Erro ao salvar o curso.";
}

function validate(course: ReturnType<typeof parseForm>): string | null {
  if (!course.nome) return "Informe o nome do curso.";
  if (!course.nivel_id) return "Selecione a categoria do curso.";
  if (!course.area) return "Selecione a área do curso.";
  if (!course.duracao) return "Informe a duração.";
  return null;
}

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const supabase = await requireUser();
  const course = parseForm(formData);

  const erro = validate(course);
  if (erro) return { error: erro };

  /* Slug e modalidade saíram do formulário: o slug vem do nome e a modalidade
     nasce como EAD. Na edição nenhum dos dois é tocado, para não trocar a URL
     de um curso já publicado. O FAQ é único para todos os cursos (lib/faq.ts). */
  const { error } = await supabase.from("courses").insert({
    ...course,
    slug: slugify(course.nome),
    modalidade: "EAD",
    mercado: "",
    capa_url: String(formData.get("capa_url") ?? ""),
  });

  if (error) {
    return { error: mensagemDeErro(error) };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
  redirect("/admin/cursos");
}

export async function updateCourse(
  id: string,
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const supabase = await requireUser();
  const course = parseForm(formData);

  const erro = validate(course);
  if (erro) return { error: erro };

  const capaUrl = String(formData.get("capa_url") ?? "");

  const updateData: Record<string, unknown> = { ...course };
  if (capaUrl) updateData.capa_url = capaUrl;

  const { error } = await supabase.from("courses").update(updateData).eq("id", id);
  if (error) {
    return { error: mensagemDeErro(error) };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
  redirect("/admin/cursos");
}

export async function deleteCourse(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("courses").delete().eq("id", id);

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
}
