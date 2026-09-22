import Link from "next/link";
import Image from "next/image";

export default function SplitFeature({
  art,
  eyebrow,
  title,
  body,
  linkHref,
  linkLabel,
  badge,
  cards,
}: {
  art: string;
  eyebrow?: string;
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
  badge?: { top: string; big: string };
  cards?: { art: string; label: string }[];
}) {
  /* Um caminho absoluto (/images/foo.png) é usado como está; só o nome do
     arquivo continua sendo resolvido dentro de /images/art. */
  const src = (a: string) => (a.startsWith("/") ? a : `/images/art/${a}`);

  return (
    <section className="relative bg-tint-deep lg:grid lg:grid-cols-2">
      {/* Metade visual — sangra até a borda da viewport */}
      <div className="relative min-h-[238px] lg:min-h-[527px]">
        <Image
          src={src(art)}
          alt=""
          fill
          quality={95}
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {badge && (
          /* O selo é um PNG com transparência: object-contain preserva o recorte
             e o drop-shadow acompanha a silhueta (box-shadow desenharia um quadrado). */
          <Image
            src="/images/mec.png"
            alt={`${badge.top} ${badge.big}`}
            width={109}
            height={109}
            quality={95}
            sizes="109px"
            className="absolute right-5 top-[36%] hidden h-[109px] w-[109px] -translate-y-1/2 translate-x-1/2 object-contain drop-shadow-[0_8px_20px_rgba(31,15,43,0.28)] lg:block"
          />
        )}
      </div>

      {/* Metade conteúdo */}
      <div className="px-[var(--gutter)] py-12 lg:py-[68px] lg:pl-[82px] lg:pr-[max(var(--gutter),calc((100vw-var(--container))/2))]">
        <div className="max-w-[490px]">
          {eyebrow && (
            <span className="t-label mb-3.5 inline-block rounded-full bg-white px-3.5 py-1 uppercase text-navy-800">
              {eyebrow}
            </span>
          )}
          {/* Tipografia escalada em 85% localmente — .t-h2/.t-lead são globais. */}
          <h2 className="t-h2 text-navy-950" style={{ fontSize: "clamp(1.9125rem, 3.87vw, 3.453rem)" }}>
            {title}
          </h2>
          <p className="mt-5 text-[14px] font-semibold leading-[1.6] text-navy-900">{body}</p>

          {linkHref && linkLabel && (
            <Link
              href={linkHref}
              className="mt-6 inline-block text-[13px] font-bold text-navy-950 underline underline-offset-4 hover:opacity-70"
            >
              {linkLabel}
            </Link>
          )}

          {cards && (
            <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {cards.map((c) => (
                <div key={c.label} className="overflow-hidden rounded-[14px] bg-white">
                  <div className="relative h-[82px] sm:h-[95px]">
                    <Image src={src(c.art)} alt="" fill quality={95} className="object-cover" sizes="(max-width: 640px) 33vw, 180px" />
                  </div>
                  <p className="bg-accent px-2.5 py-2.5 text-center text-[11px] font-bold leading-tight text-white">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
