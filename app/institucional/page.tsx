import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Container from "@/components/Container";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import CourseBannerCta from "@/components/CourseBannerCta";
import EditorialScroll from "@/components/institucional/EditorialScroll";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/constants";
import { getSiteMediaUrls, type SiteMediaKey } from "@/lib/data/siteMedia";

export const metadata: Metadata = {
  title: "Institucional",
  description: "Conheça a missão, a visão e como funciona o programa de bolsas Universidade Fácil.",
};

const iconProps = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const destaques: { icon: ReactNode; texto: string }[] = [
  {
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m8.8 12 2.2 2.2 4.2-4.4" />
      </svg>
    ),
    texto: "Instituições parceiras reconhecidas pelo MEC.",
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9L12 3.5Z" />
      </svg>
    ),
    texto: "Bolsa de 100% para alunos de baixa renda.",
  },
  {
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="9" r="5.5" />
        <path d="m8.8 13.6-1.3 7 4.5-2.4 4.5 2.4-1.3-7" />
      </svg>
    ),
    texto: "Descontos de até 80% no valor do curso.",
  },
  {
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
        <path d="M2 19h20" />
      </svg>
    ),
    texto: "Centenas de cursos, do EJA à pós-graduação.",
  },
];

/* Imagens enviadas pelo admin em /admin/midia/redes-sociais. */
const redes: { chave: SiteMediaKey; nome: string; href: string }[] = [
  { chave: "social_facebook", nome: "Facebook", href: SITE.facebook },
  { chave: "social_instagram", nome: "Instagram", href: SITE.instagram },
  { chave: "social_youtube", nome: "YouTube", href: SITE.youtube },
  { chave: "social_reclameaqui", nome: "Reclame Aqui", href: SITE.reclameAqui },
  { chave: "social_google", nome: "Google Meu Negócio", href: SITE.googleMeuNegocio },
];

export default async function InstitucionalPage() {
  const redesImg = await getSiteMediaUrls(redes.map((r) => r.chave));

  return (
    <>
      {/* Hero com a fachada ao fundo. O pb extra reserva o espaço de onde os
          cards "saem" — eles sobem por cima da base da foto. */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        <Image
          src="/images/fachada.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-950/40" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-950/80 to-transparent" />

        <Container className="pb-40 pt-16 lg:pb-48 lg:pt-24">
          <Reveal>
            <span className="t-label mb-5 inline-block rounded-full bg-white/12 px-4 py-1.5 uppercase text-sky-300">
              Institucional
            </span>
            <h1 className="t-h2 max-w-4xl text-white">Transformando vidas com educação acessível para todos</h1>
            <p className="t-lead mt-5 max-w-2xl text-sky-200">
              Somos um programa social de bolsas de estudo que abre as portas de universidades e
              escolas técnicas de todo o Brasil para quem tem vontade de estudar.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cards sobrepostos à base do hero. */}
      <div className="bg-white">
        <Container className="relative z-10 -mt-28 lg:-mt-32">
          <ul className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {destaques.map((d, i) => (
              <li key={d.texto}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col gap-5 bg-navy-950 p-6 text-white shadow-[0_18px_40px_rgba(31,15,43,0.25)] lg:min-h-[180px]">
                    <span className="text-sky-200">{d.icon}</span>
                    <p className="text-[16px] font-bold leading-snug">{d.texto}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Experiência editorial de scroll (pin + scrub com GSAP). */}
      <EditorialScroll />


      {/* "Acompanhe" — prints das redes sociais, enviados pelo admin. */}
      {/* Sem margem no topo: encosta direto no fim da seção do vídeo. */}
      <section className="relative overflow-hidden bg-tint py-14 lg:py-20">
        <BlobDepoimentos fill="#d9c9e6" manterProporcao deslocamentoX={-60} />

        <Container className="relative z-10">
          <Reveal>
            <h2 className="text-center font-display text-[clamp(2rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-black">
              Acompanhe a <span className="text-navy-800">Universidade Fácil</span>
            </h2>
          </Reveal>

          <ul className="mx-auto mt-10 grid max-w-[1240px] grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-6">
            {redes.map((rede, i) => {
              const img = redesImg[rede.chave];
              const card = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white ring-1 ring-navy-950/5 transition-transform duration-300 group-hover:-translate-y-1">
                    {img ? (
                      <Image
                        src={img}
                        alt={`Página da Universidade Fácil no ${rede.nome}`}
                        fill
                        sizes="(min-width: 1024px) 230px, (min-width: 640px) 33vw, 50vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-navy-850 px-4 text-center text-sm font-bold text-sky-300">
                        {rede.nome}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-center font-display text-[15px] font-extrabold uppercase text-navy-950 lg:text-[17px]">
                    {rede.nome}
                  </p>
                </>
              );

              return (
                <li key={rede.chave}>
                  <Reveal delay={i * 70}>
                    {rede.href ? (
                      <a href={rede.href} target="_blank" rel="noopener noreferrer" className="group block">
                        {card}
                      </a>
                    ) : (
                      <div className="group">{card}</div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      
    </>
  );
}
