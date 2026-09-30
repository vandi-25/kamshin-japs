import { Wordmark } from "@/components/brand/wordmark";
import { BottleArt } from "@/components/store/bottle-art";

/** Split layout for sign-in / sign-up: brand panel + form. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-0 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-l-md bg-burgundy p-10 text-ivory lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_70%,rgba(212,175,55,0.2),transparent_60%)]" />
        <Wordmark tone="ivory" className="relative" />
        <div className="relative mx-auto h-64 w-40">
          <BottleArt tone="#8c2f45" shape="round" />
        </div>
        <p className="relative font-serif text-3xl leading-snug italic">
          &ldquo;A fragrance is the most intense form of memory.&rdquo;
        </p>
      </div>
      <div className="rounded-md border bg-card p-6 sm:p-10 lg:rounded-l-none lg:border-l-0">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
