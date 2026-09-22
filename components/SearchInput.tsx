"use client";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Procure o curso ideal pra você!",
  label = "Buscar curso",
  className = "",
  compacta = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  /* Versão menor, do catálogo com filtros (/matricula). */
  compacta?: boolean;
}) {
  return (
    <label className={`relative block w-full shrink-0 ${compacta ? "sm:w-[320px]" : "sm:w-[380px]"} ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-[30px] border border-black bg-white pl-6 pr-14 font-semibold text-black outline-none transition-colors focus:border-accent ${
          compacta ? "h-[44px] text-[13px] placeholder:text-black" : "h-[55px] text-[15px] placeholder:text-black/55"
        }`}
      />
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-black"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
        <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </label>
  );
}
