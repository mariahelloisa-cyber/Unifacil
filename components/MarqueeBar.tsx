/** Faixa amarela rolante embaixo da hero, com texto repetindo em loop
 *  infinito (mesma ideia de banners de "matrículas abertas" de sites de
 *  faculdade: duas cópias do conteúdo lado a lado, a track anda -50% e
 *  reinicia sem salto). */
export default function MarqueeBar({ text = "Matrículas abertas" }: { text?: string }) {
  const item = (
    <span className="mx-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-navy-950">
      {text}
      <span aria-hidden>•</span>
    </span>
  );
  const items = Array.from({ length: 8 }, (_, i) => <span key={i}>{item}</span>);

  return (
    <div aria-hidden={false} className="overflow-hidden bg-gold py-2.5">
      <div className="marquee-track flex w-max">
        <div className="flex shrink-0 items-center">{items}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}
