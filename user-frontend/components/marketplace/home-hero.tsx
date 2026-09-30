"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useT } from "@/lib/i18n";

type HomeHeroProps = {
  dishCount?: number;
};

export function HomeHero({ dishCount = 1000 }: HomeHeroProps) {
  const t = useT();

  return (
    <section className="relative isolate min-h-[min(72vh,34rem)] w-full overflow-hidden bg-primary text-white">
      <Image
        src="/hero/khmer-feast.webp"
        alt="Khmer feast — amok, lok lak, herbs and fresh dishes ready to order"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] motion-safe:animate-hero-zoom"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-[#00004f]/92 via-[#00008B]/72 to-[#00008B]/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[#00004f]/55 via-transparent to-[#00004f]/30"
      />

      <div className="relative mx-auto flex min-h-[min(72vh,34rem)] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-xl motion-safe:animate-hero-rise">
          <Logo inverted size="lg" className="mb-5 drop-shadow-sm" />
          <h1 className="font-display text-[2rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">{t("heroText")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center rounded-full bg-secondary px-7 text-sm font-bold text-slate-950 transition hover:brightness-95 motion-safe:hover:scale-[1.02]"
            >
              {t("heroCta")}
            </Link>
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-full border border-white/45 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 motion-safe:hover:scale-[1.02]"
            >
              {t("heroBrowse").replace("{count}", String(dishCount || 1000))}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
