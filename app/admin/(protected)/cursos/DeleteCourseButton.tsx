"use client";

import { AdminIcon } from "../adminIcons";
import { deleteCourse } from "./actions";

export default function DeleteCourseButton({ id, nome }: { id: string; nome: string }) {
  return (
    <form
      action={deleteCourse}
      onSubmit={(e) => {
        if (!confirm(`Excluir o curso "${nome}"? Essa ação não pode ser desfeita.`)) {
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
