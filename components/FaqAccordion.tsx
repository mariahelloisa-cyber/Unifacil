export type FaqItem = { pergunta: string; resposta: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="grid gap-x-16 md:grid-cols-2">
      {items.map((item) => (
        <details key={item.pergunta} className="group border-b border-navy-950/15 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-bold text-navy-950">
            {item.pergunta}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 transition-transform duration-300 group-open:rotate-180"
              aria-hidden
            >
              <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.resposta}</p>
        </details>
      ))}
    </div>
  );
}
