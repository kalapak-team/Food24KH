"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { cities } from "@/lib/data";
import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const t = useT();
  const links = [
    { href: "/info/about", label: t("about") },
    { href: "/info/help", label: t("help") },
    { href: "/partner", label: t("becomePartner") },
    { href: "/info/terms", label: t("terms") },
    { href: "/info/privacy", label: t("privacy") },
    { href: "/shops", label: t("shops") },
  ];

  return (
    <footer className="mt-16 bg-[#F2A71E] text-primary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary/80">{t("footerAbout")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
                {t("availableCities")}
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-primary/90">
                {cities.map((city) => (
                  <li key={city}>{city}</li>
                ))}
              </ul>
            </div>
            <nav aria-label="Footer">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-primary">Food24KH</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-primary/90 underline-offset-4 hover:text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-primary/20 pt-6 text-xs text-primary/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Food24KH. All rights reserved.</p>
          <p>Made for Cambodia · English & ខ្មែរ · USD & KHR</p>
        </div>
      </div>
    </footer>
  );
}
