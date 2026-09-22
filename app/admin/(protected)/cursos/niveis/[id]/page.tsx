import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../../AdminUI";
import NivelForm from "../NivelForm";
import { updateNivel } from "../actions";

type NivelRow = {
  id: string;
  slug: string;
  nome: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  ordem: number;
  destaque_home?: boolean;
};

export default async function EditarNivelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const consultar = (fields: string) =>
    supabase.from("course_niveis").select(fields).eq("id", id).maybeSingle<NivelRow>();
  const campos = "id, slug, nome, titulo, descricao, imagem_url, ordem";
  /* Sem a coluna destaque_home (schema.sql ainda não rodou), abre mesmo assim. */
  const comDestaque = await consultar(`${campos}, destaque_home`);
  const { data: nivel } =
    comDestaque.error?.code === "42703" ? await consultar(campos) : comDestaque;

  if (!nivel) notFound();

  const updateNivelWithId = updateNivel.bind(null, id);

  return (
    <div>
      <PageHeader icon="niveis" title="Editar a categoria de curso" description={`/${nivel.slug}`} />
      <div className="mt-6 max-w-3xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <NivelForm
          action={updateNivelWithId}
          submitLabel="Salvar alterações"
          defaultValues={{
            nome: nivel.nome,
            slug: nivel.slug,
            titulo: nivel.titulo,
            descricao: nivel.descricao,
            imagemUrl: nivel.imagem_url,
            ordem: nivel.ordem,
            destaqueHome: nivel.destaque_home ?? true,
          }}
        />
      </div>
    </div>
  );
}
