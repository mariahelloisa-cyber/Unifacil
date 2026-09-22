"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "./Container";

/** Hero das páginas de categoria (/[nivel]) — inspirada na hero de
 *  universidadefacil.com.br/curso-especifico/eja/: fundo em foto com
 *  tinta roxa e brilhos claros, texto e CTA à esquerda, personagem recortado bleedando por
 *  cima do texto à direita, entrada em cascata (rótulo → título → texto →
 *  personagem), cada um vindo de mais longe que o anterior. O
 *  conteúdo é o mesmo já usado no /[nivel] (nome/título/descrição da
 *  categoria) — só a composição visual mudou.
 *  Ativos fixos por pedido: matricula-hero.jpg no fundo, estudanteee-cutout.png
 *  na persona (estudanteee.avif enviado pelo usuário, com o fundo azul liso
 *  removido aqui — o recorte com transparência é o que este componente usa).
 *  A cascata usa a classe .rise do globals.css (mesma de IngressoCards/
 *  PhotoRail): um único observer libera .is-in e cada elemento sobe a
 *  distância (--rise) e no atraso (--delay) que definir — devagar (0.85s) e
 *  vindo de baixo, como pedido. */
/* Título em duas cores, como na referência: o nome da categoria em branco e
   o resto em amarelo ("Bacharelado" + " com até 80% de desconto"). Se o
   título não começar pelo nome, corta no " com "; sem nenhum dos dois,
   fica todo branco. */
function dividirTitulo(titulo: string, nome: string): [string, string] {
  if (nome && titulo.toLowerCase().startsWith(nome.toLowerCase()) && titulo.length > nome.length) {
    return [titulo.slice(0, nome.length), titulo.slice(nome.length)];
  }
  const corte = titulo.toLowerCase().indexOf(" com ");
  if (corte > 0) return [titulo.slice(0, corte), titulo.slice(corte)];
  return [titulo, ""];
}

export default function CategoryHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const state = shown ? "is-in" : "";
  const [branco, dourado] = dividirTitulo(title, eyebrow);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[440px] flex-col justify-center overflow-hidden bg-navy-950 lg:min-h-[500px]"
    >
      <Image src="/images/matricula-hero.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      {/* Tratamento da foto medido no Group-1.png da referência: um roxo
          profundo por cima de tudo (~#4B135E) e um brilho claro embaixo à
          esquerda. O brilho do alto à direita saiu — ficava atrás/por cima
          da persona, sem imagem para justificá-lo aqui. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#4b135e]/[0.86]" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(ellipse 30% 40% at 16% 100%, rgb(255 255 255 / 0.48), transparent 70%)",
        }}
      />

      <Container className="relative z-10 grid items-center gap-2 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:py-20">
        {/* ---------- Texto + CTA ----------
            A 2ª coluna do grid (lg:grid-cols-[1.15fr_0.85fr]) fica sem
            conteúdo de propósito: ela só reserva a faixa da direita livre
            para a persona (abaixo) bleedar por cima sem disputar espaço com
            o texto. */}
        <div className="lg:max-w-[560px] lg:pr-6">
          <span
            className={`rise ${state} block text-[13px] font-bold uppercase tracking-[0.22em] text-gold`}
            style={{ "--rise": "46px", "--delay": "0ms" } as React.CSSProperties}
          >
            {eyebrow}
          </span>

          <h1
            className={`rise ${state} t-h2 mt-4 text-white`}
            style={{ "--rise": "58px", "--delay": "120ms" } as React.CSSProperties}
          >
            {branco}
            {dourado && <span className="text-gold">{dourado}</span>}
          </h1>

          {description && (
            <p
              className={`rise ${state} t-lead mt-5 max-w-[52ch] text-sky-200`}
              style={{ "--rise": "68px", "--delay": "260ms" } as React.CSSProperties}
            >
              {description}
            </p>
          )}
        </div>
      </Container>

      {/* ---------- Persona ----------
          Fora do Container/grid de propósito: o Container fica centralizado
          pelo justify-center da seção (sobra espaço abaixo dele sempre que o
          texto é mais baixo que a hero), então encostar a figura na base
          DENTRO dele nunca toca a borda real da seção. Um irmão absolute
          inset-0 escapa desse centro e é posicionado direto contra a caixa
          da própria <section> — daí o bottom-0 aqui já ser a borda de baixo
          de verdade. object-contain + object-bottom ancoram o recorte na
          base em qualquer altura, sem esticar nem cortar a cabeça; a margem
          negativa no desktop puxa a figura por cima do fim do texto, como na
          referência. overflow-hidden na seção é a rede de segurança contra
          qualquer sobra horizontal. Entra por último e de mais longe. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <div className="container-x mx-auto flex h-full items-end justify-center lg:justify-end">
          <div
            className={`rise ${state} relative h-[320px] w-full max-w-[380px] sm:h-[380px] lg:h-[480px] lg:w-[40%] lg:max-w-[480px] lg:-ml-12 xl:h-[520px] xl:-ml-20`}
            style={{ "--rise": "100px", "--delay": "120ms" } as React.CSSProperties}
          >
            <Image
              src="/images/estudantehero.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 70vw, 40vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
