import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import CourseBannerCta from "@/components/CourseBannerCta";
import Oportunidades from "@/components/institucional/Oportunidades";
import Trajetoria from "@/components/institucional/Trajetoria";
import IntroAnimation from "@/components/intro/IntroAnimation";
import Reveal from "@/components/Reveal";
import ScrollLink from "@/components/ScrollLink";
import { SITE } from "@/lib/constants";
import { getSiteMediaUrls, type SiteMediaKey } from "@/lib/data/siteMedia";

export const metadata: Metadata = {
  title: "Institucional",
  description: "Conheça a missão, a visão e como funciona o programa de bolsas Universidade Fácil.",
};

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
      {/* Intro fullscreen de abertura: roda a sequência de frames por cima de
          tudo e sobe revelando o hero, que é renderizado normalmente aqui
          atrás desde o primeiro paint. */}
      <IntroAnimation />

      {/* Hero centralizada sobre a fachada: título em amarelo oficial, duas
          linhas de apoio e dois CTAs, com a forma orgânica escura ao fundo
          dando profundidade (mesmo blob usado na seção "Acompanhe"). */}
      <section className="relative isolate flex min-h-[560px] flex-col justify-center overflow-hidden bg-navy-950 lg:min-h-[660px]">
        <Image
          src="/images/fachada.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[center_40%]"
        />
        {/* Véu parelho: o texto agora é centralizado, então não cabe mais o
            gradiente lateral que servia ao layout alinhado à esquerda. */}
        <div className="absolute inset-0 -z-10 bg-navy-950/70" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy-950/85 to-transparent" />

        {/* Os dois deslocamentos são o que posiciona a forma: X negativo
            empurra para a esquerda, Y positivo desce. */}
        <BlobDepoimentos fill="#1f0f2bd9" manterProporcao deslocamentoX={-380} deslocamentoY={240} />

        <Container className="relative z-10 py-16 lg:py-24">
          <Reveal>
            <div className="mx-auto max-w-5xl text-center">
              

              <h1 className="font-display text-[clamp(2.5rem,5.8vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-gold">
                Transformando vidas <br></br>com educação acessível 
              </h1>

              {/* O asterisco do título faz a chamada destas duas linhas. */}
              <p className="mx-auto mt-8 max-w-xl text-[15px] font-semibold leading-relaxed text-white lg:text-base">
                *Programa social de bolsas de estudo
                <br />
                Universidades e escolas técnicas de todo o Brasil
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                <ScrollLink
                  alvo="nossa-historia"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-bold text-navy-950 transition-colors hover:bg-gold-hover"
                >
                  Conheça nossa história
                </ScrollLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Destino do botão "Conheça nossa história". */}
      <div id="nossa-historia" />

      {/* Banner + carrossel: o card em destaque sobrepõe a borda do banner. */}
      <Oportunidades />

      {/* Trajetória: a linha acende cada passo ao entrar na tela. */}
      <Trajetoria />



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
