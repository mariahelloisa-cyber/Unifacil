"use client";

import { AdminIcon } from "../adminIcons";
import { STATUS_MATRICULA, type StatusMatricula } from "@/lib/matricula";
import { atualizarStatus, excluirMatricula } from "./actions";

/* Status (salva ao escolher) e excluir, na linha de cada matrícula. */
export default function MatriculaControles({
  id,
  nome,
  status,
}: {
  id: string;
  nome: string;
  status: StatusMatricula;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <form action={atualizarStatus}>
        <input type="hidden" name="id" value={id} />
        <select
          name="status"
          defaultValue={status}
          aria-label={`Status de ${nome}`}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="h-9 rounded-full border border-navy-950/12 bg-surface px-3.5 text-[13px] font-bold text-navy-950 outline-none focus:border-accent"
        >
          {Object.entries(STATUS_MATRICULA).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>
      </form>

      <form
        action={excluirMatricula}
        onSubmit={(e) => {
          if (!confirm(`Excluir a matrícula de "${nome}"? Isso não pode ser desfeito.`)) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          aria-label={`Excluir matrícula de ${nome}`}
          title="Excluir"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-rose text-white transition-colors hover:bg-rose-dark"
        >
          <AdminIcon name="excluir" size={16} />
        </button>
      </form>
    </div>
  );
}
