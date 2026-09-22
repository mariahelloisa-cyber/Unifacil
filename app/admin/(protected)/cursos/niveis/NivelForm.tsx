"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import UploadField from "../../UploadField";
import type { NivelFormState } from "./actions";

type NivelFormValues = {
  nome: string;
  slug: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  ordem: number;
  destaqueHome: boolean;
};

export default function NivelForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: NivelFormState, formData: FormData) => Promise<NivelFormState>;
  defaultValues?: NivelFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const [uploading, setUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="nome" className="text-sm font-semibold text-navy-950">
          Nome (exibido no menu do site)
        </label>
        <input
          id="nome"
          name="nome"
          required
          defaultValue={defaultValues?.nome}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-semibold text-navy-950">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
        <p className="mt-1 text-xs text-muted">
          Página do site em: /{slug || "..."} — mudar isso troca a URL dessa seção.
        </p>
      </div>

      <div>
        <label htmlFor="titulo" className="text-sm font-semibold text-navy-950">
          Título do hero
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          defaultValue={defaultValues?.titulo}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="text-sm font-semibold text-navy-950">
          Descrição do hero
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          defaultValue={defaultValues?.descricao}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <div>
        <label htmlFor="ordem" className="text-sm font-semibold text-navy-950">
          Ordem no menu
        </label>
        <input
          id="ordem"
          name="ordem"
          type="number"
          defaultValue={defaultValues?.ordem ?? 0}
          className="mt-1.5 w-32 rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <UploadField
        name="imagem_url"
        folder="niveis"
        tipo="imagem"
        currentUrl={defaultValues?.imagemUrl}
        label="Foto da categoria"
        hint="Aparece no card da home ('Escolha por categoria', formato quadrado) e no topo da página dessa categoria."
        onUploadingChange={setUploading}
      />

      <label className="flex items-center gap-3 rounded-lg bg-white px-4 py-3">
        <input
          type="checkbox"
          name="destaque_home"
          defaultChecked={defaultValues?.destaqueHome ?? true}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
        <span className="text-sm font-semibold text-navy-950">
          Mostrar em &quot;Escolha por categoria&quot; na home
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
          href="/admin/cursos/niveis"
          className="rounded-full border-2 border-navy-950/15 px-6 py-3 text-sm font-bold text-navy-950 transition-colors hover:bg-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
