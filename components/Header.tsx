"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CourseNivel } from "@/lib/data/courses";

const mainLinks = [{ label: "Por que a UniFácil?", href: "/institucional" }];

const ingressarLinks = [
  { label: "Matrícula", href: "/matricula" },
  { label: "Bolsas", href: "/bolsas" },
];

type NavLink = { label: string; href: string };


function NavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [pill, setPill] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setPill(null);
      }}
    >
      <button
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-[9px] py-2.5 text-[13px] font-semibold uppercase transition-colors duration-200 ${
          open ? "text-gold" : "text-navy-800 hover:text-gold"
        }`}
      >
        {label}
        <svg
          width="11"
          height="7"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* O pt-1.5 é a ponte de hover: o cursor nunca atravessa um vão
          entre o botão e o painel, então o menu não pisca no caminho. */}
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 pt-1.5"
        style={{
          visibility: open ? "visible" : "hidden",
          /* A visibilidade só comuta no fim do fechamento, para o fade
             de saída não ser cortado. */
          transition: open ? "visibility 0s" : "visibility 0s 180ms",
        }}
      >
        {/* A animação fica no painel, e não no wrapper, para o translate
            da abertura não brigar com o -translate-x-1/2 que centraliza. */}
        <div
          ref={panelRef}
          onMouseLeave={() => setPill(null)}
          className={`relative w-[186px] rounded-2xl border border-navy-950/5 bg-white p-2 text-navy-950 shadow-[0_10px_30px_rgba(31,15,43,0.13)] ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-[5px] opacity-0"
          }`}
          style={{
            /* Fecha um pouco mais rápido do que abre. */
            transition: open
              ? "opacity 200ms cubic-bezier(0.22,1,0.36,1), transform 200ms cubic-bezier(0.22,1,0.36,1)"
              : "opacity 180ms cubic-bezier(0.22,1,0.36,1), transform 180ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Camada única de realce: desliza e se redimensiona para
              abraçar exatamente a palavra sob o cursor. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-tint"
            style={{
              width: pill?.width ?? 0,
              height: pill?.height ?? 0,
              opacity: pill ? 1 : 0,
              transform: `translate(${pill?.left ?? 0}px, ${pill?.top ?? 0}px)`,
              transition:
                "transform 200ms cubic-bezier(0.22,1,0.36,1), width 200ms cubic-bezier(0.22,1,0.36,1), height 200ms cubic-bezier(0.22,1,0.36,1), opacity 160ms ease",
            }}
          />

          {/* A área de hover é o <a> inteiro; a pílula acompanha só o
              <span>, que é quem tem a largura do texto. */}
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => {
                const labelEl = labelsRef.current[i];
                const painel = panelRef.current;
                if (!labelEl || !painel) return;
                const el = labelEl.getBoundingClientRect();
                const p = painel.getBoundingClientRect();
                /* getBoundingClientRect parte da borda do painel, mas o
                   realce é posicionado a partir do padding box: descontar
                   a borda mantém os dois exatamente alinhados. */
                setPill({
                  left: el.left - p.left - painel.clientLeft,
                  top: el.top - p.top - painel.clientTop,
                  width: el.width,
                  height: el.height,
                });
              }}
              className="block px-1 py-1"
            >
              <span
                ref={(node) => {
                  labelsRef.current[i] = node;
                }}
                className="relative inline-block rounded-full px-3 py-1.5 text-[14px] font-bold"
              >
                {l.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Header no formato do site original (universidadefacil.com.br): faixa
   branca com a logo colorida grande, o menu no meio (13px, maiúsculas, roxo
   com hover amarelo) e o Matricule-se, entre duas faixas roxas finas — a de
   cima é a AnnouncementBar. Ao rolar, a faixa branca
   encolhe para o header fixo não tomar a tela. */
export default function Header({ courseNiveis }: { courseNiveis: CourseNivel[] }) {
  const courseLinks = courseNiveis.map((n) => ({ label: n.nome, href: `/${n.slug}` }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`transition-shadow duration-300 ${scrolled ? "shadow-[0_8px_28px_rgba(31,15,43,0.18)]" : ""}`}>
      {/* ---------- Faixa branca: logo + Matricule-se ---------- */}
      <div className="bg-white">
        <div className="container-x flex h-[64px] items-center justify-between gap-4 lg:h-[72px]">
          <Link href="/" className="shrink-0" aria-label="Universidade Fácil — página inicial">
            <Image
              src="/images/logo-horizontal.png"
              alt="Universidade Fácil"
              width={1200}
              height={416}
              priority
              className="h-[42px] w-auto lg:h-[50px]"
            />
          </Link>

          <nav aria-label="Menu principal" className="hidden flex-1 items-center justify-center gap-x-[2px] lg:flex">
            <NavDropdown label="Cursos" links={courseLinks} />
            <NavDropdown label="Ingressar" links={ingressarLinks} />
            {mainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-[9px] py-2.5 text-[13px] font-semibold uppercase text-navy-800 transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/inscricao"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-accent-hover sm:gap-2.5 sm:px-6 sm:text-[15px]"
            >
              Matricule-se
              <svg width="18" height="14" viewBox="0 0 20 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Mobile: o menu roxo não aparece; abre pelo hambúrguer. */}
            <button
              className="-mr-1 p-2 text-navy-800 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 6.5h18M3 12h18M3 17.5h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Borda roxa de baixo (como no site original) ---------- */}
      <div aria-hidden className="h-[26px] bg-navy-800" />

      {/* ---------- Menu mobile (tela cheia) ---------- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-navy-800 text-white lg:hidden">
          <div className="container-x flex h-[64px] items-center justify-end">
            <button className="-mr-1 p-2" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="container-x flex flex-col pb-8">
            <span className="t-label mb-1 uppercase text-gold">Cursos</span>
            {courseLinks.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/15 py-4 text-lg font-bold"
              >
                {c.label}
              </Link>
            ))}
            <span className="t-label mb-1 mt-5 uppercase text-gold">Ingressar</span>
            {ingressarLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/15 py-4 text-lg font-bold"
              >
                {l.label}
              </Link>
            ))}
            {mainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="mt-2 border-b border-white/15 py-4 text-lg font-bold"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/inscricao"
              onClick={() => setMenuOpen(false)}
              className="mt-7 rounded-full bg-gold py-3.5 text-center font-bold text-navy-950"
            >
              Matricule-se
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
