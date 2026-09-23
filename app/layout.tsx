import type { Metadata } from "next";
import { Archivo, Anton } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getCourseNiveis } from "@/lib/data/courses";

/* Archivo: grotesca de traços retos, sem o desenho circular da Poppins. Fonte
   variável (100–900), então cobre do font-light ao font-extrabold. */
const bodyFont = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Archivo({
  variable: "--font-heading",
  subsets: ["latin"],
});

/* Anton: condensada e bem preta, pro efeito "cartaz" dos quadros de
   destaque (ex.: "Conheça a nossa história"). */
const displayFont = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Universidade Fácil — Transformando vidas com educação acessível para todos",
    template: "%s — Universidade Fácil",
  },
  description:
    "Programa social de bolsas de estudo: bolsas de 100% para alunos de baixa renda e descontos de até 80% em cursos profissionalizantes, EJA, técnicos, graduações e pós-graduações de instituições reconhecidas pelo MEC.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const courseNiveis = await getCourseNiveis();

  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-ink">
        <SiteChrome courseNiveis={courseNiveis}>{children}</SiteChrome>
      </body>
    </html>
  );
}
