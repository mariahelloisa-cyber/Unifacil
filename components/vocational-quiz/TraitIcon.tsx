import type { ReactNode } from "react";
import type { Trait } from "@/lib/vocational-quiz/types";

const p = (d: string) => <path d={d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />;

/* Ícones de traço no mesmo estilo de linha dos AreaIcons (24×24, traço 1.9). */
const ICONES: Record<Trait, ReactNode> = {
  analysis: p("M5 19v-7M12 19V5M19 19v-10"),
  technology: p("m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"),
  science: p("M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"),
  management: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.9" />
      {p("M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2")}
    </>
  ),
  leadership: p("M5 21V4M5 4h11l-2 4 2 4H5"),
  strategy: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.9" />
    </>
  ),
  organization: p("M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17"),
  communication: p("M4 5h16v11H10l-6 4V5Z"),
  creativity: p("M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.9" />
      {p("M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 20a5 5 0 0 0-2.5-4.4")}
    </>
  ),
  care: p("M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7 3.1C19 15.6 12 20 12 20Z"),
  behavior: (
    <>
      {p("M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z")}
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.9" />
    </>
  ),
  education: p("M12 4 2.5 9 12 14l9.5-5L12 4ZM6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"),
  justice: p("M12 4v16M8 20h8M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7ZM19 7l-3 6a3 3 0 0 0 6 0l-3-6Z"),
  social: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      {p("M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18")}
    </>
  ),
  practical: p("M14.7 6.3a4 4 0 0 0 5 5l-8.6 8.6a2.1 2.1 0 0 1-3-3l8.6-8.6a4 4 0 0 0-2-2Z"),
};

export default function TraitIcon({ trait, size = 20 }: { trait: Trait; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      {ICONES[trait]}
    </svg>
  );
}
