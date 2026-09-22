import Image from "next/image";
import Link from "next/link";
import persona from "@/app/assets/persona.png";
import { AreaIcon } from "@/components/AreaIcons";
import { SITE } from "@/lib/constants";
import { COURSE_AFFINITY_PROFILES } from "@/lib/vocational-quiz/courseAffinityProfiles";
import { buildMainExplanation, buildShortExplanation } from "@/lib/vocational-quiz/explanation";
import { AFFINITY_LABEL, affinityLevel, getMatchTraits } from "@/lib/vocational-quiz/scoring";
import { TRAIT_COPY } from "@/lib/vocational-quiz/traitCopy";
import type { RankedCourse, TraitVector } from "@/lib/vocational-quiz/types";
import TraitIcon from "./TraitIcon";

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const hrefCurso = (r: RankedCourse) => `/${r.course.nivelSlug}/${r.course.slug}`;

/** Símbolo oficial (logo-mark.png) como marca d'água. */
function Watermark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute aspect-[512/468] select-none overflow-hidden ${className}`}
    >
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={512}
        height={468}
        sizes="620px"
        draggable={false}
        className="block h-auto w-full"
      />
    </span>
  );
}

const Seta = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={Math.round(size * 0.72)} viewBox="0 0 22 16" fill="none" aria-hidden>
    <path d="M1 8h19M14 1.5 20.5 8 14 14.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FOCO = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50 focus-visible:ring-offset-2";

export default function QuizResult({
  results,
  userProfile,
  onRestart,
  onCourseClick,
}: {
  results: RankedCourse[];
  userProfile: TraitVector;
  onRestart: () => void;
  onCourseClick: (slug: string, position: number) => void;
}) {
  const [principal, ...outros] = results;

  const consultorHref = `${SITE.whatsapp}?text=${encodeURIComponent(
    principal
      ? `Olá! Fiz o teste vocacional no site da Universidade Fácil e meu resultado apontou para ${principal.course.nome}. Quero saber mais.`
      : "Olá! Fiz o teste vocacional no site da Universidade Fácil e quero ajuda para escolher meu curso."
  )}`;

  // Até 4 traços que mais explicam o match do 1º curso.
  const tracos = principal
    ? getMatchTraits(userProfile, COURSE_AFFINITY_PROFILES[principal.course.slug] ?? {}, 4)
    : [];

  return (
    <div
      className="relative isolate overflow-hidden text-navy-800"
      style={{ background: "color-mix(in srgb, var(--color-sky-100) 45%, #fff)" }}
    >
      <Watermark className="-right-[10%] -top-[4%] -z-10 w-[46%] max-w-[640px] opacity-[0.05]" />

      <div className="container-x pb-14 pt-6 lg:pb-20 lg:pt-8">
        {/* Topo: logo oficial + refazer */}
        <div data-stagger className="flex items-center justify-between gap-4">
          <Image
            src="/images/logo-horizontal.png"
            alt="Universidade Fácil"
            width={1200}
            height={416}
            sizes="200px"
            className="h-11 w-auto sm:h-14"
          />
          <button
            type="button"
            onClick={onRestart}
            className={`-mr-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[15px] font-bold text-navy-800 transition-colors hover:text-navy-600 ${FOCO}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4.5h-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refazer teste
          </button>
        </div>

        {/* Card principal */}
        <section
          data-stagger
          aria-labelledby="resultado-titulo"
          className="mt-5 grid gap-6 rounded-[28px] bg-white/85 p-5 shadow-[0_20px_60px_rgba(96,46,115,0.08)] ring-1 ring-navy-800/5 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8 lg:p-10"
        >
          <div className="min-w-0">
            <p className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.22em] text-navy-600">
              Resultado do teste
              <span className="h-px w-14 bg-sky-400" aria-hidden />
            </p>
            <h1
              id="resultado-titulo"
              data-autofocus
              tabIndex={-1}
              className="mt-3 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em] outline-none"
            >
              Seu perfil aponta para…
            </h1>

            {principal ? (
              <div className="mt-6 rounded-[22px] border border-navy-800/10 bg-white p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <span className="rounded-[12px] bg-sky-100 px-3.5 py-1.5 font-display text-[clamp(1.35rem,2vw,1.8rem)] font-extrabold leading-none">
                    #1
                  </span>
                  <h2 className="min-w-0 font-display text-[clamp(1.8rem,3.4vw,3.1rem)] font-extrabold leading-[1.04] tracking-[-0.03em]">
                    {principal.course.nome}
                  </h2>
                </div>

                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] font-semibold text-muted">
                  <span className="rounded-full bg-navy-800 px-3 py-1 text-[12px] font-bold text-white">
                    {AFFINITY_LABEL[affinityLevel(principal.score)]}
                  </span>
                  <span>
                    {principal.course.nivelNome} · {principal.course.area} · {principal.course.modalidade} ·{" "}
                    {principal.course.duracao}
                  </span>
                </p>

                <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-navy-800/85 lg:text-[17px]">
                  {buildMainExplanation(principal.topTraits)}
                </p>

                {tracos.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="Seus traços mais fortes para este curso">
                    {tracos.map((t) => (
                      <li
                        key={t}
                        className="flex h-11 items-center gap-2.5 rounded-full border border-navy-800/10 bg-sky-100/50 px-4 text-[14px] font-semibold"
                      >
                        <span className="text-navy-700">
                          <TraitIcon trait={t} size={19} />
                        </span>
                        {capitalizar(TRAIT_COPY[t].label)}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={hrefCurso(principal)}
                    onClick={() => onCourseClick(principal.course.slug, 1)}
                    className={`group flex h-[54px] items-center justify-center gap-3 rounded-[12px] bg-navy-800 px-7 font-bold text-white transition-colors hover:bg-navy-700 ${FOCO}`}
                  >
                    Conhecer o curso
                    <span className="sr-only">: {principal.course.nome}</span>
                    <span className="transition-transform motion-safe:group-hover:translate-x-1">
                      <Seta />
                    </span>
                  </Link>
                  <a
                    href={consultorHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-[54px] items-center justify-center gap-3 whitespace-nowrap rounded-[12px] border border-navy-800/25 bg-white px-4 text-[15px] font-bold text-navy-800 transition-colors hover:border-navy-800/60 sm:px-7 sm:text-base ${FOCO}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M4 5h16v11H10l-6 4V5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                    </svg>
                    Falar com um consultor
                  </a>
                </div>
              </div>
            ) : (
              <p className="mt-6 rounded-[22px] border border-navy-800/10 bg-white p-7 text-[17px] leading-relaxed">
                Não conseguimos carregar os cursos agora. Fale com um consultor pelo WhatsApp e ele te ajuda a
                encontrar o curso ideal.
              </p>
            )}
          </div>

          {/* Painel com a aluna (recorte oficial usado no banner dos cursos) */}
          <div
            aria-hidden="true"
            className="relative isolate min-h-[380px] overflow-hidden rounded-[26px] bg-sky-100 sm:min-h-[460px] lg:min-h-0"
          >
            <div className="absolute inset-0 -z-10 bg-navy-800 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%,0_50%)]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-navy-950/35 [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%,0_50%)]" />
            <div className="absolute bottom-0 left-0 h-[84%] w-[76%]">
              <Image
                src={persona}
                alt=""
                fill
                sizes="(min-width: 1024px) 32vw, 76vw"
                className="object-contain object-[left_bottom]"
              />
            </div>
            <div className="absolute right-5 top-[9%] max-w-[34%] text-white [text-shadow:0_2px_14px_rgba(31,15,43,0.5)] sm:right-8">
              <p className="font-display text-[clamp(1.05rem,1.9vw,1.65rem)] font-semibold leading-[1.2]">
                Mais que um curso, um futuro com propósito.
              </p>
              <span className="mt-5 block h-px w-10 bg-white/70" />
            </div>
            <Image
              src="/images/logobranca-corte.png"
              alt=""
              width={1200}
              height={416}
              sizes="120px"
              className="absolute bottom-5 right-5 h-auto w-[92px] sm:bottom-7 sm:right-8 sm:w-[110px]"
            />
          </div>
        </section>

        {/* Outros cursos */}
        {outros.length > 0 && (
          <section aria-labelledby="outros-titulo" className="mt-12 lg:mt-14">
            <div data-stagger className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <h2
                id="outros-titulo"
                className="font-display text-[clamp(1.5rem,2.3vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.02em] lg:whitespace-nowrap"
              >
                Outros cursos que combinam com você
              </h2>
              <p className="text-[15px] text-muted lg:max-w-[44ch] lg:text-right">
                Seu perfil também se conecta com estas áreas. Explore e descubra novas possibilidades.
              </p>
            </div>

            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {outros.map((r, i) => (
                <li
                  key={r.course.slug}
                  data-stagger
                  className="relative isolate flex flex-col overflow-hidden rounded-[22px] bg-white p-6 shadow-[0_14px_40px_rgba(96,46,115,0.06)] ring-1 ring-navy-800/5 sm:p-8"
                >
                  <Watermark className="-bottom-[34%] -right-[6%] -z-10 w-[42%] opacity-[0.06]" />

                  <div className="flex items-start gap-4">
                    <span className="shrink-0 rounded-[12px] bg-sky-100 px-3 py-1.5 font-display text-[1.35rem] font-extrabold leading-none">
                      #{i + 2}
                    </span>
                    <h3 className="min-w-0 flex-1 font-display text-[clamp(1.35rem,2vw,1.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em]">
                      {r.course.nome}
                    </h3>
                    <span
                      className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-100 text-navy-800 sm:flex"
                      title={r.course.area}
                    >
                      <AreaIcon area={r.course.area} size={28} />
                    </span>
                  </div>

                  <p className="mt-2 text-[13px] font-semibold text-muted">
                    {AFFINITY_LABEL[affinityLevel(r.score)]} · {r.course.nivelNome} · {r.course.area}
                  </p>
                  <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-navy-800/85">
                    {buildShortExplanation(r.topTraits)}
                  </p>

                  <span className="mt-5 block h-px w-2/3 bg-navy-800/10" aria-hidden />
                  <div className="flex-1" />

                  <Link
                    href={hrefCurso(r)}
                    onClick={() => onCourseClick(r.course.slug, i + 2)}
                    className={`group mt-5 flex h-11 w-fit items-center gap-2.5 rounded-[10px] border border-navy-800/30 px-5 text-[14px] font-bold transition-colors hover:border-navy-800 ${FOCO}`}
                  >
                    Ver curso
                    <span className="sr-only">: {r.course.nome}</span>
                    <span className="transition-transform motion-safe:group-hover:translate-x-1">
                      <Seta size={15} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Faixa final de conversão — o resultado já foi mostrado sem pedir dados. */}
        <section
          data-stagger
          aria-labelledby="cta-titulo"
          className="relative isolate mt-12 overflow-hidden rounded-[24px] bg-navy-800 px-6 py-7 text-white sm:px-8 lg:mt-14 lg:px-10"
        >
          <Watermark className="-right-[4%] -top-[60%] -z-10 w-[26%] opacity-[0.06] brightness-0 invert" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex items-center gap-5 lg:flex-1">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                <AreaIcon area="Educação" size={28} />
              </span>
              <div>
                <h2 id="cta-titulo" className="font-display text-[clamp(1.35rem,2.1vw,1.85rem)] font-bold leading-tight">
                  Gostou do seu resultado?
                </h2>
                <p className="mt-1 text-[15px] text-sky-200">
                  Dê o próximo passo e construa o seu futuro com a Universidade Fácil.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {principal && (
                <Link
                  href={`/${principal.course.nivelSlug}`}
                  className={`flex h-[52px] items-center justify-center rounded-[12px] border border-white/40 px-7 font-bold transition-colors hover:border-white ${FOCO} focus-visible:ring-offset-navy-800`}
                >
                  Ver todos os cursos
                </Link>
              )}
              <Link
                href="/inscricao"
                className={`group flex h-[52px] items-center justify-center gap-3 rounded-[12px] bg-sky-100 px-7 font-bold text-navy-800 transition-colors hover:bg-white ${FOCO} focus-visible:ring-offset-navy-800`}
              >
                Iniciar matrícula
                <span className="transition-transform motion-safe:group-hover:translate-x-1">
                  <Seta />
                </span>
              </Link>
            </div>

            <p className="hidden max-w-[17ch] border-l border-white/25 pl-6 text-[10.5px] font-semibold uppercase leading-[1.7] tracking-[0.2em] text-sky-200 xl:block">
              {SITE.slogan}
            </p>
          </div>
        </section>

        <p className="mx-auto mt-6 max-w-[64ch] text-center text-[12.5px] leading-relaxed text-muted">
          Este teste tem caráter orientativo e não substitui uma orientação profissional individual.
        </p>
      </div>
    </div>
  );
}
