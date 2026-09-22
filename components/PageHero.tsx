import { ReactNode } from "react";
import Image from "next/image";

export default function PageHero({
  eyebrow,
  title,
  description,
  art = "campus",
  imageUrl,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  art?: string;
  /** URL de imagem real (ex.: enviada pelo admin) — quando presente, substitui a arte de `art`. */
  imageUrl?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[340px] flex-col justify-center overflow-hidden bg-navy-950 lg:min-h-[420px]">
      <Image src={imageUrl || `/images/art/${art}.svg`} alt="" fill priority className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/45" />

      <div className="container-x py-14 lg:py-20">
        {eyebrow && (
          <span className="t-label mb-5 inline-block rounded-full bg-white/12 px-4 py-1.5 uppercase text-sky-300">
            {eyebrow}
          </span>
        )}
        <h1 className="t-h2 max-w-4xl text-white">{title}</h1>
        {description && (
          <p className="t-lead mt-5 max-w-2xl text-sky-200">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
