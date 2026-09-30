import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/orders", "/profile", "/favorites", "/login", "/register", "/search"],
    },
    sitemap: `${appConfig.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
