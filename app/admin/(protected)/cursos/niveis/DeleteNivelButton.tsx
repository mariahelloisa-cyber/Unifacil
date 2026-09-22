"use client";

import { AdminIcon } from "../../adminIcons";
import { deleteNivel } from "./actions";

export default function DeleteNivelButton({ id, nome }: { id: string; nome: string }) {
  return (
    <form
      action={deleteNivel}
      onSubmit={(e) => {
        if (
          !confirm(
            `Excluir a categoria "${nome}"? A página dele sai do ar e some do menu. Só é possível se não houver cursos nesse nível.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Excluir ${nome}`}
        title="Excluir"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-rose text-white transition-colors hover:bg-rose-dark"
      >
        <AdminIcon name="excluir" size={16} />
      </button>
    </form>
  );
}
