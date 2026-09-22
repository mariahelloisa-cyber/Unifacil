import Link from "next/link";

export default function SectionHeading({
  title,
  description,
  linkHref,
  linkLabel,
  dark = false,
}: {
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className={`t-h2 ${dark ? "text-white" : "text-navy-950"}`}>{title}</h2>
        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className={`text-sm font-bold underline underline-offset-4 transition-opacity hover:opacity-70 ${
              dark ? "text-white" : "text-navy-950"
            }`}
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {description && (
        <p className={`t-lead mt-5 max-w-3xl ${dark ? "text-sky-200" : "text-navy-800"}`}>{description}</p>
      )}
    </div>
  );
}
