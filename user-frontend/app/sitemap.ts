import type { MetadataRoute } from "next";
import { appConfig } from "@/lib/config";
import { cuisines, foods, restaurants } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appConfig.siteUrl.replace(/\/$/, "");
  const staticPaths = ["", "/pickup", "/shops", "/restaurants", "/partner", "/info/about", "/info/help", "/info/terms", "/info/privacy"];
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: "daily" as const, priority: path === "" ? 1 : 0.7 })),
    ...restaurants.map((restaurant) => ({ url: `${base}/restaurants/${restaurant.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...cuisines.map((cuisine) => ({ url: `${base}/categories/${cuisine.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...foods.map((food) => ({ url: `${base}/foods/${food.id}`, changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
