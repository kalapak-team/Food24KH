"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type VisualTileProps = {
  emoji: string;
  tint: [string, string];
  imageUrl?: string | null;
  className?: string;
  emojiClassName?: string;
  label?: string;
  /** logo = padded brand mark; photo = product/cover photo */
  fit?: "logo" | "photo";
};

export function VisualTile({ emoji, tint, imageUrl, className, emojiClassName, label, fit = "photo" }: VisualTileProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && imageUrl !== failedSrc;

  if (showImage && imageUrl) {
    return (
      <div
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn("relative overflow-hidden bg-white", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={label ?? ""}
          className={cn("h-full w-full object-contain", fit === "logo" ? "p-6 sm:p-8" : "p-2")}
          onError={() => setFailedSrc(imageUrl)}
        />
      </div>
    );
  }

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative grid place-items-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${tint[0]}, ${tint[1]})` }}
    >
      <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <span className="absolute -bottom-10 -right-4 h-32 w-32 rounded-full bg-white/10" />
      <span className={cn("relative text-5xl drop-shadow-lg", emojiClassName)}>{emoji}</span>
    </div>
  );
}
