import { cn } from "@/lib/utils";

/** Text logo until a real one exists: spaced serif caps with a small gold diamond. */
export function Wordmark({ className, tone = "burgundy" }: { className?: string; tone?: "burgundy" | "ivory" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-serif text-2xl font-semibold tracking-[0.28em] uppercase",
        tone === "ivory" ? "text-ivory" : "text-burgundy",
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 fill-gold">
        <path d="M5 0 10 5 5 10 0 5Z" />
      </svg>
      Kamshin
    </span>
  );
}
