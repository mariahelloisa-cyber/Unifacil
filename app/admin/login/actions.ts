"use server";

import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; ok?: boolean } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  /* Sem redirect() aqui: a navegação suave que ele dispara logo após gravar
     o cookie da sessão ficava presa em "Entrando...". O formulário faz uma
     navegação completa para /admin — o mesmo que recarregar a página. */
  return { ok: true };
}
