import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import BlobDepoimentos from "./BlobDepoimentos";

/* Recorte da aluna (PNG com fundo transparente): ela fica alinhada pela base
   do banner e sobra para fora, por cima da borda de cima. Import estático — o
   arquivo vive em app/assets, fora de public. */
import persona from "@/app/assets/persona.png";
/* Quanto a aluna sobe para fora do banner, em px. O padding da seção reserva
   exatamente esse espaço, então nada é cortado nem empurra o conteúdo. */
const SOBRA = 92;

/** Banner azul de fechamento — o mesmo em todas as páginas de curso. */
export default function CourseBannerCta({ href }: { href: string }) {
  return (
    <section className="bg-white pb-[clamp(2.5rem,4vw,4rem)]" style={{ paddingTop: SOBRA + 40 }}>
      <Container>
        <div className="relative">
          <div className="relative overflow-hidden rounded-[36px] bg-navy-800">
            <BlobDepoimentos fill="#4b2a63" manterProporcao />

            <div className="relative z-10 px-7 py-10 sm:px-10 lg:py-14 lg:pl-[420px] lg:pr-[260px]">
              <h2 className="font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
                Encontre o curso
                <br />
                ideal para você.
              </h2>

              <p className="mt-4 text-[13px] font-bold uppercase tracking-[0.24em] text-white sm:text-[15px]">
                Técnico <span className="px-1.5">•</span> Graduação <span className="px-1.5">•</span> Pós
              </p>

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <p className="max-w-[34ch] border-l-2 border-white/50 pl-4 text-[15px] font-semibold leading-relaxed text-white">
                  Estude com até 80% de desconto em instituições reconhecidas pelo MEC.
                </p>

                <Link
                  href={href}
                  className="flex h-[58px] shrink-0 items-center gap-4 rounded-full bg-gold px-8 font-bold text-navy-950 transition-[filter] hover:brightness-95"
                >
                  Encontre seu curso
                  <svg width="24" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
                    <path
                      d="M1 8h19M14 1.5 20.5 8 14 14.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Versão branca oficial da marca. */}
            <Image
              src="/images/logobranca-corte.png"
              alt="Universidade Fácil"
              width={1200}
              height={416}
              className="absolute right-10 top-1/2 z-10 hidden w-[190px] -translate-y-1/2 lg:block"
            />
          </div>

          {/* Fora da caixa que corta: por isso ela pode passar do topo. */}
          <div
            aria-hidden
            style={{ height: `calc(100% + ${SOBRA}px)` }}
            className="pointer-events-none absolute bottom-0 left-2 hidden w-[430px] lg:block"
          >
            <Image src={persona} alt="" fill sizes="430px" className="object-contain object-bottom" />
          </div>
        </div>
      </Container>
    </section>
  );
}
