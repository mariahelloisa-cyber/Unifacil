import Link from "next/link";
import type { ReactNode } from "react";
import { AdminIcon } from "./adminIcons";

/** Paleta dos badges de ícone — mesma lógica da referência: cada card com
 *  sua cor, pra dar leitura rápida no meio da grade. */
export const badgeCores: Record<string, string> = {
  azul: "bg-accent text-white",
  indigo: "bg-[#6366f1] text-white",
  verde: "bg-[#16a34a] text-white",
  amarelo: "bg-[#eab308] text-white",
  rosa: "bg-rose text-white",
  navy: "bg-navy-800 text-white",
};

export function PageHeader({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <AdminIcon name={icon} size={21} />
        </span>
        <div>
          <h1 className="text-[22px] font-bold leading-tight text-navy-950">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
  icon,
  cor = "azul",
}: {
  label: string;
  value: number | string;
  note?: string;
  icon: string;
  cor?: keyof typeof badgeCores;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-navy-950/5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase leading-tight tracking-wider text-muted">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${badgeCores[cor]}`}>
          <AdminIcon name={icon} size={17} />
        </span>
      </div>
      <p className="mt-3 text-[34px] font-extrabold leading-none text-navy-950">{value}</p>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </div>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-hover"
    >
      {children}
    </Link>
  );
}

export function ListCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-navy-950/5 sm:p-6">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function EditIconLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
    >
      <AdminIcon name="editar" size={16} />
    </Link>
  );
}

export function Chip({ children, cor = "cinza" }: { children: ReactNode; cor?: "cinza" | "azul" | "amarelo" }) {
  const cores = {
    cinza: "bg-surface text-muted",
    azul: "bg-accent-soft text-accent",
    amarelo: "bg-[#fef3c7] text-[#92400e]",
  };
  return (
    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${cores[cor]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-navy-950/10 px-5 py-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}
