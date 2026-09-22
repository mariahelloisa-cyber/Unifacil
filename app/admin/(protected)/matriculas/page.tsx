import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, ListCard, PageHeader } from "../AdminUI";
import {
  FAIXAS_RENDA,
  ORIGEM_MATRICULA,
  STATUS_MATRICULA,
  formatarCpf,
  formatarTelefone,
  type FaixaRenda,
  type OrigemMatricula,
  type StatusMatricula,
} from "@/lib/matricula";
import MatriculaControles from "./MatriculaControles";

type MatriculaRow = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  curso_nome: string;
  observacao: string;
  origem: OrigemMatricula;
  renda: FaixaRenda | null;
  status: StatusMatricula;
  created_at: string;
};

const corDoStatus: Record<StatusMatricula, string> = {
  novo: "bg-gold text-navy-950",
  em_contato: "bg-accent-soft text-accent",
  matriculado: "bg-[#dcfce7] text-[#166534]",
  descartado: "bg-surface text-muted",
};

export default async function AdminMatriculasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filtroParam } = await searchParams;
  const filtro = filtroParam && Object.hasOwn(STATUS_MATRICULA, filtroParam) ? (filtroParam as StatusMatricula) : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matriculas")
    .select("id, nome, cpf, email, telefone, curso_nome, observacao, origem, renda, status, created_at")
    .order("created_at", { ascending: false });

  const todas = (data ?? []) as MatriculaRow[];
  const lista = filtro ? todas.filter((m) => m.status === filtro) : todas;

  const abas = [
    { href: "/admin/matriculas", label: "Todas", total: todas.length, ativa: !filtro },
    ...(Object.keys(STATUS_MATRICULA) as StatusMatricula[]).map((s) => ({
      href: `/admin/matriculas?status=${s}`,
      label: STATUS_MATRICULA[s],
      total: todas.filter((m) => m.status === s).length,
      ativa: filtro === s,
    })),
  ];

  return (
    <div>
      <PageHeader
        icon="matriculas"
        title="Matrículas"
        description="Pedidos enviados pelos formulários do site (matrícula, vaga gratuita e simulação de desconto). Mude o status conforme o atendimento avança."
      />

      {error && (
        <p className="mt-5 rounded-xl bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-dark">
          {error.code === "42P01" || error.code === "PGRST205"
            ? "A tabela de matrículas ainda não existe no banco: rode o supabase/schema.sql no SQL Editor do Supabase."
            : `Erro ao carregar as matrículas: ${error.message}`}
        </p>
      )}

      <nav className="mt-6 flex flex-wrap gap-2">
        {abas.map((aba) => (
          <Link
            key={aba.href}
            href={aba.href}
            aria-current={aba.ativa ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
              aba.ativa ? "bg-navy-950 text-white" : "bg-white text-navy-950 ring-1 ring-navy-950/10 hover:bg-surface"
            }`}
          >
            {aba.label} <span className={aba.ativa ? "text-white/60" : "text-muted"}>{aba.total}</span>
          </Link>
        ))}
      </nav>

      <ListCard title={filtro ? STATUS_MATRICULA[filtro] : "Todas as matrículas"}>
        <div className="divide-y divide-navy-950/8">
          {lista.map((m) => (
            <div key={m.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-bold text-navy-950">{m.nome}</p>
                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${corDoStatus[m.status]}`}
                  >
                    {STATUS_MATRICULA[m.status]}
                  </span>
                  <span className="rounded-md bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                    {ORIGEM_MATRICULA[m.origem] ?? ORIGEM_MATRICULA.matricula}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-accent">{m.curso_nome}</p>

                <dl className="mt-2 grid gap-x-6 gap-y-1 text-[13px] text-navy-950 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <dt className="inline text-muted">Telefone: </dt>
                    <dd className="inline">
                      {/* Abre a conversa no WhatsApp com o aluno. */}
                      <a
                        href={`https://wa.me/55${m.telefone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:text-accent"
                      >
                        {formatarTelefone(m.telefone)}
                      </a>
                    </dd>
                  </div>
                  <div className="min-w-0 truncate">
                    <dt className="inline text-muted">E-mail: </dt>
                    <dd className="inline">
                      <a href={`mailto:${m.email}`} className="font-semibold hover:text-accent">
                        {m.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-muted">CPF: </dt>
                    <dd className="inline font-semibold">{formatarCpf(m.cpf)}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted">Enviado em: </dt>
                    <dd className="inline">
                      {new Date(m.created_at).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </dd>
                  </div>
                  {m.renda && (
                    <div className="sm:col-span-2">
                      <dt className="inline text-muted">Renda familiar: </dt>
                      <dd className="inline font-semibold">{FAIXAS_RENDA[m.renda]}</dd>
                    </div>
                  )}
                </dl>

                {m.observacao && (
                  <p className="mt-2 whitespace-pre-line rounded-lg bg-surface px-3 py-2 text-[13px] text-navy-950">
                    {m.observacao}
                  </p>
                )}
              </div>

              <MatriculaControles id={m.id} nome={m.nome} status={m.status} />
            </div>
          ))}
        </div>

        {!error && lista.length === 0 && (
          <EmptyState>
            {filtro ? "Nenhuma matrícula com esse status." : "Nenhuma matrícula recebida ainda."}
          </EmptyState>
        )}
      </ListCard>
    </div>
  );
}
