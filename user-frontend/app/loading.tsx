export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading">
      <div className="h-40 animate-pulse rounded-3xl bg-border/60" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[16/10] animate-pulse rounded-2xl bg-border/60" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-border/60" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-border/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
