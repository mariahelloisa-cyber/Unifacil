"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

export default function ContatoForm() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sem backend configurado ainda: apenas confirma o recebimento no cliente.
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl bg-navy-950 p-9 text-center">
        <h2 className="t-h3 text-white">Mensagem recebida!</h2>
        <p className="mt-3 text-sky-200">
          Obrigado pelo contato. Se preferir uma resposta mais rápida, fale direto com a equipe pelo WhatsApp.
        </p>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
        >
          Falar no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-surface p-6 sm:p-8">
      <div className="grid gap-5">
        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </div>
        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </div>
        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="mensagem">
            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            required
            rows={5}
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-7 w-full rounded-full bg-accent px-7 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
      >
        Enviar mensagem
      </button>
    </form>
  );
}
