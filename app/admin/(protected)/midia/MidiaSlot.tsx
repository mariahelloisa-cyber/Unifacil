"use client";

import { useActionState, useState } from "react";
import UploadField from "../UploadField";
import { clearSiteMedia, updateSiteMedia, type MidiaFormState } from "./actions";

export default function MidiaSlot({
  chave,
  tipo,
  url,
  dica,
  titulo = "Mídia atual",
  previewAspect,
  className = "mt-6 max-w-3xl",
}: {
  chave: string;
  tipo: "imagem" | "video";
  url: string;
  dica: string;
  titulo?: string;
  previewAspect?: string;
  className?: string;
}) {
  const action = updateSiteMedia.bind(null, chave, tipo);
  const [state, formAction, pending] = useActionState<MidiaFormState, FormData>(action, undefined);
  const [uploading, setUploading] = useState(false);

  return (
    <div className={`${className} rounded-2xl bg-white p-5 ring-1 ring-navy-950/5 sm:p-6`}>
      <form action={formAction}>
        <UploadField
          name="url"
          folder="site"
          tipo={tipo}
          currentUrl={url}
          label={titulo}
          hint={dica}
          previewAspect={previewAspect}
          onUploadingChange={setUploading}
        />

        <button
          type="submit"
          disabled={pending || uploading}
          className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
      </form>

      {url && (
        <form action={clearSiteMedia} className="mt-3">
          <input type="hidden" name="chave" value={chave} />
          <button type="submit" className="text-sm font-semibold text-rose-dark hover:underline">
            Remover mídia atual
          </button>
        </form>
      )}

      {state?.error && <p className="mt-3 text-sm font-semibold text-rose-dark">{state.error}</p>}
      {state?.ok && <p className="mt-3 text-sm font-semibold text-accent">{state.ok}</p>}
    </div>
  );
}
