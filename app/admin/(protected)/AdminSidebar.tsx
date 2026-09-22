"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AdminIcon } from "./adminIcons";
import { logout } from "./actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/matriculas", label: "Matrículas", icon: "matriculas" },
  { href: "/admin/cursos", label: "Cursos", icon: "cursos" },
  { href: "/admin/cursos/niveis", label: "Categoria", icon: "niveis" },
  { href: "/admin/midia/home-video", label: "Vídeo da Home", icon: "video" },
  { href: "/admin/midia/redes-sociais", label: "Redes Sociais", icon: "imagem" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname() ?? "";

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    // "Cursos" não pode ficar aceso quando estamos dentro de "Níveis de curso".
    if (href === "/admin/cursos") {
      return pathname === "/admin/cursos" ||
        (pathname.startsWith("/admin/cursos/") && !pathname.startsWith("/admin/cursos/niveis"));
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    /* Gruda na tela: o painel rola, o menu fica. O que não couber na altura
       da janela rola dentro da própria barra. */
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col self-start overflow-y-auto bg-navy-950 text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image src="/images/logo-mark.png" alt="" width={44} height={44} className="h-7 w-7 object-contain" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold leading-tight">Universidade Fácil</span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-300">
            Painel administrativo
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-colors ${
                active
                  ? "bg-accent text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <AdminIcon name={item.icon} size={19} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="truncate text-xs text-white/45">{email}</p>
        <form action={logout}>
          <button
            type="submit"
            className="mt-2 flex items-center gap-2.5 text-sm font-bold text-sky-300 transition-colors hover:text-white"
          >
            <AdminIcon name="sair" size={17} />
            Sair do painel
          </button>
        </form>
      </div>
    </aside>
  );
}
