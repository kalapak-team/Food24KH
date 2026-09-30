"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";

export function Rail({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) =>
    scrollerRef.current?.scrollBy({ left: direction * scrollerRef.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="mt-10" aria-label={title}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[1.7rem]">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} left`}
            className="hidden h-10 w-10 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary sm:grid"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} right`}
            className="hidden h-10 w-10 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary sm:grid"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
      <div ref={scrollerRef} className="no-scrollbar -mx-1.5 flex snap-x gap-4 overflow-x-auto px-1.5 pt-1.5 pb-2">
        {children}
      </div>
    </section>
  );
}
