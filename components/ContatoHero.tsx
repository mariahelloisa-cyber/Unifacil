import Container from "./Container";
import BlobDepoimentos from "./BlobDepoimentos";

/** Hero da página de contato: roxo, com a chamada à direita. Sem botão — o
 *  formulário e os canais vêm logo abaixo. */
export default function ContatoHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <BlobDepoimentos fill="#6a4287" manterProporcao />

      <Container className="relative z-10 grid items-center gap-8 py-12 lg:grid-cols-[46%_1fr] lg:gap-4 lg:py-0">
        {/* Coluna da esquerda vazia (era a foto): segura a chamada no lugar
            dela à direita e a altura da faixa no desktop. */}
        <div aria-hidden className="hidden lg:block lg:h-[480px]" />

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
