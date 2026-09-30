import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs tracking-[0.22em] text-gold-text uppercase">{eyebrow}</p>
        <h2 className="mt-2 text-4xl text-foreground sm:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-sm tracking-[0.12em] text-burgundy uppercase underline-offset-8 hover:underline">
          {linkLabel ?? "View all"}
        </Link>
      )}
    </div>
  );
}
