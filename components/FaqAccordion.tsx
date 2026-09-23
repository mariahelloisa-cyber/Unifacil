export type FaqItem = { pergunta: string; resposta: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const meio = Math.ceil(items.length / 2);
  const colunas = [items.slice(0, meio), items.slice(meio)];

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      {colunas.map((coluna, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-navy-950/15 bg-white">
          {coluna.map((item) => (
            <details
              key={item.pergunta}
              className="group border-b border-navy-950/15 px-5 py-4 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-bold text-navy-950">
                {item.pergunta}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform duration-300 group-open:rotate-45"
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.resposta}</p>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
