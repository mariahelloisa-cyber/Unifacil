import Link from "next/link";
import Image from "next/image";

export default function Hero({ videoUrl }: { videoUrl?: string }) {
  return (
    <section className="relative isolate flex min-h-[560px] flex-col justify-center overflow-hidden bg-navy-950 lg:min-h-[680px]">
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/art/hero.svg"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <Image
          src="/images/art/hero.svg"
          alt=""
          fill
          priority
          className="-z-10 object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/30" />

      <div className="container-x -mt-12 py-20 sm:-mt-18 lg:-mt-26 lg:py-24">
        <h1
          className="t-display text-white"
          style={{ fontSize: "clamp(2.5rem, 6.2vw, 5.5rem)" }}
        >
          <br></br>
          <span className="sm:whitespace-nowrap">Educação acessível</span>
          <br />
          para todos
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-white/90">
          Vagas gratuitas e descontos de até 80% em centenas de cursos, em instituições
          reconhecidas pelo MEC de todo o Brasil.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/graduacao"
            className="group inline-flex h-14 items-center justify-between gap-5 rounded-full bg-accent pl-8 pr-3 text-base font-bold text-white transition-colors hover:bg-accent-hover sm:h-16"
          >
            Encontre seu curso
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
              <svg width="18" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <Link
            href="/matricula"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-8 text-base font-bold text-white transition-colors hover:bg-white/10 sm:h-16"
          >
            Como funciona
          </Link>
        </div>
      </div>
    </section>
  );
}
 