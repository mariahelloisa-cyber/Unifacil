import { createClient } from "@/lib/supabase/server";
import { ListCard, PageHeader, PrimaryButton, StatCard } from "../AdminUI";
import CursosList, { type CursoListItem } from "./CursosList";

type CourseRow = {
  id: string;
  nome: string;
  area: string;
  duracao: string;
  capa_url: string;
  destaque_home: boolean;
  course_niveis: { nome: string } | null;
};

export default async function AdminCursosPage() {
  const supabase = await createClient();

  const [{ data }, { data: niveisData }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, nome, area, duracao, capa_url, destaque_home, course_niveis!nivel_id(nome)")
      .order("nome", { ascending: true }),
    supabase.from("course_niveis").select("nome").order("ordem", { ascending: true }),
  ]);

  const rows = (data ?? []) as unknown as CourseRow[];

  const cursos: CursoListItem[] = rows.map((c) => ({
    id: c.id,
    nome: c.nome,
    area: c.area,
    duracao: c.duracao,
    capaUrl: c.capa_url,
    destaqueHome: c.destaque_home,
    nivelNome: c.course_niveis?.nome ?? "",
  }));

  const niveis = (niveisData ?? []).map((n) => n.nome as string);
  const emDestaque = cursos.filter((c) => c.destaqueHome).length;

  return (
    <div>
      <PageHeader
        icon="cursos"
        title="Cursos"
        description="Os cursos cadastrados aqui aparecem na página da categoria deles e no site."
        action={<PrimaryButton href="/admin/cursos/novo">+ Novo curso</PrimaryButton>}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Cursos cadastrados" value={cursos.length} icon="cursos" cor="azul" />
        <StatCard label="Níveis" value={niveis.length} icon="niveis" cor="indigo" />
        <StatCard
          label="Em destaque na home"
          value={emDestaque}
          note="Aparecem em “Cursos mais procurados”"
          icon="dashboard"
          cor="amarelo"
        />
      </div>

      <ListCard title="Lista">
        <CursosList cursos={cursos} niveis={niveis} />
      </ListCard>
    </div>
  );
}
