import Image from "next/image";

export default function BolsasHero() {
  return (
    <section className="relative isolate flex min-h-[420px] flex-col justify-center overflow-hidden bg-navy-950 lg:min-h-[520px]">
      <Image src="/images/bolsas.png" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      {/* Degradê em "U": escurece as laterais e a base (onde o texto e o
          botão ficam), deixa o meio de cima da foto livre. Duas camadas —
          uma horizontal (esquerda/direita) e uma vertical (de baixo pra
          cima) — em vez de uma sombra cobrindo a foto inteira. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(31,15,43,0.97) 0%, transparent 42%, transparent 66%, rgba(31,15,43,0.92) 100%), linear-gradient(to top, rgba(31,15,43,0.95) 0%, transparent 58%)",
        }}
      />

      <div className="container-x py-12 lg:py-16">
        <span className="t-label mb-5 inline-block rounded-full bg-white/12 px-4 py-1.5 uppercase text-sky-300">
          Bolsas
        </span>
        <h1
          className="t-display max-w-[15ch] text-white"
          style={{ fontSize: "clamp(2.25rem, 5.4vw, 4.5rem)" }}
        >
          Aqui a sua bolsa de <span className="text-gold">100%</span> pode começar agora.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-white/90">
          Famílias com renda de até 4 salários mínimos, inscritas em programas sociais do governo ou em
          situação de vulnerabilidade socioeconômica podem estudar sem pagar nada.
        </p>

        <div className="mt-10">
          <a
            href="#simulador"
            className="group inline-flex h-14 items-center justify-between gap-5 rounded-full bg-gold pl-8 pr-3 text-base font-bold text-navy-950 transition-colors hover:bg-gold-hover sm:h-16"
          >
            Simule agora
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/10 transition-transform group-hover:translate-x-1">
              <svg width="18" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
