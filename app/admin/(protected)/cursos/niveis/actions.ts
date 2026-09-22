"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type NivelFormState = { error?: string } | undefined;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function parseForm(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const ordem = Number(formData.get("ordem") ?? 0) || 0;
  const destaque_home = formData.get("destaque_home") === "on";
  const slug = slugify(slugRaw || nome);
  return { nome, slug, titulo, descricao, ordem, destaque_home };
}

/* PGRST204/42703: o banco ainda não tem a coluna destaque_home. */
function mensagemDeErro(error: { code?: string }) {
  if (error.code === "23505") return "Já existe uma categoria com esse slug.";
  if (error.code === "PGRST204" || error.code === "42703")
    return "O banco ainda não tem o campo de destaque: rode o supabase/schema.sql no SQL Editor do Supabase.";
  return "Erro ao salvar o nível.";
}

export async function createNivel(_prevState: NivelFormState, formData: FormData): Promise<NivelFormState> {
  const supabase = await requireUser();
  const nivel = parseForm(formData);

  if (!nivel.nome || !nivel.titulo) {
    return { error: "Preencha nome e título." };
  }

  const { error } = await supabase.from("course_niveis").insert({
    ...nivel,
    imagem_url: String(formData.get("imagem_url") ?? ""),
  });

  if (error) {
    return { error: mensagemDeErro(error) };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos/niveis");
  redirect("/admin/cursos/niveis");
}

export async function updateNivel(
  id: string,
  _prevState: NivelFormState,
  formData: FormData
): Promise<NivelFormState> {
  const supabase = await requireUser();
  const nivel = parseForm(formData);

  if (!nivel.nome || !nivel.titulo) {
    return { error: "Preencha nome e título." };
  }

  const imagemUrl = String(formData.get("imagem_url") ?? "");

  const updateData: Record<string, unknown> = { ...nivel };
  if (imagemUrl) updateData.imagem_url = imagemUrl;

  const { error } = await supabase.from("course_niveis").update(updateData).eq("id", id);
  if (error) {
    return { error: mensagemDeErro(error) };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos/niveis");
  redirect("/admin/cursos/niveis");
}

export async function deleteNivel(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("course_niveis").delete().eq("id", id);

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos/niveis");

  if (error) {
    redirect(
      `/admin/cursos/niveis?erro=${encodeURIComponent(
        "Não deu para excluir: ainda existem cursos cadastrados nesse nível."
      )}`
    );
  }
}
