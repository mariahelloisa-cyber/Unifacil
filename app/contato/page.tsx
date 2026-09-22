import type { Metadata } from "next";
import Container from "@/components/Container";
import ContatoHero from "@/components/ContatoHero";
import ContatoForm from "@/components/ContatoForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Universidade Fácil: endereço, e-mail, WhatsApp e formulário de contato.",
};

export default function ContatoPage() {
  return (
    <>
      <ContatoHero />

      <section className="section-y bg-white">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-h2 text-navy-950">Informações de contato</h2>
            <dl className="mt-8 space-y-5 text-[15px]">
              <div>
                <dt className="font-bold text-navy-950">Endereço</dt>
                <dd className="mt-1 text-muted">{SITE.address}</dd>
              </div>
              <div>
                <dt className="font-bold text-navy-950">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SITE.email}`} className="font-semibold text-sky-600 underline underline-offset-4 hover:text-accent">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-navy-950">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-600 underline underline-offset-4 hover:text-accent">
                    {SITE.whatsappDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-navy-950">Instagram</dt>
                <dd className="mt-1">
                  <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-600 underline underline-offset-4 hover:text-accent">
                    @{SITE.instagram.split("/").filter(Boolean).pop()}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10 overflow-hidden rounded-2xl">
              <iframe
                title="Localização Universidade Fácil"
                src="https://www.google.com/maps?q=R.+Formosa,+75+-+S%C3%A3o+Paulo+-+SP,+01049-000&output=embed"
                width="100%"
                height="260"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h2 className="t-h2 text-navy-950">Envie uma mensagem</h2>
            <div className="mt-8">
              <ContatoForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
