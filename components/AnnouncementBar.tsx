"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="bg-accent text-white">
      <div className="container-x flex items-center justify-between gap-4 py-1">
        <p className="flex min-w-0 items-center gap-2 text-[13px] font-bold sm:text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
            <path
              d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="7" r="1.6" fill="currentColor" />
          </svg>
          <span className="truncate">
            Inscrições abertas<span className="hidden sm:inline">: bolsas de 100% e descontos de até 80%</span>!
          </span>
        </p>
        <div className="flex items-center gap-3">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 text-sm font-bold underline underline-offset-2 hover:opacity-80 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.7-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2.1c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c0 .1.1.3 0 .4l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.8-1c.2-.2.3-.2.5-.1l1.8.8c.2.1.4.2.4.3v.8Z" />
            </svg>
            Fale com a central
          </a>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar aviso"
            className="p-1 hover:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
