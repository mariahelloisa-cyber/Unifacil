"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CourseNivel } from "@/lib/data/courses";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

/* Páginas em que o header some ao rolar para baixo e volta ao rolar para cima
   (ou ao chegar perto do topo). Nas demais ele continua sempre fixo. */
const HEADER_AUTO_ESCONDE = ["/institucional"];

/* Folga de rolagem antes de trocar de estado — sem ela, o tremor do trackpad
   faria o header piscar. E perto do topo ele fica sempre visível. */
const LIMIAR = 6;
const TOPO = 80;

function useHeaderEscondido(ativo: boolean) {
  const [escondido, setEscondido] = useState(false);

  useEffect(() => {
    if (!ativo) return;

    let ultimoY = window.scrollY;
    let quadro = 0;

    const atualizar = () => {
      quadro = 0;
      const y = window.scrollY;
      const delta = y - ultimoY;

      if (y < TOPO) {
        setEscondido(false);
        ultimoY = y;
      } else if (Math.abs(delta) > LIMIAR) {
        setEscondido(delta > 0);
        ultimoY = y;
      }
    };

    // Um cálculo por quadro, no máximo, por mais eventos de scroll que cheguem.
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, [ativo]);

  // Ao sair da página com o header escondido, ele volta sem depender do efeito.
  return ativo && escondido;
}

// O painel /admin tem seu próprio chrome (sidebar) — sem header/footer/
// anúncio do site institucional.
export default function SiteChrome({
  children,
  courseNiveis,
}: {
  children: ReactNode;
  courseNiveis: CourseNivel[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const autoEsconde = HEADER_AUTO_ESCONDE.includes(pathname ?? "");
  const escondido = useHeaderEscondido(autoEsconde);

  if (isAdmin) {
      return <>{children}</>;
  }

  return (
    <>
      {/* data-site-chrome: animações com pin medem a altura daqui.
          data-auto-esconde avisa o ScrollLink de que, rolando para baixo, o
          header vai sumir. focus-within: navegando pelo teclado, o header
          reaparece ao receber o foco mesmo estando escondido. */}
      <div
        className={`sticky top-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:translate-y-0 motion-reduce:transition-none ${
          escondido ? "-translate-y-full" : ""
        }`}
        data-site-chrome
        data-auto-esconde={autoEsconde ? "" : undefined}
      >
        <AnnouncementBar />
        <Header courseNiveis={courseNiveis} />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
