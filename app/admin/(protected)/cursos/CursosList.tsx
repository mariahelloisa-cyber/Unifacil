"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AdminIcon } from "../adminIcons";
import { Chip, EditIconLink, EmptyState } from "../AdminUI";
import DeleteCourseButton from "./DeleteCourseButton";

export type CursoListItem = {
  id: string;
  nome: string;
  area: string;
  duracao: string;
  capaUrl: string;
  destaqueHome: boolean;
  nivelNome: string;
};

export default function CursosList({
  cursos,
  niveis,
}: {
  cursos: CursoListItem[];
  niveis: string[];
}) {
  const [query, setQuery] = useState("");
  const [nivel, setNivel] = useState("todos");

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cursos
      .filter((c) => nivel === "todos" || c.nivelNome === nivel)
      .filter((c) => !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q));
  }, [cursos, query, nivel]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar por nome</span>
          <AdminIcon
            name="busca"
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full rounded-xl border border-navy-950/12 bg-surface py-3 pl-11 pr-4 text-sm text-navy-950 outline-none transition-colors placeholder:text-muted focus:border-accent focus:bg-white"
          />
        </label>
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          aria-label="Filtrar por nível"
          className="rounded-xl border border-navy-950/12 bg-surface px-4 py-3 text-sm font-semibold text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white sm:w-56"
        >
          <option value="todos">Todos os níveis</option>
          {niveis.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 divide-y divide-navy-950/8">
        {filtrados.map((curso) => (
          <div key={curso.id} className="flex items-center gap-4 py-3.5">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
              {curso.capaUrl && <Image src={curso.capaUrl} alt="" fill className="object-cover" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-navy-950">{curso.nome}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Chip cor="azul">{curso.nivelNome || "sem nível"}</Chip>
                <Chip cor="amarelo">{curso.area}</Chip>
                {curso.destaqueHome && <Chip cor="cinza">Destaque</Chip>}
                <span className="text-xs text-muted">
                  {curso.duracao}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <EditIconLink href={`/admin/cursos/${curso.id}`} label={`Editar ${curso.nome}`} />
              <DeleteCourseButton id={curso.id} nome={curso.nome} />
            </div>
          </div>
        ))}
      </div>

      {filtrados.length === 0 && (
        <EmptyState>
          {cursos.length === 0
            ? "Nenhum curso cadastrado ainda."
            : "Nenhum curso encontrado com esse filtro."}
        </EmptyState>
      )}
    </>
  );
}
