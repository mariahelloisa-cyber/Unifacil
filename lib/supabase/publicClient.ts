import { createClient } from "@supabase/supabase-js";

// Cliente sem cookies/sessão — usado para leituras públicas, inclusive em
// generateStaticParams no build, onde next/headers não está disponível.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
