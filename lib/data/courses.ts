import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/publicClient";

export type CourseDisciplina = { nome: string; horas?: string };
export type CourseModulo = { titulo: string; disciplinas: CourseDisciplina[] };

/* A grade vinha (e ainda pode vir, em cursos antigos) com as disciplinas como
   texto puro. Aqui tudo vira { nome, horas } para o resto do site nao precisar
   saber disso. */
export function normalizeGrade(valor: unknown): CourseModulo[] {
  if (!Array.isArray(valor)) return [];

  return valor.flatMap((modulo) => {
    if (!modulo || typeof modulo !== "object") return [];
    const { titulo, disciplinas } = modulo as { titulo?: unknown; disciplinas?: unknown };
    if (typeof titulo !== "string" || !titulo.trim()) return [];

    const itens = (Array.isArray(disciplinas) ? disciplinas : []).flatMap((d): CourseDisciplina[] => {
      if (typeof d === "string") return d.trim() ? [{ nome: d.trim() }] : [];
      if (!d || typeof d !== "object") return [];
      const { nome, horas } = d as { nome?: unknown; horas?: unknown };
      if (typeof nome !== "string" || !nome.trim()) return [];
      const h =
        typeof horas === "string" ? horas.trim() : typeof horas === "number" ? String(horas) : "";
      return [h ? { nome: nome.trim(), horas: h } : { nome: nome.trim() }];
    });

    return itens.length > 0 ? [{ titulo: titulo.trim(), disciplinas: itens }] : [];
  });
}

export type Course = {
  id: string;
  slug: string;
  nome: string;
  nivelSlug: string;
  nivelNome: string;
  area: string;
  modalidade: string;
  duracao: string;
  capaUrl: string;
  resumo: string;
  descricao: string;
  destaques: string[];
  destaqueHome: boolean;
  /* Conteúdo da página do curso — opcional, cada bloco some quando vazio. */
  paraQuem: string[];
  atuacao: string[];
  grade: CourseModulo[];
  /* "Sobre o curso": Início do curso, Carga horária, Avaliação e certificação. */
  inicio: string;
  cargaHoraria: string;
  avaliacao: string;
};

export type CourseNivel = {
  id: string;
  slug: string;
  nome: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  ordem: number;
  /* Aparece no "Escolha por categoria" da home. */
  destaqueHome: boolean;
};

type CourseRow = {
  id: string;
  slug: string;
  nome: string;
  area: string;
  modalidade: string;
  duracao: string;
  capa_url: string;
  resumo: string;
  descricao: string;
  destaques: string[];
  destaque_home: boolean;
  para_quem: string[] | null;
  atuacao: string[] | null;
  inicio?: string | null;
  carga_horaria?: string | null;
  avaliacao?: string | null;
  grade: unknown;
  course_niveis: { slug: string; nome: string } | null;
};

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

const NIVEL_FIELDS = "id, slug, nome, titulo, descricao, imagem_url, ordem";

const COURSE_FIELDS_BASE =
  "id, slug, nome, area, modalidade, duracao, capa_url, resumo, descricao, destaques, destaque_home";

/* Campos da página "Saiba mais" — adicionados pelo schema.sql. */
const COURSE_FIELDS_PAGINA = `${COURSE_FIELDS_BASE}, para_quem, atuacao, grade`;

/* Campos de "Sobre o curso" — também do schema.sql, adicionados depois. */
const COURSE_FIELDS = `${COURSE_FIELDS_PAGINA}, inicio, carga_horaria, avaliacao`;

type CourseQueryResult = {
  data: unknown;
  error: { code?: string; message: string } | null;
};

/** Consulta os cursos com os campos da página do curso e, caso o banco ainda
 *  não tenha recebido o ALTER TABLE do schema.sql (erro 42703), repete sem
 *  eles — assim o site não fica sem cursos antes da migração rodar. */
async function queryCourses(
  run: (fields: string) => PromiseLike<CourseQueryResult>
): Promise<CourseQueryResult> {
  let resultado = await run(COURSE_FIELDS);
  for (const campos of [COURSE_FIELDS_PAGINA, COURSE_FIELDS_BASE]) {
    if (resultado.error?.code !== "42703") break;
    resultado = await run(campos);
  }
  return resultado;
}

function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    nivelSlug: row.course_niveis?.slug ?? "",
    nivelNome: row.course_niveis?.nome ?? "",
    area: row.area,
    modalidade: row.modalidade,
    duracao: row.duracao,
    capaUrl: row.capa_url,
    resumo: row.resumo,
    descricao: row.descricao,
    destaques: row.destaques,
    destaqueHome: row.destaque_home,
    paraQuem: row.para_quem ?? [],
    atuacao: row.atuacao ?? [],
    inicio: row.inicio ?? "",
    cargaHoraria: row.carga_horaria ?? "",
    avaliacao: row.avaliacao ?? "",
    grade: normalizeGrade(row.grade),
  };
}

function mapNivel(row: NivelRow): CourseNivel {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    titulo: row.titulo,
    descricao: row.descricao,
    imagemUrl: row.imagem_url,
    ordem: row.ordem,
    destaqueHome: row.destaque_home ?? true,
  };
}

export const getCourseNiveis = cache(async (): Promise<CourseNivel[]> => {
  const consultar = (fields: string) =>
    supabasePublic.from("course_niveis").select(fields).order("ordem", { ascending: true });

  /* Sem a coluna destaque_home (schema.sql ainda não rodou, erro 42703), repete
     sem ela — todas contam como destaque e o menu não fica vazio. */
  let { data, error } = await consultar(`${NIVEL_FIELDS}, destaque_home`);
  if (error?.code === "42703") ({ data, error } = await consultar(NIVEL_FIELDS));

  if (error) {
    console.error("Erro ao buscar categorias:", error.message);
    return [];
  }

  return (data as unknown as NivelRow[]).map(mapNivel);
});

export async function getCourseNivelBySlug(slug: string): Promise<CourseNivel | null> {
  const { data, error } = await supabasePublic
    .from("course_niveis")
    .select(NIVEL_FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar categoria de curso:", error.message);
    return null;
  }

  return data ? mapNivel(data as NivelRow) : null;
}

export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await queryCourses((fields) =>
    supabasePublic
      .from("courses")
      .select(`${fields}, course_niveis!nivel_id(slug, nome)`)
      .order("nome", { ascending: true })
  );

  if (error) {
    console.error("Erro ao buscar cursos:", error.message);
    return [];
  }

  return (data as unknown as CourseRow[]).map(mapCourse);
}

export async function getCoursesByNivelSlug(nivelSlug: string): Promise<Course[]> {
  const { data, error } = await queryCourses((fields) =>
    supabasePublic
      .from("courses")
      .select(`${fields}, course_niveis!inner(slug, nome)`)
      .eq("course_niveis.slug", nivelSlug)
      .order("nome", { ascending: true })
  );

  if (error) {
    console.error("Erro ao buscar cursos:", error.message);
    return [];
  }

  return (data as unknown as CourseRow[]).map(mapCourse);
}

export async function getCourseBySlug(nivelSlug: string, slug: string): Promise<Course | null> {
  const { data, error } = await queryCourses((fields) =>
    supabasePublic
      .from("courses")
      .select(`${fields}, course_niveis!inner(slug, nome)`)
      .eq("course_niveis.slug", nivelSlug)
      .eq("slug", slug)
      .maybeSingle()
  );

  if (error) {
    console.error("Erro ao buscar curso:", error.message);
    return null;
  }

  return data ? mapCourse(data as unknown as CourseRow) : null;
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await queryCourses((fields) =>
    supabasePublic
      .from("courses")
      .select(`${fields}, course_niveis!nivel_id(slug, nome)`)
      .eq("destaque_home", true)
      .order("nome", { ascending: true })
  );

  if (error) {
    console.error("Erro ao buscar cursos em destaque:", error.message);
    return [];
  }

  return (data as unknown as CourseRow[]).map(mapCourse);
}

/** Outros cursos do mesmo nível para o bloco "Cursos relacionados" — prioriza
 *  a mesma área de interesse e completa com os demais do nível. */
export async function getRelatedCourses(
  course: Course,
  limit = 4
): Promise<Course[]> {
  const doNivel = (await getCoursesByNivelSlug(course.nivelSlug)).filter(
    (c) => c.slug !== course.slug
  );
  const mesmaArea = doNivel.filter((c) => c.area === course.area);
  const resto = doNivel.filter((c) => c.area !== course.area);
  return [...mesmaArea, ...resto].slice(0, limit);
}
