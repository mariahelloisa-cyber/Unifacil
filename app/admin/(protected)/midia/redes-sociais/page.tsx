import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../AdminUI";
import MidiaSlot from "../MidiaSlot";

const SLOTS = [
  { chave: "social_facebook", titulo: "Facebook" },
  { chave: "social_instagram", titulo: "Instagram" },
  { chave: "social_youtube", titulo: "YouTube" },
  { chave: "social_reclameaqui", titulo: "Reclame Aqui" },
  { chave: "social_google", titulo: "Google Meu Negócio" },
];

export default async function RedesSociaisPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_media")
    .select("chave, url")
    .in(
      "chave",
      SLOTS.map((s) => s.chave)
    );

  const urls = new Map((data ?? []).map((row) => [row.chave as string, (row.url as string) ?? ""]));

  return (
    <div>
      <PageHeader
        icon="imagem"
        title="Redes Sociais"
        description="Imagens dos cards “Acompanhe” da página /institucional."
      />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {SLOTS.map((slot) => (
          <MidiaSlot
            key={slot.chave}
            chave={slot.chave}
            tipo="imagem"
            titulo={slot.titulo}
            url={urls.get(slot.chave) ?? ""}
            previewAspect="aspect-square"
            className=""
            dica="Use um print quadrado da página (ex.: 800x800)."
          />
        ))}
      </div>
    </div>
  );
}
