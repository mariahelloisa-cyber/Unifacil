"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Course } from "@/lib/data/courses";
import { duracaoEmMeses } from "@/lib/duracao";
import CourseCard from "./CourseCard";
import SearchInput from "./SearchInput";

const ordenar = (a: string, b: string) => a.localeCompare(b, "pt-BR");

/* Catálogo com filtros: barra lateral (duração, formação e área) à esquerda,
   busca e grade de cards à direita. Sem preço no site, o filtro que seria de
   mensalidade é por duração em meses. Nada marcado = mostra tudo. */
export default function CourseFinder({
  courses,
  titulo = "Escolha o seu curso",
  formacaoInicial,
}: {
  courses: Course[];
  titulo?: string;
  /* Página de uma categoria: já abre com ela marcada em "Formação". */
  formacaoInicial?: string;
}) {
  const formacoes = useMemo(
    () => Array.from(new Set(courses.map((c) => c.nivelNome).filter(Boolean))).sort(ordenar),
    [courses]
  );
  const areas = useMemo(
    () => Array.from(new Set(courses.map((c) => c.area).filter(Boolean))).sort(ordenar),
    [courses]
  );
  const meses = useMemo(() => new Map(courses.map((c) => [c, duracaoEmMeses(c.duracao)])), [courses]);
  const limites = useMemo(() => {
    const valores = [...meses.values()].filter((m): m is number => m !== null);
    if (!valores.length) return null;
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    /* Todos com a mesma duração: abre uma folga para o slider continuar aparecendo. */
    return min === max ? { min: Math.max(1, min - 6), max: max + 6 } : { min, max };
  }, [meses]);

  const [query, setQuery] = useState("");
  const [formacoesMarcadas, setFormacoes] = useState<string[]>(formacaoInicial ? [formacaoInicial] : []);
  const [areasMarcadas, setAreas] = useState<string[]>([]);
  const [faixa, setFaixa] = useState<[number, number] | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  /* A faixa escolhida vale só dentro dos limites atuais (cursos podem mudar). */
  const faixaAtual = useMemo<[number, number] | null>(
    () =>
      limites
        ? [
            Math.max(limites.min, Math.min(faixa?.[0] ?? limites.min, limites.max)),
            Math.min(limites.max, Math.max(faixa?.[1] ?? limites.max, limites.min)),
          ]
        : null,
    [limites, faixa]
  );
  const duracaoFiltrada =
    limites && faixaAtual && (faixaAtual[0] > limites.min || faixaAtual[1] < limites.max);

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (formacoesMarcadas.length && !formacoesMarcadas.includes(c.nivelNome)) return false;
      if (areasMarcadas.length && !areasMarcadas.includes(c.area)) return false;
      const m = meses.get(c);
      if (duracaoFiltrada && faixaAtual && m !== null && m !== undefined && (m < faixaAtual[0] || m > faixaAtual[1]))
        return false;
      return !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q);
    });
  }, [courses, meses, query, formacoesMarcadas, areasMarcadas, duracaoFiltrada, faixaAtual]);

  const alternar = (lista: string[], valor: string) =>
    lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

  const limparTudo = () => {
    setFormacoes([]);
    setAreas([]);
    setFaixa(null);
    setQuery("");
  };

  const chips = [
    ...(duracaoFiltrada && faixaAtual
      ? [{ chave: "duracao", label: `${faixaAtual[0]} a ${faixaAtual[1]} meses`, remover: () => setFaixa(null) }]
      : []),
    ...formacoesMarcadas.map((f) => ({
      chave: `f-${f}`,
      label: f,
      remover: () => setFormacoes((l) => l.filter((v) => v !== f)),
    })),
    ...areasMarcadas.map((a) => ({
      chave: `a-${a}`,
      label: a,
      remover: () => setAreas((l) => l.filter((v) => v !== a)),
    })),
  ];

  return (
    <div className="mx-auto max-w-[1040px]">
      <h2 className="text-[2.25rem] font-extrabold leading-[1.02] tracking-tight text-black lg:text-[52px]">
        {titulo}
      </h2>

      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-[30px]">
        {/* ---------- Filtros ---------- */}
        <aside>
          <div className="flex items-center justify-between">
            {/* No mobile o título abre e fecha os filtros; no desktop eles ficam sempre abertos. */}
            <button
              type="button"
              onClick={() => setFiltrosAbertos((v) => !v)}
              aria-expanded={filtrosAbertos}
              className="flex items-center gap-2.5 text-[20px] font-medium text-black lg:pointer-events-none"
            >
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden>
                <path d="M1 3h9M14 3h5M1 9h3M8 9h11M1 15h11M16 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="3" r="2" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="6" cy="9" r="2" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="14" cy="15" r="2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Filtrar
            </button>
            <button
              type="button"
              onClick={limparTudo}
              className="text-[12px] font-bold text-black transition-opacity hover:opacity-60"
            >
              Limpar tudo
            </button>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip.chave}>
                  <button
                    type="button"
                    onClick={chip.remover}
                    aria-label={`Remover filtro ${chip.label}`}
                    className="flex h-[26px] items-center gap-2 rounded-full bg-gold px-3 text-[11px] font-bold text-navy-950 transition-[filter] hover:brightness-95"
                  >
                    {chip.label}
                    <span aria-hidden className="text-[13px] font-normal leading-none text-navy-950/60">
                      ×
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={`mt-4 border-t border-black/15 ${filtrosAbertos ? "block" : "hidden"} lg:block`}>
            {limites && faixaAtual && (
              <SecaoFiltro titulo="Duração">
                <p className="text-[13px] font-bold text-black">Em quantos meses?</p>
                <p className="mt-3 inline-flex h-[26px] items-center rounded-full bg-[#E9E9E9] px-3 text-[11px] font-bold text-black">
                  {faixaAtual[0] === faixaAtual[1]
                    ? `${faixaAtual[0]} meses`
                    : `${faixaAtual[0]} a ${faixaAtual[1]} meses`}
                </p>
                <FaixaDupla
                  min={limites.min}
                  max={limites.max}
                  valor={faixaAtual}
                  onChange={(v) => setFaixa(v)}
                />
              </SecaoFiltro>
            )}

            {formacoes.length > 0 && (
              <SecaoFiltro titulo="Formação">
                <ul className="space-y-2">
                  {formacoes.map((f) => (
                    <li key={f}>
                      <Caixa
                        label={f}
                        marcada={formacoesMarcadas.includes(f)}
                        onChange={() => setFormacoes((l) => alternar(l, f))}
                      />
                    </li>
                  ))}
                </ul>
              </SecaoFiltro>
            )}

            {areas.length > 0 && (
              <SecaoFiltro titulo="Área de Interesse">
                <ul className="space-y-2">
                  {areas.map((a) => (
                    <li key={a}>
                      <Caixa
                        label={a}
                        marcada={areasMarcadas.includes(a)}
                        onChange={() => setAreas((l) => alternar(l, a))}
                      />
                    </li>
                  ))}
                </ul>
              </SecaoFiltro>
            )}
          </div>
        </aside>

        {/* ---------- Busca + cursos ---------- */}
        <div>
          <div className="flex justify-end">
            <SearchInput value={query} onChange={setQuery} placeholder="Procure o curso ideal para você!" compacta />
          </div>

          {lista.length === 0 ? (
            <p className="py-16 text-center font-semibold text-muted">
              Nenhum curso encontrado com esses filtros.
            </p>
          ) : (
            <div className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((course) => (
                <CourseCard key={`${course.nivelSlug}-${course.slug}`} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Bloco do filtro com título que abre e fecha. */
function SecaoFiltro({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [aberta, setAberta] = useState(true);
  return (
    <section className="border-b border-black/15 py-5">
      <button
        type="button"
        onClick={() => setAberta((v) => !v)}
        aria-expanded={aberta}
        className="flex w-full items-center justify-between text-left text-[20px] font-medium text-black"
      >
        {titulo}
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          aria-hidden
          className={`text-black/50 transition-transform ${aberta ? "" : "rotate-180"}`}
        >
          <path d="m1 6 4.5-4.5L10 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {aberta && <div className="mt-3">{children}</div>}
    </section>
  );
}

/* Checkbox quadrado: borda preta, marcado em amarelo com o check preto. */
function Caixa({ label, marcada, onChange }: { label: string; marcada: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-black">
      <span className="relative flex h-[15px] w-[15px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={marcada}
          onChange={onChange}
          className="peer absolute inset-0 m-0 cursor-pointer appearance-none rounded-[2px] border-[1.5px] border-black bg-white checked:bg-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <svg
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          aria-hidden
          className="pointer-events-none relative hidden text-black peer-checked:block"
        >
          <path d="m1 4 2.8 2.8L9 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label}
    </label>
  );
}

/* Slider de duas pontas (mínimo e máximo): dois <input type="range">
   sobrepostos numa linha preta; as bolinhas são estilizadas em .faixa-range
   no globals.css. */
function FaixaDupla({
  min,
  max,
  valor,
  onChange,
}: {
  min: number;
  max: number;
  valor: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  if (min === max) return null;
  return (
    <div className="relative mt-5 h-[14px]">
      <span aria-hidden className="absolute inset-x-[7px] top-1/2 h-[2px] -translate-y-1/2 bg-black" />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={valor[0]}
        onChange={(e) => onChange([Math.min(Number(e.target.value), valor[1]), valor[1]])}
        aria-label="Duração mínima em meses"
        className="faixa-range absolute inset-0 w-full"
        /* Encostada no fim, a bolinha do mínimo fica por cima — senão a do
           máximo a cobriria e ela não voltaria mais. */
        style={{ zIndex: valor[0] > min + (max - min) / 2 ? 2 : 1 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={valor[1]}
        onChange={(e) => onChange([valor[0], Math.max(Number(e.target.value), valor[0])])}
        aria-label="Duração máxima em meses"
        className="faixa-range absolute inset-0 w-full"
      />
    </div>
  );
}
