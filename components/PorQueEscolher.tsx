import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";

const BENEFICIOS = [
  { titulo: "Ensino de qualidade", icone: <IconeGraduacao /> },
  { titulo: "Professores experientes", icone: <IconePessoas /> },
  { titulo: "Mais oportunidades", icone: <IconeGrafico /> },
];

/** "Por que escolher a UniFácil" — três camadas independentes dentro da
 *  faixa roxa: o painel amarelo (mais estreito que a seção, com boa margem
 *  roxa dos dois lados), o texto dentro dele, e o personagem — absoluto em
 *  relação à SEÇÃO, não ao card, pra poder "sangrar" livremente por cima e
 *  por baixo do painel sem ser cortado pelo overflow do card.
 *
 *  O painel NÃO é absoluto: a animação de entrada do <Reveal> aplica um
 *  transform, o que faria daquela div o bloco de contenção de um filho
 *  absoluto — e como ela tem altura zero, um top:50% ali resolveria pra 0 e
 *  o card subiria pra fora da seção. Por isso a centralização vertical vem
 *  do flex do wrapper, e as margens laterais em % dão o recuo do roxo. */
export default function PorQueEscolher() {
  return (
    <section className="relative overflow-hidden bg-navy-800 py-14 lg:h-[clamp(460px,33vw,680px)] lg:py-0">
      {/* Profundidade sutil no roxo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(130,65,150,0.30), transparent 45%)",
        }}
      />

      {/* ---------- Textura do fundo roxo ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
        <div className="absolute left-[70px] top-[70px] text-[13px] font-bold uppercase leading-relaxed tracking-[0.32em] text-white/35">
          Conhecimento
          <br />
          que transforma
          <br />o seu futuro
        </div>
        <span className="absolute left-[70px] top-[152px] h-[3px] w-12 bg-gold" />

        <div className="absolute bottom-14 left-[70px] grid grid-cols-6 gap-3 opacity-25">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-white" />
          ))}
        </div>

        <span className="absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full border-2 border-gold/35" />
        <span className="absolute -right-28 -top-28 h-[340px] w-[340px] rounded-full border-2 border-gold/30" />

        <div className="absolute right-[6%] top-10 max-w-[150px] rotate-[-3deg] text-[14px] italic leading-snug text-white/35">
          Mais conhecimento para um amanhã melhor
          <svg
            width="36"
            height="32"
            viewBox="0 0 34 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="mt-1"
            aria-hidden
          >
            <path d="M4 4c8 2 20 4 22 14-1 5-9 7-13 3" />
            <path d="M8 22l5-1.5-1 5.5" />
          </svg>
        </div>

        <p className="absolute bottom-0 right-6 select-none text-[clamp(70px,9vw,140px)] font-black uppercase leading-[0.82] tracking-tight text-white/[0.07]">
          Vá
          <br />
          Mais
          <br />
          Longe
        </p>
      </div>

      {/* ---------- Card amarelo — mais estreito, centralizado no eixo Y ---------- */}
      <div className="relative z-[1] mx-auto w-[calc(100%-40px)] sm:w-[calc(100%-80px)] lg:absolute lg:inset-0 lg:mx-0 lg:flex lg:w-auto lg:items-center">
        <Reveal className="lg:w-full">
          <Link
            href="/institucional"
            className="group relative mx-auto flex w-full max-w-[900px] flex-col overflow-hidden rounded-[36px] px-7 py-10 sm:px-10 lg:ml-[16%] lg:mr-[17%] lg:h-[clamp(320px,20vw,425px)] lg:w-auto lg:max-w-none lg:justify-center lg:rounded-[50px] lg:px-0 lg:py-0"
            style={{ backgroundImage: "linear-gradient(135deg, #F6A900 0%, #FFB310 55%, #F4A000 100%)" }}
          >
            {/* Arcos ton-sur-ton, bem maiores, entrando pelo topo/centro e
                pela base do painel */}
            <span aria-hidden className="pointer-events-none absolute -right-24 -top-40 h-[420px] w-[420px] rounded-full bg-white/[0.13]" />
            <span aria-hidden className="pointer-events-none absolute -bottom-44 left-[30%] h-[460px] w-[460px] rounded-full bg-black/[0.07]" />
            <span aria-hidden className="pointer-events-none absolute -left-20 bottom-[-60px] h-64 w-64 rounded-full bg-white/[0.08]" />

            <div className="relative lg:w-[49%] lg:pl-[70px]">
              <h2 className="uppercase text-navy-800" style={{ fontFamily: "var(--font-anton)" }}>
                <span className="block text-[26px] leading-[0.95] tracking-wide sm:text-[32px] lg:whitespace-nowrap lg:text-[clamp(32px,2.5vw,54px)]">
                  Por que escolher
                </span>
                <span className="mt-1 block text-[48px] leading-[0.9] tracking-[-0.01em] text-white sm:text-[64px] lg:whitespace-nowrap lg:text-[clamp(68px,5.5vw,112px)]">
                  A UniFácil
                </span>
              </h2>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0 lg:mt-[50px] lg:flex-nowrap">
                {BENEFICIOS.map((b, i) => (
                  <div
                    key={b.titulo}
                    className={`flex items-center gap-3 lg:gap-3 ${
                      i > 0 ? "sm:border-l sm:border-navy-800/25 sm:pl-6 lg:pl-5" : ""
                    } ${i < BENEFICIOS.length - 1 ? "sm:pr-6 lg:pr-5" : ""}`}
                  >
                    <span className="shrink-0 text-navy-800 lg:scale-110">{b.icone}</span>
                    <span className="text-[13px] font-bold uppercase leading-tight text-navy-800 lg:text-[14px]">
                      {b.titulo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </Reveal>

        {/* ---------- Personagem ----------
            Camada independente do card: absoluto em relação à SEÇÃO (via
            inset-0 do wrapper acima), não ao painel — por isso não é cortado
            pelo overflow-hidden do card e pode ultrapassá-lo livremente. No
            mobile segue no fluxo normal, abaixo do painel. */}
        <div className="relative z-[2] mt-6 flex justify-center sm:h-[380px] lg:absolute lg:inset-y-0 lg:left-[50%] lg:right-[16.5%] lg:mt-0 lg:block lg:h-auto lg:w-auto">
          <div className="relative h-[300px] w-[230px] sm:h-full sm:w-full lg:h-full lg:w-full">
            <Image
              src="/images/pessoacard-transparente.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 60vw, 34vw"
              quality={95}
              className="pointer-events-none z-[2] object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IconeGraduacao() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10.5V16c0 1.8 2.7 3 6 3s6-1.2 6-3v-5.5" />
      <path d="M22 8v6" />
    </svg>
  );
}

function IconePessoas() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17.5" cy="9" r="2.2" />
      <path d="M15.2 12.2c2.4.3 4.3 2.1 4.3 4.7" />
    </svg>
  );
}

function IconeGrafico() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 20h18" />
      <rect x="5" y="13" width="3" height="7" />
      <rect x="10.5" y="9" width="3" height="11" />
      <rect x="16" y="5" width="3" height="15" />
      <path d="m4 9 5-4 4 3 6-5" />
      <path d="M15 3h4v4" />
    </svg>
  );
}
