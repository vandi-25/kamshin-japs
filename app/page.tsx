import { Button } from "@/components/ui/button";

// Temporary Phase 1 placeholder; replaced by the storefront home in Phase 4.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Kamshin</h1>
      <p className="text-muted-foreground">
        Foundation is in place. The storefront arrives in Phase 4.
      </p>
      <Button disabled>Shop coming soon</Button>
    </main>
  );
}
