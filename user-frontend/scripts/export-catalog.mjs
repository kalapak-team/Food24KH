// Exports the development catalogue in lib/data.ts to backend/db/seeds/catalog.json
// so the Rails seeds load exactly the data the customer site shows.
// Usage: npm run export:catalog

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "lib", "data.ts"), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});

const tempFile = join(root, "scripts", ".catalog.tmp.mjs");
writeFileSync(tempFile, outputText);
try {
  const data = await import(pathToFileURL(tempFile).href);
  const catalog = {
    cuisines: data.cuisines,
    shopTypes: data.shopTypes,
    cities: data.cities,
    restaurants: data.restaurants,
    foods: data.foods,
    deals: data.deals.map((deal) => ({ ...deal, section: "food" })),
    shopDeals: data.shopDeals.map((deal) => ({ ...deal, section: "shop" })),
  };
  const target = join(root, "..", "backend", "db", "seeds", "catalog.json");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Exported ${catalog.restaurants.length} restaurants and ${catalog.foods.length} foods to ${target}`);
} finally {
  rmSync(tempFile, { force: true });
}
