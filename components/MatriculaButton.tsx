"use client";

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { enviarMatricula, type MatriculaFormState } from "@/app/matricula/actions";
import { FAIXAS_RENDA, formatarCpf, formatarTelefone, type OrigemMatricula } from "@/lib/matricula";

export type CursoOpcao = { id: string; nome: string; nivel?: string };

/* O mesmo formulário serve três botões; muda só o texto (e a vaga gratuita
   pede também a renda, que é o critério de elegibilidade). A origem vai
   junto para o admin saber de onde veio o pedido. */
const TEXTOS: Record<
  OrigemMatricula,
  { rotulo: string; titulo: string; texto: string; enviar: string; okTitulo: string; okTexto: string }
> = {
  matricula: {
    rotulo: "Matrícula",
    titulo: "Garanta sua vaga",
    texto: "Preencha seus dados e um consultor entra em contato para finalizar sua matrícula.",
    enviar: "Enviar matrícula",
    okTitulo: "Recebemos sua matrícula!",
    okTexto: "Um consultor vai entrar em contato pelo telefone ou e-mail informado para finalizar tudo com você.",
  },
  vaga_gratuita: {
    rotulo: "Bolsa de 100%",
    titulo: "Simule sua bolsa de 100%",
    texto: "Preencha seus dados e a sua renda. Um consultor verifica sua elegibilidade para a bolsa de 100% no curso escolhido.",
    enviar: "Simular minha bolsa de 100%",
    okTitulo: "Recebemos sua simulação!",
    okTexto: "Um consultor vai entrar em contato pelo telefone ou e-mail informado para falar sobre a sua bolsa de 100%.",
  },
  simulacao: {
    rotulo: "Desconto",
    titulo: "Quero meu desconto",
    texto: "Preencha seus dados e um consultor entra em contato com o desconto do curso escolhido.",
    enviar: "Enviar pedido",
    okTitulo: "Recebemos seu pedido!",
    okTexto: "Um consultor vai entrar em contato pelo telefone ou e-mail informado com o valor do seu desconto.",
  },
};

/* Botão "Matricule-se": abre o formulário de matrícula num <dialog>. Na página
   do curso ele já vem com o curso escolhido (`curso`); fora dela, o aluno
   escolhe numa lista (`cursos`). */
export default function MatriculaButton({
  curso,
  cursos = [],
  modo = "matricula",
  className,
  children,
  tabIndex,
}: {
  curso?: CursoOpcao;
  cursos?: CursoOpcao[];
  modo?: OrigemMatricula;
  className?: string;
  children: ReactNode;
  tabIndex?: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  /* Trocar a key remonta o formulário: depois de um envio, abrir de novo
     começa em branco. */
  const [rodada, setRodada] = useState(0);
  const [enviado, setEnviado] = useState(false);

  const abrir = () => {
    if (enviado) {
      setEnviado(false);
      setRodada((r) => r + 1);
    }
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  const fechar = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={abrir} className={className} tabIndex={tabIndex}>
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Formulário: ${TEXTOS[modo].titulo}`}
        onClose={() => (document.documentElement.style.overflow = "")}
        /* Clique no fundo escuro (fora do painel) fecha. */
        onClick={(e) => e.target === e.currentTarget && fechar()}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(560px,calc(100%-2rem))] overflow-y-auto rounded-[28px] bg-white p-0 text-left text-navy-950 shadow-[0_24px_80px_rgba(31,15,43,0.35)] backdrop:bg-navy-950/65 backdrop:backdrop-blur-[2px]"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-navy-950/60 transition-colors hover:bg-surface hover:text-navy-950"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {enviado ? (
            <Sucesso modo={modo} onFechar={fechar} />
          ) : (
            <MatriculaForm
              key={rodada}
              modo={modo}
              curso={curso}
              cursos={cursos}
              onEnviado={() => setEnviado(true)}
            />
          )}
        </div>
      </dialog>
    </>
  );
}

/* O mesmo formulário direto na página (/inscricao), sem o <dialog>. O modo
   vem da URL (?modo=simulacao) — assim o rodapé linka direto para cada um. */
export function MatriculaInline({
  cursos,
  modo = "matricula",
}: {
  cursos: CursoOpcao[];
  modo?: OrigemMatricula;
}) {
  const [enviado, setEnviado] = useState(false);
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_60px_rgba(31,15,43,0.10)] ring-1 ring-navy-950/5 sm:p-8">
      {enviado ? (
        <Sucesso modo={modo} />
      ) : (
        <MatriculaForm modo={modo} cursos={cursos} onEnviado={() => setEnviado(true)} semTitulo />
      )}
    </div>
  );
}

function MatriculaForm({
  modo,
  curso,
  cursos,
  onEnviado,
  semTitulo = false,
}: {
  modo: OrigemMatricula;
  curso?: CursoOpcao;
  cursos: CursoOpcao[];
  onEnviado: () => void;
  /* Na página a chamada já está no hero. */
  semTitulo?: boolean;
}) {
  const [state, formAction, pending] = useActionState<MatriculaFormState, FormData>(enviarMatricula, undefined);
  const [valores, setValores] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    curso_id: curso?.id ?? "",
    renda: "",
    observacao: "",
  });
  const textos = TEXTOS[modo];
  const id = useId();

  useEffect(() => {
    if (state?.ok) onEnviado();
  }, [state, onEnviado]);

  const erros = state && !state.ok ? state.campos ?? {} : {};
  const set = (campo: keyof typeof valores, valor: string) => setValores((v) => ({ ...v, [campo]: valor }));

  /* Lista agrupada por categoria para o <select>. */
  const grupos = new Map<string, CursoOpcao[]>();
  for (const c of cursos) {
    const chave = c.nivel || "Cursos";
    grupos.set(chave, [...(grupos.get(chave) ?? []), c]);
  }

  return (
    <form action={formAction} noValidate>
      {!semTitulo && (
        <>
          <p className="text-[12px] font-bold uppercase tracking-wider text-accent">{textos.rotulo}</p>
          <h2 className="mt-1.5 pr-10 font-display text-[26px] font-extrabold leading-tight tracking-tight sm:text-[30px]">
            {textos.titulo}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{textos.texto}</p>
        </>
      )}

      <input type="hidden" name="origem" value={modo} />

      <div className={`grid gap-4 ${semTitulo ? "" : "mt-6"}`}>
        <Campo id={`${id}-nome`} label="Nome completo" erro={erros.nome}>
          <input
            id={`${id}-nome`}
            name="nome"
            autoComplete="name"
            required
            maxLength={150}
            value={valores.nome}
            onChange={(e) => set("nome", e.target.value)}
            className={inputClass(erros.nome)}
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id={`${id}-cpf`} label="CPF" erro={erros.cpf}>
            <input
              id={`${id}-cpf`}
              name="cpf"
              inputMode="numeric"
              required
              placeholder="000.000.000-00"
              value={valores.cpf}
              onChange={(e) => set("cpf", formatarCpf(e.target.value))}
              className={inputClass(erros.cpf)}
            />
          </Campo>
          <Campo id={`${id}-telefone`} label="Telefone / WhatsApp" erro={erros.telefone}>
            <input
              id={`${id}-telefone`}
              name="telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              placeholder="(00) 00000-0000"
              value={valores.telefone}
              onChange={(e) => set("telefone", formatarTelefone(e.target.value))}
              className={inputClass(erros.telefone)}
            />
          </Campo>
        </div>

        <Campo id={`${id}-email`} label="E-mail" erro={erros.email}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            value={valores.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass(erros.email)}
          />
        </Campo>

        <Campo id={`${id}-curso`} label="Curso desejado" erro={erros.curso}>
          {curso ? (
            <>
              <input type="hidden" name="curso_id" value={curso.id} />
              <p
                id={`${id}-curso`}
                className="rounded-2xl bg-surface px-4 py-3.5 text-[15px] font-semibold text-navy-950"
              >
                {curso.nome}
                {curso.nivel && <span className="font-normal text-muted"> · {curso.nivel}</span>}
              </p>
            </>
          ) : (
            <div className="relative">
              <select
                id={`${id}-curso`}
                name="curso_id"
                required
                value={valores.curso_id}
                onChange={(e) => set("curso_id", e.target.value)}
                className={`${inputClass(erros.curso)} appearance-none pr-11`}
              >
                <option value="" disabled>
                  Selecione um curso
                </option>
                {[...grupos].map(([nivel, lista]) => (
                  <optgroup key={nivel} label={nivel}>
                    {lista.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <Seta />
            </div>
          )}
        </Campo>

        {modo === "vaga_gratuita" && (
          <Campo id={`${id}-renda`} label="Renda familiar mensal" erro={erros.renda}>
            <div className="relative">
              <select
                id={`${id}-renda`}
                name="renda"
                required
                aria-describedby={`${id}-renda-ajuda`}
                value={valores.renda}
                onChange={(e) => set("renda", e.target.value)}
                className={`${inputClass(erros.renda)} appearance-none pr-11`}
              >
                <option value="" disabled>
                  Selecione a faixa
                </option>
                {Object.entries(FAIXAS_RENDA).map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
              <Seta />
            </div>
            {/* O critério do programa; as faixas param no mesmo corte. */}
            <p id={`${id}-renda-ajuda`} className="mt-1.5 text-[13px] leading-snug text-muted">
              A bolsa de 100% é para famílias com renda de até 4 salários mínimos.
            </p>
          </Campo>
        )}

        <Campo id={`${id}-obs`} label="Observação" opcional erro={erros.observacao}>
          <textarea
            id={`${id}-obs`}
            name="observacao"
            rows={3}
            maxLength={1000}
            placeholder="Melhor horário para contato, dúvidas…"
            value={valores.observacao}
            onChange={(e) => set("observacao", e.target.value)}
            className={`${inputClass(erros.observacao)} resize-y`}
          />
        </Campo>

        {/* Armadilha para robôs — escondida de quem usa o site. */}
        <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </div>

      {state && !state.ok && state.error && (
        <p role="alert" className="mt-4 rounded-xl bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-dark">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex h-[54px] w-full items-center justify-center gap-3 rounded-full bg-gold font-bold uppercase text-navy-950 transition-[filter] hover:brightness-95 disabled:opacity-60"
      >
        {pending ? "Enviando…" : textos.enviar}
      </button>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-muted">
        {modo === "vaga_gratuita"
          ? "Usamos seus dados, inclusive a renda, só para verificar sua elegibilidade e entrar em contato."
          : "Usamos seus dados só para entrar em contato sobre a sua matrícula."}
      </p>
    </form>
  );
}

function Sucesso({ modo, onFechar }: { modo: OrigemMatricula; onFechar?: () => void }) {
  const textos = TEXTOS[modo];
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy-950">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-5 font-display text-[26px] font-extrabold leading-tight tracking-tight">
        {textos.okTitulo}
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">{textos.okTexto}</p>
      {onFechar && (
        <button
          type="button"
          onClick={onFechar}
          className="mt-7 inline-flex h-[50px] items-center justify-center rounded-full bg-navy-950 px-8 font-bold text-white transition-colors hover:bg-navy-800"
        >
          Fechar
        </button>
      )}
    </div>
  );
}

function Campo({
  id,
  label,
  opcional,
  erro,
  children,
}: {
  id: string;
  label: string;
  opcional?: boolean;
  erro?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-bold text-navy-950">
        {label}
        {opcional && <span className="ml-1.5 font-normal text-muted">(opcional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {erro && <p className="mt-1.5 text-[13px] font-semibold text-rose-dark">{erro}</p>}
    </div>
  );
}

function Seta() {
  return (
    <svg
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy-950/60"
    >
      <path d="m1 1.5 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const inputClass = (erro?: string) =>
  `w-full rounded-2xl border bg-white px-4 py-3.5 text-[15px] text-navy-950 outline-none transition-colors placeholder:text-navy-950/35 focus:border-accent focus:ring-4 focus:ring-accent/15 ${
    erro ? "border-rose-dark" : "border-navy-950/15"
  }`;
