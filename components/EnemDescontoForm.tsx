"use client";

import { useMemo, useState } from "react";
import type { Course, CourseNivel } from "@/lib/data/courses";
import { SITE } from "@/lib/constants";

const NOTA_MAXIMA = 1000;

function IconeCapelo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 9.2 12 5l9 4.2-9 4.2-9-4.2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M7 11.6V16c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function IconeWhatsapp({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.9 9.9 0 0 0 4.88 1.27h.01c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 19.1 4.9 9.9 9.9 0 0 0 12.04 2Zm0 1.83c2.17 0 4.21.85 5.75 2.38a8.1 8.1 0 0 1 2.38 5.76c0 4.49-3.65 8.13-8.14 8.13a8.2 8.2 0 0 1-4.15-1.13l-.3-.18-3.06.8.82-2.99-.2-.31a8.1 8.1 0 0 1-1.25-4.33c0-4.49 3.65-8.13 8.15-8.13Zm-2.4 4.2c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.2.87 2.35.99 2.51.12.16 1.7 2.6 4.13 3.64.58.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.31-.74-1.79-.19-.45-.39-.39-.53-.4h-.46Z" />
    </svg>
  );
}

export default function EnemDescontoForm({
  niveis,
  cursos,
}: {
  niveis: CourseNivel[];
  cursos: Course[];
}) {
  const [nivelSlug, setNivelSlug] = useState(niveis[0]?.slug ?? "");
  const [cursoSlug, setCursoSlug] = useState("");
  const [nota, setNota] = useState(720);
  const [enviado, setEnviado] = useState(false);

  const nivel = niveis.find((n) => n.slug === nivelSlug) ?? niveis[0];
  const cursosDoNivel = useMemo(
    () => cursos.filter((c) => c.nivelSlug === nivel?.slug),
    [cursos, nivel]
  );

  function handleNivelChange(slug: string) {
    setNivelSlug(slug);
    setCursoSlug("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const nome = String(dados.get("nome") ?? "");
    const whatsapp = String(dados.get("whatsapp") ?? "");
    const curso = cursosDoNivel.find((c) => c.slug === cursoSlug);

    const mensagem = [
      "Olá! Quero usar minha nota do ENEM para conseguir desconto na Universidade Fácil.",
      `Nome: ${nome}`,
      `Curso: ${curso ? curso.nome : "-"} (${nivel?.nome ?? "-"})`,
      `Minha nota do ENEM: ${nota}`,
      `WhatsApp: ${whatsapp}`,
    ].join("\n");

    window.open(`${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`, "_blank");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-[28px] bg-navy-950 p-9 text-center shadow-[0_24px_60px_rgba(31,15,43,0.12)]">
        <h3 className="t-h3 text-white">Enviamos você para o WhatsApp!</h3>
        <p className="mt-3 text-sky-200">
          Seus dados já foram preenchidos na conversa. É só confirmar o envio para a nossa equipe calcular o
          seu desconto e garantir sua vaga.
        </p>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
        >
          Abrir o WhatsApp novamente
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-navy-950/5 bg-white p-5 shadow-[0_24px_60px_rgba(31,15,43,0.10)] sm:p-7"
    >
      {/* Graduação / Pós-graduação */}
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-surface p-1.5">
        {niveis.map((n) => {
          const ativo = n.slug === nivel?.slug;
          return (
            <button
              key={n.slug}
              type="button"
              aria-pressed={ativo}
              onClick={() => handleNivelChange(n.slug)}
              className={`flex h-12 items-center justify-center gap-2.5 rounded-full text-[15px] font-bold transition-colors ${
                ativo
                  ? "bg-gold text-navy-950 shadow-[0_4px_12px_rgba(31,15,43,0.12)]"
                  : "text-navy-950/65 hover:text-navy-950"
              }`}
            >
              <IconeCapelo />
              {n.nome}
            </button>
          );
        })}
      </div>

      {/* Curso */}
      <div className="mt-6">
        <label className="text-[15px] font-bold text-navy-950" htmlFor="curso">
          Curso
        </label>
        <div className="relative mt-2.5">
          <select
            id="curso"
            name="curso"
            required
            value={cursoSlug}
            onChange={(e) => setCursoSlug(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-navy-950/12 bg-white px-5 py-4 text-[15px] text-navy-950 outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          >
            <option value="" disabled>
              Selecione um curso
            </option>
            {cursosDoNivel.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
          <svg
            width="14"
            height="9"
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-navy-950/45"
          >
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Nota do ENEM */}
      <div className="mt-4 rounded-2xl bg-[#f7f3fa] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="block text-[15px] font-extrabold text-navy-950">Sua nota do Enem</span>
            <span className="mt-0.5 block text-[14px] text-muted">Qual foi a sua nota?</span>
          </div>
          <span className="shrink-0 rounded-full bg-sky-100 px-4 py-2 text-[14px] text-navy-950">
            <b className="font-extrabold">{nota}</b> pontos
          </span>
        </div>

        <input
          id="nota"
          name="nota"
          type="range"
          min={0}
          max={NOTA_MAXIMA}
          step={10}
          value={nota}
          onChange={(e) => setNota(Number(e.target.value))}
          aria-label="Sua nota do Enem"
          className="value-slider mt-6"
          style={{ "--fill": `${(nota / NOTA_MAXIMA) * 100}%` } as React.CSSProperties}
        />

        <div className="mt-2.5 flex justify-between text-[13px] text-muted">
          <span>0</span>
          <span>{NOTA_MAXIMA}</span>
        </div>
      </div>

      {/* Dados de contato */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-[15px] font-bold text-navy-950" htmlFor="nome">
            Nome completo
          </label>
          <div className="relative mt-2.5">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-navy-950/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.9" />
                <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="Digite seu nome completo"
              className="w-full rounded-2xl border border-navy-950/12 bg-white py-4 pl-12 pr-5 text-[15px] outline-none transition-colors placeholder:text-navy-950/35 focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
          </div>
        </div>

        <div>
          <label className="text-[15px] font-bold text-navy-950" htmlFor="whatsapp">
            WhatsApp
          </label>
          <div className="relative mt-2.5">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-navy-950/40">
              <IconeWhatsapp />
            </span>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              placeholder="(DDD) 9 9999-9999"
              className="w-full rounded-2xl border border-navy-950/12 bg-white py-4 pl-12 pr-5 text-[15px] outline-none transition-colors placeholder:text-navy-950/35 focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
          </div>
        </div>
      </div>

      <p className="mt-5 flex gap-2.5 text-[13px] leading-relaxed text-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 shrink-0">
          <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" stroke="currentColor" strokeWidth="1.9" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        Seus dados estão seguros. Ao enviar, você será direcionado para o WhatsApp da nossa equipe, que vai
        calcular o seu desconto.
      </p>

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-7 py-4.5 text-[16px] font-bold text-white transition-colors hover:bg-accent-hover"
      >
        <IconeWhatsapp size={21} />
        Simular meu desconto
      </button>
    </form>
  );
}
