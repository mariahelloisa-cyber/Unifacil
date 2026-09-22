import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export default function Footer() {
  const navCols = [
    {
      title: "Cursos",
      links: [
        { label: "Cursos", href: "/matricula" },
        { label: "Matricule-se", href: "/inscricao" },
        { label: "Simule seu desconto", href: "/inscricao?modo=simulacao" },
      ],
    },
    {
      title: "Institucional",
      links: [
        { label: "Por que a UniFácil?", href: "/institucional" },
        { label: "Contato", href: "/contato" },
      ],
    },
  ];

  return (
    <footer className="text-white">
      {/* Faixa superior — atendimento + CTA + redes */}
      <div className="bg-navy-950">
        <div className="container-x flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
            <Image
              src="/images/logobranca-corte.png"
              alt="Universidade Fácil"
              width={1200}
              height={416}
              className="h-10 w-auto"
            />
            <div className="sm:border-l sm:border-white/20 sm:pl-10">
              <p className="text-[15px] font-bold">Central de Atendimento</p>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-center gap-2.5 font-display text-2xl font-extrabold hover:text-gold"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3-.7-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2.1c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c0 .1.1.3 0 .4l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.8-1c.2-.2.3-.2.5-.1l1.8.8c.2.1.4.2.4.3v.8Z" />
                  </svg>
                </span>
                {SITE.whatsappDisplay}
              </a>
              <p className="mt-1 text-[13px] text-sky-300">Segunda a sexta, das 8h às 18h</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/inscricao"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Encontre seu curso
              <svg width="19" height="14" viewBox="0 0 20 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Universidade Fácil"
              className="hover:text-gold"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.9" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
                <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Faixa inferior — navegação + área do estudante */}
      <div className="bg-navy-800">
        <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {navCols.map((col) => (
            <div key={col.title}>
              <h3 className="text-[15px] font-bold">{col.title}</h3>
              <ul className="mt-4">
                {col.links.map((l) => (
                  <li key={l.href} className="border-b border-white/15">
                    <Link href={l.href} className="block py-3 text-[15px] text-sky-100 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-xl font-extrabold">Área do estudante</h3>
            <a
              href={SITE.ava}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-full bg-sky-200 py-3.5 text-center font-bold text-navy-900 transition-colors hover:bg-white"
            >
              Portal do Aluno (AVA)
            </a>
            <Link
              href="/contato"
              className="mt-3 block rounded-full bg-white/15 py-3.5 text-center font-bold text-white transition-colors hover:bg-white/25"
            >
              Secretaria e documentos
            </Link>
          </div>

          <div>
            <h3 className="text-[15px] font-bold">Contato</h3>
            <address className="mt-4 space-y-2.5 text-[14px] not-italic leading-relaxed text-sky-100">
              <p>{SITE.address}</p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </p>
              <p>CNPJ {SITE.cnpj}</p>
            </address>
          </div>
        </div>

        <div className="container-x border-t border-white/15 py-6">
          <p className="text-[12px] text-sky-200">
            © {new Date().getFullYear()} {SITE.name} · {SITE.slogan}
          </p>
        </div>
      </div>
    </footer>
  );
}
