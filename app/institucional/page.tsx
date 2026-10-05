import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import ContinuacaoBlob from "@/components/ContinuacaoBlob";
import CourseBannerCta from "@/components/CourseBannerCta";
import AtendimentoConsultores from "@/components/institucional/AtendimentoConsultores";
import Oportunidades from "@/components/institucional/Oportunidades";
import SobreNos from "@/components/institucional/SobreNos";
import Trajetoria from "@/components/institucional/Trajetoria";
import IntroAnimation from "@/components/intro/IntroAnimation";
import Reveal from "@/components/Reveal";
import TextoEmergindo from "@/components/TextoEmergindo";
import institucionalHero from "@/app/assets/institucional.png";
import sobrenos from "@/app/assets/sobrenos.webp";
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

      {/* Hero: o banner já traz logo, título e texto desenhados na arte, então
          ele entra inteiro, na proporção original (sem object-cover, que
          cortaria o texto da arte nas bordas). */}
      <section className="relative overflow-hidden bg-white">
        {/* O título da arte é imagem: este h1 é o que leitores de tela e buscadores leem. */}
        <h1 className="sr-only">Por que escolher a UniFácil? Mais oportunidades para transformar a sua história</h1>
        {/* -mt-[4%]/-mb-[2.5%] cortam tiras finas do topo e da base da arte
            (margem em % é relativa à largura, então o corte acompanha a escala
            do banner). */}
        <Image
          src={institucionalHero}
          alt="Por que escolher a UniFácil? Seu futuro começa com uma oportunidade. Mais oportunidades para transformar a sua história: bolsas de estudo para graduação e pós-graduação."
          priority
          placeholder="blur"
          sizes="100vw"
          className="-mb-[2.5%] -mt-[4%] block h-auto w-full"
        />
      </section>

      {/* Faixa divisória no fim do hero, igual à que fica logo abaixo do header. */}
      <div aria-hidden className="h-[26px] bg-navy-800" />

      {/* Sobre nós: visão, missão e valores em três cards. */}
      <SobreNos />

      {/* Banner + carrossel: o card em destaque sobrepõe a borda do banner. */}
      <Oportunidades />

            

      

      {/* Trajetória: a linha acende cada passo ao entrar na tela. */}
      <Trajetoria />

      <AtendimentoConsultores />

      {/* Frase de propósito, emergindo palavra a palavra a partir do centro
          quando entra na tela. Mesmo fundo (tint) da seção "Acompanhe" logo
          abaixo, para as duas lerem como um bloco só com a forma lilás
          atravessando. À direita, a foto da estudante. */}
      <section className="relative isolate overflow-hidden bg-tint pb-10 pt-16 lg:pb-12 lg:pt-20">
        {/* A forma lilás da seção "Acompanhe" continua subindo por aqui, atrás
            do texto. Só a partir de lg: no layout empilhado a rota das bordas
            passaria por cima de tudo. */}
        <ContinuacaoBlob blobPathId="blob-acompanhe" fill="#d9c9e6" className="hidden lg:block" />

        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <TextoEmergindo
            as="h2"
            texto="Acreditamos que estudar não deveria depender do tamanho do bolso. Cada bolsa é uma porta aberta para um futuro com mais oportunidades."
            destaque={{ texto: "uma porta aberta", className: "text-accent" }}
            className="max-w-[20ch] font-display font-extrabold leading-[1.08] tracking-[-0.025em] text-navy-950"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          />
          {/* Foto apoiada na base da seção: a margem negativa anula o padding
              de baixo para ela encostar na borda. */}
          <div className="-mb-10 flex justify-center self-end lg:-mb-12 lg:justify-end">
            <Image
              src={sobrenos}
              alt="Estudante sorrindo, abraçada a livros, em frente ao campus"
              placeholder="blur"
              sizes="(min-width: 1024px) 520px, 80vw"
              className="h-auto w-full max-w-[380px] lg:max-w-[520px]"
            />
          </div>
        </Container>
      </section>

      {/* "Acompanhe" — prints das redes sociais, enviados pelo admin. */}
      {/* Sem margem no topo: encosta direto no fim da seção do vídeo. */}
      <section className="relative overflow-hidden bg-tint pb-14 pt-10 lg:pb-20 lg:pt-12">
        <BlobDepoimentos pathId="blob-acompanhe" fill="#d9c9e6" manterProporcao deslocamentoX={-60} />

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
