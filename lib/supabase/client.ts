import { createBrowserClient } from "@supabase/ssr";

// Cliente do navegador — lê a sessão dos mesmos cookies gravados no login,
// então o upload direto para o Storage vai autenticado (exigência da RLS).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
