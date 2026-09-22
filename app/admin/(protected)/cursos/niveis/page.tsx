import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Chip, EditIconLink, EmptyState, ListCard, PageHeader, PrimaryButton } from "../../AdminUI";
import DeleteNivelButton from "./DeleteNivelButton";

export default async function AdminNiveisPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  const supabase = await createClient();
  const [{ data: niveis }, { data: cursos }] = await Promise.all([
    supabase
      .from("course_niveis")
      .select("*")
      .order("ordem", { ascending: true }),
    supabase.from("courses").select("nivel_id"),
  ]);

  const contagem = new Map<string, number>();
  for (const curso of cursos ?? []) {
    const id = curso.nivel_id as string;
    contagem.set(id, (contagem.get(id) ?? 0) + 1);
  }

  return (
    <div>
      <PageHeader
        icon="niveis"
        title="Categorias"
        description="Cada categoria vira uma página do site e entra no menu automaticamente."
        action={<PrimaryButton href="/admin/cursos/niveis/novo">+ Novo nível</PrimaryButton>}
      />

      {erro && (
        <p className="mt-5 rounded-xl bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-dark">{erro}</p>
      )}

      <ListCard title="Lista">
        <div className="divide-y divide-navy-950/8">
          {(niveis ?? []).map((nivel) => {
            const total = contagem.get(nivel.id as string) ?? 0;
            return (
              <div key={nivel.id} className="flex items-center gap-4 py-3.5">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {nivel.imagem_url && (
                    <Image src={nivel.imagem_url} alt="" fill className="object-cover" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[15px] font-bold text-navy-950">
                    <span className="truncate">{nivel.nome}</span>
                    {nivel.destaque_home !== false && <Chip cor="cinza">Destaque</Chip>}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    /{nivel.slug} · {total} {total === 1 ? "curso" : "cursos"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <EditIconLink
                    href={`/admin/cursos/niveis/${nivel.id}`}
                    label={`Editar ${nivel.nome}`}
                  />
                  <DeleteNivelButton id={nivel.id} nome={nivel.nome} />
                </div>
              </div>
            );
          })}
        </div>

        {(niveis ?? []).length === 0 && <EmptyState>Nenhuma categoria cadastrado ainda.</EmptyState>}
      </ListCard>
    </div>
  );
}
