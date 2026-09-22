import Container from "./Container";

const ITENS = [
  {
    titulo: "Videoaulas",
    texto: "Você terá acesso a videoaulas em Full HD, cobrindo todos os temas presentes na grade curricular do curso.",
    icone: <IconeRelogio />,
  },
  {
    titulo: "Tutoria e suporte",
    texto:
      "Você terá o suporte da nossa equipe do início ao fim do curso, podendo esclarecer todas as suas dúvidas e receber auxílio com a plataforma.",
    icone: <IconeTutor />,
  },
  {
    titulo: "Material didático",
    texto: "Você terá acesso aos materiais de apoio em PDF, podendo baixá-los a qualquer momento.",
    icone: <IconeMaterial />,
  },
  {
    titulo: "Avaliação",
    texto: "Você poderá testar seus conhecimentos por meio de uma avaliação baseada no conteúdo estudado.",
    icone: <IconeMochila />,
  },
];

/** "O que você receberá ao adquirir o curso" — 4 cards com ícone, título e
 *  texto; a mesma seção usada na página do curso (antes do footer) e na de
 *  matrícula (abaixo de "Escolha por categoria"). */
export default function BeneficiosCurso() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <Container>
        <h2 className="text-center text-[22px] font-extrabold uppercase leading-tight text-accent sm:text-[28px]">
          O que você receberá ao adquirir o curso
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITENS.map((item) => (
            <div
              key={item.titulo}
              className="rounded-2xl border border-accent/25 border-b-[6px] border-b-accent bg-white p-6 text-center"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center text-accent">{item.icone}</span>
              <h3 className="mt-4 text-[17px] font-extrabold uppercase text-accent">{item.titulo}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{item.texto}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function IconeRelogio() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12.5" r="8.5" />
      <path d="M12 8v4.5l3 2" />
      <path d="M9 2h6M18.5 4.5l1.3-1.3" />
    </svg>
  );
}

function IconeTutor() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="4" width="19" height="13" rx="1.6" />
      <path d="M8.5 21h7M12 17v4" />
      <circle cx="12" cy="9" r="2" />
      <path d="M8.5 14c.6-1.8 2-2.7 3.5-2.7s2.9.9 3.5 2.7" />
    </svg>
  );
}

function IconeMaterial() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3.5h8a1.6 1.6 0 0 1 1.6 1.6V19a1.6 1.6 0 0 1-1.6 1.6H7A1.6 1.6 0 0 1 5.4 19V5.1A1.6 1.6 0 0 1 7 3.5Z" />
      <path d="M9.5 3.5v2.4h5V3.5" />
      <path d="m8.3 10.3 1.1 1.1 2-2.2M8.3 15l1.1 1.1 2-2.2" />
      <path d="M13.3 10.7h3M13.3 15.4h3" />
    </svg>
  );
}

function IconeMochila() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 8V5.5a3 3 0 0 1 6 0V8" />
      <rect x="4.5" y="8" width="15" height="13" rx="2.6" />
      <path d="M9 8v3.5c0 1 .9 1.8 1.9 1.8h2.2c1 0 1.9-.8 1.9-1.8V8" />
      <path d="M8.5 16.5h7" />
    </svg>
  );
}
