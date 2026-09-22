"use client";

import { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  Todas: (
    <>
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="1.9" />
    </>
  ),
  Negócios: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  Educação: (
    <>
      <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  Saúde: (
    <>
      <path
        d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7 3.1C19 15.6 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </>
  ),
  Tecnologia: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
};

const fallback = (
  <>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.9" />
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </>
);

/** Ícone de uma área isolado (ex.: cards do resultado do teste vocacional). */
export function AreaIcon({ area, size = 24 }: { area: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {icons[area] ?? fallback}
    </svg>
  );
}

export default function AreaIcons({
  areas,
  value,
  onChange,
  dark = false,
}: {
  areas: string[];
  value: string;
  onChange: (v: string) => void;
  dark?: boolean;
}) {
  return (
    <div className="-mx-[var(--gutter)] flex gap-6 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-8 sm:px-0 lg:overflow-visible">
      {areas.map((area) => {
        const active = area === value;
        return (
          <button
            key={area}
            onClick={() => onChange(area)}
            aria-pressed={active}
            className="group flex w-[84px] shrink-0 flex-col items-center gap-2.5 text-center"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-accent text-white"
                  : dark
                    ? "bg-white text-navy-900 group-hover:bg-sky-200"
                    : "bg-surface text-navy-800 group-hover:bg-tint-deep"
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                {icons[area] ?? fallback}
              </svg>
            </span>
            <span
              className={`text-[12px] font-bold leading-tight ${
                dark ? "text-white" : "text-navy-950"
              }`}
            >
              {area}
            </span>
          </button>
        );
      })}
    </div>
  );
}
