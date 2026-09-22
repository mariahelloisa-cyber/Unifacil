"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_MATRICULA } from "@/lib/matricula";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function atualizarStatus(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !Object.hasOwn(STATUS_MATRICULA, status)) return;

  await supabase.from("matriculas").update({ status }).eq("id", id);
  revalidatePath("/admin/matriculas");
  revalidatePath("/admin");
}

export async function excluirMatricula(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("matriculas").delete().eq("id", id);
  revalidatePath("/admin/matriculas");
  revalidatePath("/admin");
}
