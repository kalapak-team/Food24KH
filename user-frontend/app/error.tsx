"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
        <span className="text-5xl" aria-hidden>
          😕
        </span>
        <h1 className="mt-4 font-display text-xl font-bold">Something went wrong.</h1>
        <p className="mt-2 text-sm text-muted">Please try again. If the problem continues, refresh the page.</p>
        <button type="button" onClick={reset} className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark">
          Try again
        </button>
      </div>
    </div>
  );
}
