import Image from "next/image";
import conversa from "@/app/assets/conversa.webp";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/constants";

/* Faixa de atendimento: foto sangrando na largura toda, com a pessoa à direita,
   e à esquerda um degradê escuro com o texto centralizado na coluna — título
   grande, linha de apoio, botão do WhatsApp e o card com o QR Code que abre a
   mesma conversa pelo celular. */
export default function AtendimentoConsultores() {
  return (
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-black lg:min-h-[560px]">
      {/* O celular com a conversa fica em ~62–82% da largura da foto: o
          recorte puxa para esse lado para ele não sumir em telas estreitas. */}
      <Image
        src={conversa}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover object-[72%_center]"
      />
      {/* Preto (não o roxo da marca), forte à esquerda onde fica o texto e
          quase limpo à direita, para a foto aparecer. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />
      {/* No mobile o texto ocupa a largura toda: escurece a foto inteira. */}
      <div className="absolute inset-0 -z-10 bg-black/40 lg:hidden" />

      <div className="container-x w-full py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto flex max-w-[600px] flex-col items-center text-center lg:mx-0">
            <h2
              className="font-display font-extrabold leading-[1.02] tracking-[-0.04em] text-gold-soft"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Nossos consultores estão aqui por você
            </h2>

            <p className="mt-6 max-w-[440px] font-display text-[clamp(1.2rem,2vw,1.6rem)] font-bold leading-snug text-gold-soft">
              Atendimento rápido e fácil para tirar todas as suas dúvidas!
            </p>

            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-w-[280px] items-center justify-center rounded-full bg-accent px-8 py-3.5 text-lg font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Falar com um consultor
            </a>

            {/* QR só a partir de md: no celular a pessoa já está no aparelho,
                e o botão acima abre a conversa direto. */}
            <div className="mt-5 hidden max-w-[410px] items-center gap-5 rounded-[12px] bg-accent px-6 py-5 text-left md:flex">
              <span className="shrink-0 rounded-[6px] bg-white p-1.5">
                <Image
                  src="/images/qr-whatsapp.png"
                  alt={`QR Code para conversar pelo WhatsApp ${SITE.whatsappDisplay}`}
                  width={400}
                  height={400}
                  sizes="72px"
                  className="h-[72px] w-[72px]"
                />
              </span>
              <p className="text-[15px] font-medium leading-snug text-white">
                Aponte a câmera do seu celular para o QR Code ao lado e fale com um consultor no WhatsApp.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
