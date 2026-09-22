import Image from "next/image";
import Container from "./Container";
import BlobDepoimentos from "./BlobDepoimentos";
/* Composição da esquerda (aluna + janela de atendimento). Recorte feito a
   partir de contato2.png, que veio em alta com o fundo azul embutido. */
import contato from "@/app/assets/contato-recorte.png";

/** Hero da página de contato: azul, com a aluna à esquerda e a chamada à
 *  direita. Sem botão — o formulário e os canais vêm logo abaixo. */
export default function ContatoHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <BlobDepoimentos fill="#6a4287" manterProporcao />

      <Container className="relative z-10 grid items-center gap-8 py-12 lg:grid-cols-[46%_1fr] lg:gap-4 lg:py-0">
        {/* Puxada para fora da margem do container: a aluna encosta na borda
            esquerda da tela, como na referência. */}
        <div className="relative h-[300px] lg:-ml-12 lg:h-[480px] xl:-ml-24">
          <Image
            src={contato}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-contain object-bottom lg:object-left-bottom"
          />
        </div>

        <div className="lg:py-16">
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-gold">
            Fale com a gente
          </span>
          <h1 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Tem alguma dúvida?
            <br />
            Estamos aqui para ajudar!
          </h1>
          <p className="mt-5 max-w-[52ch] text-[15px] font-semibold leading-relaxed text-white/90">
            Nossa equipe está pronta para te atender e tirar todas as suas dúvidas sobre os cursos,
            as bolsas, os descontos e tudo o que você precisa saber para começar a estudar.
          </p>
        </div>
      </Container>
    </section>
  );
}
