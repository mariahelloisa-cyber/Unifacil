"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AREAS } from "@/lib/areas";
import UploadField from "../UploadField";
import type { CourseNivel } from "@/lib/data/courses";
import type { CourseFormState } from "./actions";

type CourseFormValues = {
  nome: string;
  nivelId: string;
  area: string;
  duracao: string;
  capaUrl: string;
  /* Texto de "Modalidade" no "Sobre o curso" (guardado na coluna descricao). */
  descricao: string;
  inicio: string;
  cargaHoraria: string;
  avaliacao: string;
  destaqueHome: boolean;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white";

export default function CourseForm({
  action,
  niveis,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  niveis: CourseNivel[];
  defaultValues?: CourseFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [uploading, setUploading] = useState(false);

  // Se um curso antigo tiver uma área fora da lista (digitada errada antes),
  // ela continua aparecendo para não sumir sozinha — mas dá pra corrigir aqui.
  const areasDisponiveis = Array.from(
    new Set([...AREAS, ...(defaultValues?.area ? [defaultValues.area] : [])])
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <label htmlFor="nome" className="text-sm font-semibold text-navy-950">
            Nome do curso
          </label>
          <input id="nome" name="nome" required defaultValue={defaultValues?.nome} className={inputClass} />
        </div>

        <div>
          <label htmlFor="nivel_id" className="text-sm font-semibold text-navy-950">
            Nível
          </label>
          <select
            id="nivel_id"
            name="nivel_id"
            required
            defaultValue={defaultValues?.nivelId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Selecione o nível
            </option>
            {niveis.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="area" className="text-sm font-semibold text-navy-950">
            Área
          </label>
          <select
            id="area"
            name="area"
            required
            defaultValue={defaultValues?.area ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Selecione a área
            </option>
            {areasDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">Define o ícone do filtro “Área de interesse” no site.</p>
        </div>

      </div>

      {/* ---- "Sobre o curso" da página do curso ---- */}
      <div className="border-t border-navy-950/10 pt-6">
        <h2 className="text-base font-bold text-navy-950">Página do curso</h2>
        <p className="mt-1 text-xs text-muted">
          Duração e carga horária aparecem nas caixas roxas; o resto, em &quot;Sobre o curso&quot;. Campo vazio não aparece.
        </p>
      </div>

      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <label htmlFor="duracao" className="text-sm font-semibold text-navy-950">
            Duração
          </label>
          <input
            id="duracao"
            name="duracao"
            required
            placeholder="6 a 12 meses"
            defaultValue={defaultValues?.duracao}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="carga_horaria" className="text-sm font-semibold text-navy-950">
            Carga horária
          </label>
          <input
            id="carga_horaria"
            name="carga_horaria"
            placeholder="1210 horas (Compostas por Módulos I ao II + TCC)"
            defaultValue={defaultValues?.cargaHoraria}
            className={inputClass}
          />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="descricao" className="text-sm font-semibold text-navy-950">
            Modalidade
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            placeholder="O curso é ministrado 100% na modalidade EAD, ou seja, totalmente à Distância…"
            defaultValue={defaultValues?.descricao}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="inicio" className="text-sm font-semibold text-navy-950">
            Início do curso
          </label>
          <input
            id="inicio"
            name="inicio"
            placeholder="Imediato"
            defaultValue={defaultValues?.inicio}
            className={inputClass}
          />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="avaliacao" className="text-sm font-semibold text-navy-950">
            Avaliação e certificação
          </label>
          <textarea
            id="avaliacao"
            name="avaliacao"
            rows={3}
            placeholder="Será conferido certificado de conclusão aos alunos que cumprirem…"
            defaultValue={defaultValues?.avaliacao}
            className={inputClass}
          />
        </div>
      </div>

      <UploadField
        name="capa_url"
        folder="cursos"
        tipo="imagem"
        currentUrl={defaultValues?.capaUrl}
        label="Capa do curso"
        hint="Aparece no card do curso e no topo da página dele."
        onUploadingChange={setUploading}
      />

      <label className="flex items-center gap-3 rounded-lg bg-white px-4 py-3">
        <input
          type="checkbox"
          name="destaque_home"
          defaultChecked={defaultValues?.destaqueHome}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
        <span className="text-sm font-semibold text-navy-950">
          Mostrar em &quot;Cursos mais procurados&quot; na home
        </span>
      </label>

      {state?.error && <p className="text-sm font-semibold text-rose-dark">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link
          href="/admin/cursos"
          className="rounded-full border-2 border-navy-950/15 px-6 py-3 text-sm font-bold text-navy-950 transition-colors hover:bg-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
