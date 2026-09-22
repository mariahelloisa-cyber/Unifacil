import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

const FEATURES = [
  {
    label: "Posts, banners e conteúdo do site em um só lugar",
    icon: (
      <path d="M6 3.5h12v17l-6-4-6 4v-17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
  },
  {
    label: "Alterações refletem no site na hora",
    icon: (
      <path d="M3 17 9.5 10.5 13.5 14.5 21 7M15 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: "Acesso restrito, protegido por login",
    icon: (
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
  },
];

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
  
      <div className="relative flex w-full flex-col justify-between overflow-hidden bg-navy-950 px-8 py-10 text-white sm:px-14 sm:py-12 lg:w-1/2">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative h-7 w-40 sm:h-8 sm:w-44">
          <Image
            src="/images/logobranca-corte.png"
            alt="Universidade Fácil"
            fill
            priority
            className="object-contain object-left"
          />
        </div>

        <div className="py-10 sm:py-0">
          <h1 className="max-w-md text-[2.25rem] font-extrabold leading-[1.15] tracking-tight text-white sm:max-w-lg sm:text-[2.75rem]">
            Gestão do conteúdo institucional em um só lugar.
          </h1>
          <ul className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    {f.icon}
                  </svg>
                </span>
                <span className="text-[14.5px] text-sky-100/90">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[13px] text-white/40">
          © {new Date().getFullYear()} Universidade Fácil. Todos os direitos reservados.
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-14 sm:px-10 lg:py-16">
        <LoginForm />
      </div>
    </div>
  );
}
