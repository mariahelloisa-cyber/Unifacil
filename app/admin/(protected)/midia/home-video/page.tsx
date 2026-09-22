import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../AdminUI";
import MidiaSlot from "../MidiaSlot";

export default async function VideoHomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_media")
    .select("url")
    .eq("chave", "home_hero_video")
    .maybeSingle();

  return (
    <div>
      <PageHeader
        icon="video"
        title="Vídeo da Home"
        description="Vídeo de fundo do topo da página inicial."
      />
      <MidiaSlot
        chave="home_hero_video"
        tipo="video"
        url={(data?.url as string) ?? ""}
        dica="O vídeo roda mudo, em loop e sem controles. Sem vídeo enviado, a home volta a usar a arte padrão. Prefira MP4 curto e leve (até ~10 MB) para não pesar o carregamento."
      />
    </div>
  );
}
