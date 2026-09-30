import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  emoji: string;
  title: string;
  text?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
};

export function EmptyState({ emoji, title, text, actionLabel, actionHref, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="text-5xl" aria-hidden>
        {emoji}
      </span>
      <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
      {text && <p className="mt-2 max-w-sm text-sm text-muted">{text}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
