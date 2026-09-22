"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MidiaFormState = { error?: string; ok?: string } | undefined;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function updateSiteMedia(
  chave: string,
  tipo: "imagem" | "video",
  _prevState: MidiaFormState,
  formData: FormData
): Promise<MidiaFormState> {
  const supabase = await requireUser();

  // O arquivo já foi enviado ao Storage pelo navegador (UploadField);
  // aqui só chega a URL pública.
  const url = String(formData.get("url") ?? "").trim();
  if (!url) return { error: "Escolha um arquivo antes de salvar." };

  // upsert: slots novos funcionam mesmo em bancos onde a linha ainda não existe.
  const { error } = await supabase
    .from("site_media")
    .upsert({ chave, tipo, url, updated_at: new Date().toISOString() }, { onConflict: "chave" });

  if (error) return { error: "Erro ao salvar a mídia." };

  revalidatePath("/", "layout");
  revalidatePath("/admin/midia");
  return { ok: "Mídia atualizada." };
}

export async function clearSiteMedia(formData: FormData) {
  const supabase = await requireUser();

  const chave = String(formData.get("chave") ?? "");
  if (!chave) return;

  await supabase.from("site_media").update({ url: "" }).eq("chave", chave);

  revalidatePath("/", "layout");
  revalidatePath("/admin/midia");
}
