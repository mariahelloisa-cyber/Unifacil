import { PageHeader } from "../../../AdminUI";
import NivelForm from "../NivelForm";
import { createNivel } from "../actions";

export default function NovoNivelPage() {
  return (
    <div>
      <PageHeader
        icon="niveis"
        title="Nova categoria de curso"
        description="Ele vira uma página do site e entra no menu automaticamente."
      />
      <div className="mt-6 max-w-3xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <NivelForm action={createNivel} submitLabel="Criar nível" />
      </div>
    </div>
  );
}
