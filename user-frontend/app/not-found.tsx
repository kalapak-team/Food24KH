import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <EmptyState emoji="🥡" title="Page not found" text="We couldn't find what you were looking for. It may have moved or no longer exists." actionLabel="Back to home" actionHref="/" />
    </div>
  );
}
