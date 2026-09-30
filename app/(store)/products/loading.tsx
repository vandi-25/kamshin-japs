export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16" aria-busy="true" aria-label="Loading fragrances">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-12 w-72 animate-pulse rounded bg-muted" />
      <div className="mt-10 h-20 animate-pulse rounded-md bg-muted" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
