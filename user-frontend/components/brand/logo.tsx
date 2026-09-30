import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  inverted?: boolean;
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
};

const imageClass = {
  sm: "h-7 sm:h-8",
  md: "h-8 sm:h-10",
  lg: "h-12 sm:h-14",
} as const;

export function Logo({ className, inverted = false, variant = "full", size = "md" }: LogoProps) {
  // Use the approved PNG lockups (transparent for light UI, light version for dark footer)
  const src = inverted ? "/brand/logo-on-dark.png" : "/brand/logo-transparent.png";

  return (
    <Link href="/" aria-label="Food24KH home" className={cn("inline-flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Food24KH — Fast · Fresh · For You"
        className={cn("w-auto object-contain object-left", imageClass[size], variant === "mark" && "aspect-square max-w-[2.5rem] object-left")}
      />
    </Link>
  );
}
