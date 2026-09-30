"use client";

import { Bell, CreditCard, Heart, MapPin, Receipt, Settings, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
  { href: "/orders", label: "Orders", icon: Receipt },
  { href: "/favorites", label: "Favourites", icon: Heart },
  { href: "/profile/settings", label: "Language & currency", icon: Settings },
  { href: "/profile/settings#payments", label: "Payments", icon: CreditCard },
  { href: "/profile/settings#notifications", label: "Notifications", icon: Bell },
  { href: "/profile/settings#security", label: "Security", icon: ShieldCheck },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account sections" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:px-0">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-11 shrink-0 items-center gap-3 rounded-xl px-4 text-sm font-semibold",
              active ? "bg-primary text-white" : "bg-card ring-1 ring-border hover:ring-primary lg:bg-transparent lg:ring-0 lg:hover:bg-primary-soft"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
