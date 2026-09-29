"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Course } from "@/lib/data/courses";
import { cargaHorariaEmHoras, formatarHoras } from "@/lib/cargaHoraria";
import CourseCard from "./CourseCard";
import SearchInput from "./SearchInput";

const ordenar = (a: string, b: string) => a.localeCompare(b, "pt-BR");

const POR_PAGINA = 15;

/* As cargas horárias costumam ser de 10 em 10 horas; o slider anda no mesmo passo. */
const PASSO_HORAS = 10;

const textoFaixa = ([de, ate]: [number, number]) =>
  de === ate ? `${formatarHoras(de)} horas` : `${formatarHoras(de)} a ${formatarHoras(ate)} horas`;

/* Catálogo com filtros: barra lateral (carga horária, formação e área) à
   esquerda, busca e grade de cards à direita. Sem preço no site, o filtro que
   seria de mensalidade é por carga horária. Nada marcado = mostra tudo. */
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
  const horas = useMemo(() => new Map(courses.map((c) => [c, cargaHorariaEmHoras(c.cargaHoraria)])), [courses]);

  const [query, setQuery] = useState("");
  const [formacoesMarcadas, setFormacoes] = useState<string[]>(formacaoInicial ? [formacaoInicial] : []);
  const [areasMarcadas, setAreas] = useState<string[]>([]);
  /* A faixa guarda os limites em que foi escolhida: se a formação ou a área
     mudar os limites, ela deixa de valer e o slider volta a ocupar tudo. */
  const [faixa, setFaixa] = useState<{ valor: [number, number]; limites: string } | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  /* Cursos da formação e da área marcadas: deles saem o mínimo e o máximo
     de horas do slider. */
  const base = useMemo(
    () =>
      courses.filter(
        (c) =>
          (!formacoesMarcadas.length || formacoesMarcadas.includes(c.nivelNome)) &&
          (!areasMarcadas.length || areasMarcadas.includes(c.area))
      ),
    [courses, formacoesMarcadas, areasMarcadas]
  );
  const limites = useMemo(() => {
    const valores = base.map((c) => horas.get(c)).filter((h): h is number => h != null);
    return valores.length ? { min: Math.min(...valores), max: Math.max(...valores) } : null;
  }, [base, horas]);
  const chaveLimites = limites ? `${limites.min}-${limites.max}` : "";

  /* ?formacao=todas (botão "Encontre seu curso" da home) abre com todas as
     formações marcadas. Lido depois de montar para a página continuar estática. */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("formacao") === "todas") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- parâmetro da URL só existe no cliente
      setFormacoes(formacoes);
    }
  }, [formacoes]);

  const faixaAtual = useMemo<[number, number] | null>(
    () => (limites ? (faixa?.limites === chaveLimites ? faixa.valor : [limites.min, limites.max]) : null),
    [limites, faixa, chaveLimites]
  );
  const horasFiltradas =
    limites && faixaAtual && (faixaAtual[0] > limites.min || faixaAtual[1] < limites.max);
  /* Passo de 10 horas quando o intervalo permite chegar exatamente ao máximo. */
  const passo = limites && (limites.max - limites.min) % PASSO_HORAS === 0 ? PASSO_HORAS : 1;

  const lista = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((c) => {
      const h = horas.get(c);
      if (horasFiltradas && faixaAtual && h != null && (h < faixaAtual[0] || h > faixaAtual[1])) return false;
      return !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q);
    });
  }, [base, horas, query, horasFiltradas, faixaAtual]);

  /* 15 cursos por página. Como a faixa, a página guarda os filtros em que foi
     aberta: mudou o filtro ou a busca, volta para a primeira. */
  const chaveFiltros = [query, formacoesMarcadas.join("|"), areasMarcadas.join("|"), faixaAtual?.join("-")].join("#");
  const [pagina, setPagina] = useState({ chave: "", numero: 1 });
  const totalPaginas = Math.ceil(lista.length / POR_PAGINA);
  const paginaAtual = pagina.chave === chaveFiltros ? Math.min(pagina.numero, totalPaginas) : 1;
  const topoDaLista = useRef<HTMLDivElement>(null);

  const irParaPagina = (numero: number) => {
    setPagina({ chave: chaveFiltros, numero });
    topoDaLista.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const alternar = (lista: string[], valor: string) =>
    lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

  const limparTudo = () => {
    setFormacoes([]);
    setAreas([]);
    setFaixa(null);
    setQuery("");
  };

  const chips = [
    ...(horasFiltradas && faixaAtual
      ? [{ chave: "horas", label: textoFaixa(faixaAtual), remover: () => setFaixa(null) }]
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
              <SecaoFiltro titulo="Carga horária">
                <p className="text-[13px] font-bold text-black">Quantas horas?</p>
                <p className="mt-3 inline-flex h-[26px] items-center rounded-full bg-[#E9E9E9] px-3 text-[11px] font-bold text-black">
                  {textoFaixa(faixaAtual)}
                </p>
                <FaixaDupla
                  min={limites.min}
                  max={limites.max}
                  passo={passo}
                  valor={faixaAtual}
                  onChange={(v) => setFaixa({ valor: v, limites: chaveLimites })}
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
        {/* Ao trocar de página a tela sobe até aqui, descontando o cabeçalho fixo. */}
        <div ref={topoDaLista} className="scroll-mt-[122px] lg:scroll-mt-[130px]">
          <div className="flex justify-end">
            <SearchInput value={query} onChange={setQuery} placeholder="Procure o curso ideal para você!" compacta />
          </div>

          {lista.length === 0 ? (
            <p className="py-16 text-center font-semibold text-muted">
              Nenhum curso encontrado com esses filtros.
            </p>
          ) : (
            <>
              <div className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA).map((course) => (
                  <CourseCard key={`${course.nivelSlug}-${course.slug}`} course={course} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <Paginacao atual={paginaAtual} total={totalPaginas} onChange={irParaPagina} />
              )}
            </>
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

/* Números das páginas: sempre a primeira, a última e as vizinhas da atual;
   o resto vira "…" para caber no celular. */
function paginasVisiveis(atual: number, total: number): (number | "…")[] {
  const numeros = [...new Set([1, atual - 1, atual, atual + 1, total])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  return numeros.flatMap((n, i) => (i > 0 && n - numeros[i - 1] > 1 ? ["…" as const, n] : [n]));
}

function Paginacao({ atual, total, onChange }: { atual: number; total: number; onChange: (n: number) => void }) {
  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-[14px] font-bold transition-[filter,opacity]";
  const seta = `${base} bg-[#E9E9E9] text-black hover:brightness-95 disabled:pointer-events-none disabled:opacity-40`;
  return (
    <nav aria-label="Páginas de cursos" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={() => onChange(atual - 1)} disabled={atual === 1} aria-label="Página anterior" className={seta}>
        ‹
      </button>
      {paginasVisiveis(atual, total).map((n, i) =>
        n === "…" ? (
          <span key={`reticencias-${i}`} aria-hidden className="px-1 text-[14px] font-bold text-black/50">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === atual ? "page" : undefined}
            aria-label={`Página ${n}`}
            className={`${base} ${n === atual ? "bg-gold text-navy-950" : "bg-[#E9E9E9] text-black hover:brightness-95"}`}
          >
            {n}
          </button>
        )
      )}
      <button type="button" onClick={() => onChange(atual + 1)} disabled={atual === total} aria-label="Próxima página" className={seta}>
        ›
      </button>
    </nav>
  );
}

/* Slider de duas pontas (mínimo e máximo): dois <input type="range">
   sobrepostos numa linha preta; as bolinhas são estilizadas em .faixa-range
   no globals.css. */
function FaixaDupla({
  min,
  max,
  passo,
  valor,
  onChange,
}: {
  min: number;
  max: number;
  passo: number;
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
        step={passo}
        value={valor[0]}
        onChange={(e) => onChange([Math.min(Number(e.target.value), valor[1]), valor[1]])}
        aria-label="Carga horária mínima em horas"
        className="faixa-range absolute inset-0 w-full"
        /* Encostada no fim, a bolinha do mínimo fica por cima — senão a do
           máximo a cobriria e ela não voltaria mais. */
        style={{ zIndex: valor[0] > min + (max - min) / 2 ? 2 : 1 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor[1]}
        onChange={(e) => onChange([valor[0], Math.max(Number(e.target.value), valor[0])])}
        aria-label="Carga horária máxima em horas"
        className="faixa-range absolute inset-0 w-full"
      />
    </div>
  );
}
