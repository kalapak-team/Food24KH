/** Map dish text to a white-background product photo under /foods/white-bg or /icons. */

const RULES: { match: RegExp; image: string }[] = [
  { match: /amok|korko|khmer|lok.?lak|samlor|bai sach/i, image: "/foods/white-bg/food-amok.png" },
  { match: /lok.?lak|beef.*pepper|kampot/i, image: "/foods/white-bg/food-lok-lak.png" },
  { match: /noodle|pho|kuy|ramen|laksa|wonton|pad thai|tom yum/i, image: "/foods/white-bg/food-noodles.png" },
  { match: /burger|sandwich/i, image: "/foods/white-bg/food-burger.png" },
  { match: /pizza/i, image: "/foods/white-bg/food-pizza.png" },
  { match: /boba|milk tea|bubble|smoothie|juice|drink|tea/i, image: "/foods/white-bg/food-boba.png" },
  { match: /bbq|grill|satay|galbi|bulgogi|skewer|rib/i, image: "/foods/white-bg/food-bbq.png" },
  { match: /sushi|nigiri|roll|sashimi|teriyaki/i, image: "/foods/white-bg/food-sushi.png" },
  { match: /fried chicken|wing|chicken popcorn|crispy chicken/i, image: "/foods/white-bg/food-fried-chicken.png" },
  { match: /coffee|latte|cappuccino|americano|espresso/i, image: "/foods/white-bg/food-coffee.png" },
  { match: /curry|thai|green curry|red curry/i, image: "/foods/white-bg/food-thai-curry.png" },
  { match: /dumpling|bao|gyoza|xiao long/i, image: "/foods/white-bg/food-dumplings.png" },
  { match: /dessert|cake|pudding|sticky rice|cheesecake|tiramisu|donut/i, image: "/foods/white-bg/food-dessert.png" },
  { match: /salad|poke|healthy|quinoa|bowl/i, image: "/foods/white-bg/food-healthy.png" },
  { match: /croissant|baguette|bakery|bread|pancake/i, image: "/foods/white-bg/food-bakery.png" },
  { match: /grocery|egg|rice 5|mango|market|vegetable/i, image: "/foods/white-bg/food-grocery.png" },
  { match: /breakfast|benedict|toast|fried rice/i, image: "/foods/white-bg/food-breakfast.png" },
  { match: /veg|tofu|vegetarian|buddha|spring roll/i, image: "/foods/white-bg/food-vegetarian.png" },
  { match: /fries|fast food/i, image: "/foods/white-bg/food-fries.png" },
];

const CATEGORY_FALLBACK: Record<string, string> = {
  khmer: "/icons/cuisines/khmer.png",
  chinese: "/icons/cuisines/chinese.png",
  thai: "/icons/cuisines/thai.png",
  korean: "/icons/cuisines/korean.png",
  japanese: "/icons/cuisines/japanese.png",
  "fast-food": "/icons/cuisines/fast-food.png",
  pizza: "/icons/cuisines/pizza.png",
  burgers: "/icons/cuisines/burgers.png",
  noodles: "/icons/cuisines/noodles.png",
  "fried-chicken": "/icons/cuisines/fried-chicken.png",
  coffee: "/icons/cuisines/coffee.png",
  drinks: "/icons/cuisines/drinks.png",
  desserts: "/icons/cuisines/desserts.png",
  breakfast: "/icons/cuisines/breakfast.png",
  healthy: "/icons/cuisines/healthy.png",
  vegetarian: "/icons/cuisines/vegetarian.png",
};

export function resolveFoodImage(input: { name?: string; category?: string; description?: string; imageUrl?: string | null }) {
  if (input.imageUrl) return input.imageUrl;
  const text = `${input.name ?? ""} ${input.category ?? ""} ${input.description ?? ""}`;
  for (const rule of RULES) {
    if (rule.match.test(text)) return rule.image;
  }
  const slug = (input.category ?? "").toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_FALLBACK[slug] ?? "/foods/white-bg/food-healthy.png";
}

/** Cover for restaurant cards/detail: logo → image → first dish photo → cuisine icon. */
export function resolveRestaurantCover(
  restaurant: {
    logoUrl?: string | null;
    imageUrl?: string | null;
    tags?: string[];
  },
  foods?: Array<{ imageUrl?: string | null; name?: string; category?: string; description?: string; popular?: boolean }>
) {
  if (restaurant.logoUrl) return restaurant.logoUrl;
  if (restaurant.imageUrl) return restaurant.imageUrl;

  if (foods?.length) {
    const preferred = foods.find((food) => food.popular && (food.imageUrl || food.name)) ?? foods[0];
    const fromFood = preferred ? resolveFoodImage(preferred) : null;
    if (fromFood) return fromFood;
  }

  for (const tag of restaurant.tags ?? []) {
    const fromTag = CATEGORY_FALLBACK[tag];
    if (fromTag) return fromTag;
  }

  return null;
}
