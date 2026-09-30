import type { Addon, Category, Deal, FoodItem, OptionGroup, Restaurant } from "@/types";
import { resolveFoodImage } from "@/lib/food-images";

// Development catalogue. Every business below is fictional; this data is replaced by the Rails API in Phase 5.

export const cuisines: Category[] = [
  { slug: "khmer", name: "Khmer", nameKm: "ម្ហូបខ្មែរ", emoji: "🍲", imageUrl: "/icons/cuisines/khmer.png" },
  { slug: "chinese", name: "Chinese", nameKm: "ម្ហូបចិន", emoji: "🥟", imageUrl: "/icons/cuisines/chinese.png" },
  { slug: "thai", name: "Thai", nameKm: "ម្ហូបថៃ", emoji: "🍛", imageUrl: "/icons/cuisines/thai.png" },
  { slug: "korean", name: "Korean", nameKm: "ម្ហូបកូរ៉េ", emoji: "🍖", imageUrl: "/icons/cuisines/korean.png" },
  { slug: "japanese", name: "Japanese", nameKm: "ម្ហូបជប៉ុន", emoji: "🍣", imageUrl: "/icons/cuisines/japanese.png" },
  { slug: "fast-food", name: "Fast Food", nameKm: "អាហាររហ័ស", emoji: "🍟", imageUrl: "/icons/cuisines/fast-food.png" },
  { slug: "pizza", name: "Pizza", nameKm: "ភីហ្សា", emoji: "🍕", imageUrl: "/icons/cuisines/pizza.png" },
  { slug: "burgers", name: "Burgers", nameKm: "ប៊ឺហ្គឺ", emoji: "🍔", imageUrl: "/icons/cuisines/burgers.png" },
  { slug: "noodles", name: "Noodles", nameKm: "មី និងគុយទាវ", emoji: "🍜", imageUrl: "/icons/cuisines/noodles.png" },
  { slug: "fried-chicken", name: "Fried Chicken", nameKm: "មាន់បំពង", emoji: "🍗", imageUrl: "/icons/cuisines/fried-chicken.png" },
  { slug: "coffee", name: "Coffee", nameKm: "កាហ្វេ", emoji: "☕", imageUrl: "/icons/cuisines/coffee.png" },
  { slug: "drinks", name: "Drinks & Milk Tea", nameKm: "ភេសជ្ជៈ", emoji: "🧋", imageUrl: "/icons/cuisines/drinks.png" },
  { slug: "desserts", name: "Desserts", nameKm: "បង្អែម", emoji: "🍰", imageUrl: "/icons/cuisines/desserts.png" },
  { slug: "breakfast", name: "Breakfast", nameKm: "អាហារពេលព្រឹក", emoji: "🍳", imageUrl: "/icons/cuisines/breakfast.png" },
  { slug: "healthy", name: "Healthy", nameKm: "អាហារសុខភាព", emoji: "🥗", imageUrl: "/icons/cuisines/healthy.png" },
  { slug: "vegetarian", name: "Vegetarian", nameKm: "អាហារបួស", emoji: "🥦", imageUrl: "/icons/cuisines/vegetarian.png" },
];

export const shopTypes: Category[] = [
  { slug: "convenience", name: "Convenience", nameKm: "ហាងលក់ទំនិញ", emoji: "🏪", imageUrl: "/icons/shops/shop-mart.png" },
  { slug: "grocery", name: "Grocery", nameKm: "គ្រឿងទេស និងម្ហូបអាហារ", emoji: "🛒", imageUrl: "/icons/shops/shop-mart.png" },
  { slug: "fresh-market", name: "Fresh Market", nameKm: "ផ្សារស្រស់", emoji: "🥬", imageUrl: "/icons/shops/shop-fresh.png" },
  { slug: "bakery", name: "Bakery", nameKm: "នំប៉័ង", emoji: "🥐", imageUrl: "/icons/shops/shop-bakery.png" },
  { slug: "flowers", name: "Flowers", nameKm: "ផ្កា", emoji: "💐", imageUrl: "/icons/shops/shop-flowers.png" },
  { slug: "gifts", name: "Gifts", nameKm: "កាដូ", emoji: "🎁", imageUrl: "/icons/shops/shop-flowers.png" },
  { slug: "health-beauty", name: "Health & Beauty", nameKm: "សុខភាព និងសម្ផស្ស", emoji: "🧴", imageUrl: "/icons/shops/shop-care.png" },
  { slug: "pet-shop", name: "Pet Shop", nameKm: "ហាងសត្វចិញ្ចឹម", emoji: "🐾", imageUrl: "/icons/shops/shop-pet.png" },
];

export const cities = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Sihanoukville",
  "Kampot",
  "Kampong Cham",
  "Ta Khmau",
  "Poipet",
];

const groups = {
  size: {
    id: "size",
    name: "Size",
    choices: [
      { id: "regular", name: "Regular", priceDelta: 0 },
      { id: "large", name: "Large", priceDelta: 1 },
    ],
  },
  spice: {
    id: "spice",
    name: "Spice level",
    choices: [
      { id: "mild", name: "Mild", priceDelta: 0 },
      { id: "medium", name: "Medium", priceDelta: 0 },
      { id: "hot", name: "Hot", priceDelta: 0 },
    ],
  },
  cup: {
    id: "cup",
    name: "Cup size",
    choices: [
      { id: "medium", name: "Medium", priceDelta: 0 },
      { id: "large", name: "Large", priceDelta: 0.5 },
    ],
  },
  sweetness: {
    id: "sweetness",
    name: "Sweetness",
    choices: [
      { id: "less", name: "Less sweet", priceDelta: 0 },
      { id: "normal", name: "Normal", priceDelta: 0 },
      { id: "extra", name: "Extra sweet", priceDelta: 0 },
    ],
  },
  pizzaSize: {
    id: "pizza-size",
    name: "Pizza size",
    choices: [
      { id: "small", name: 'Small 8"', priceDelta: 0 },
      { id: "medium", name: 'Medium 10"', priceDelta: 2 },
      { id: "large", name: 'Large 12"', priceDelta: 4 },
    ],
  },
  crust: {
    id: "crust",
    name: "Crust",
    choices: [
      { id: "classic", name: "Classic", priceDelta: 0 },
      { id: "thin", name: "Thin & crispy", priceDelta: 0 },
      { id: "cheese", name: "Cheese-filled", priceDelta: 1.5 },
    ],
  },
} satisfies Record<string, OptionGroup>;

const addonSets = {
  rice: [
    { id: "fried-egg", name: "Fried egg", price: 0.5 },
    { id: "extra-rice", name: "Extra rice", price: 0.5 },
    { id: "extra-meat", name: "Extra meat", price: 1.5 },
  ],
  noodle: [
    { id: "egg", name: "Soft-boiled egg", price: 0.5 },
    { id: "extra-noodles", name: "Extra noodles", price: 0.75 },
    { id: "meatballs", name: "Meatballs", price: 1 },
  ],
  burger: [
    { id: "cheese", name: "Cheese", price: 0.5 },
    { id: "egg", name: "Egg", price: 1 },
    { id: "extra-chicken", name: "Extra chicken", price: 1.5 },
  ],
  pizza: [
    { id: "extra-cheese", name: "Extra cheese", price: 1 },
    { id: "mushroom", name: "Mushrooms", price: 0.75 },
    { id: "pepperoni", name: "Pepperoni", price: 1.5 },
  ],
  drink: [
    { id: "pearls", name: "Brown sugar pearls", price: 0.5 },
    { id: "jelly", name: "Grass jelly", price: 0.5 },
    { id: "cheese-foam", name: "Cheese foam", price: 0.75 },
  ],
} satisfies Record<string, Addon[]>;

const presets = {
  rice: { optionGroups: [groups.spice], addons: addonSets.rice },
  noodle: { optionGroups: [groups.size], addons: addonSets.noodle },
  burger: { optionGroups: [groups.size], addons: addonSets.burger },
  pizza: { optionGroups: [groups.pizzaSize, groups.crust], addons: addonSets.pizza },
  drink: { optionGroups: [groups.cup, groups.sweetness], addons: addonSets.drink },
  coffee: { optionGroups: [groups.cup, groups.sweetness], addons: [] },
  spicy: { optionGroups: [groups.spice], addons: [] },
  plain: { optionGroups: [], addons: [] },
};

type Preset = keyof typeof presets;
type ItemRow = [
  name: string,
  description: string,
  price: number,
  emoji: string,
  preset: Preset,
  discountPrice?: number,
  popular?: boolean,
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildMenu(slug: string, sections: [string, ItemRow[]][]): FoodItem[] {
  return sections.flatMap(([category, rows]) =>
    rows.map(([name, description, price, emoji, preset, discountPrice, popular], index) => {
      const item = {
        id: `${slug}--${slugify(name)}`,
        restaurantSlug: slug,
        category,
        name,
        description,
        price,
        discountPrice,
        emoji,
        popular: popular ?? false,
        available: true,
        prepMinutes: 10 + (index % 3) * 5,
        optionGroups: presets[preset].optionGroups,
        addons: presets[preset].addons,
      };
      return { ...item, imageUrl: resolveFoodImage(item) };
    })
  );
}

export const restaurants: Restaurant[] = [
  {
    slug: "mekong-kitchen",
    name: "Mekong Kitchen",
    kind: "restaurant",
    tags: ["khmer", "noodles"],
    emoji: "🍲",
    tint: ["#00008B", "#3B5BDB"],
    rating: 4.8,
    reviewCount: 1240,
    deliveryMinutes: 25,
    deliveryFee: 0.99,
    minimumOrder: 5,
    priceLevel: 2,
    distanceKm: 1.2,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    promotion: "Up to 25% off",
    pickupDiscountPercent: 15,
    address: "St. 240, Daun Penh",
    city: "Phnom Penh",
    description: "Home-style Khmer cooking with fresh kroeung made every morning.",
    openingHours: "Daily 07:00 – 22:00",
  },
  {
    slug: "golden-lotus-noodle-house",
    name: "Golden Lotus Noodle House",
    kind: "restaurant",
    tags: ["chinese", "noodles"],
    emoji: "🍜",
    tint: ["#9A3412", "#F59E0B"],
    rating: 4.6,
    reviewCount: 860,
    deliveryMinutes: 30,
    deliveryFee: 1.25,
    minimumOrder: 5,
    priceLevel: 1,
    distanceKm: 2.4,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    promotion: "10% off noodles",
    address: "Monivong Blvd, 7 Makara",
    city: "Phnom Penh",
    description: "Hand-pulled noodles and dumplings folded to order.",
    openingHours: "Daily 09:00 – 23:00",
  },
  {
    slug: "bangkok-street-bites",
    name: "Bangkok Street Bites",
    kind: "restaurant",
    tags: ["thai", "noodles"],
    emoji: "🍛",
    tint: ["#047857", "#34D399"],
    rating: 4.5,
    reviewCount: 530,
    deliveryMinutes: 28,
    deliveryFee: 0.99,
    minimumOrder: 6,
    priceLevel: 2,
    distanceKm: 3.1,
    isOpen: true,
    acceptsVouchers: false,
    freeDeliveryFirstOrder: true,
    address: "St. 51, BKK1",
    city: "Phnom Penh",
    description: "Wok-fired Thai street favourites with bold, balanced flavours.",
    openingHours: "Daily 10:00 – 22:00",
  },
  {
    slug: "seoul-grill-bbq",
    name: "Seoul Grill BBQ",
    kind: "restaurant",
    tags: ["korean", "fried-chicken"],
    emoji: "🥩",
    tint: ["#7F1D1D", "#EF4444"],
    rating: 4.7,
    reviewCount: 710,
    deliveryMinutes: 35,
    deliveryFee: 1.5,
    minimumOrder: 8,
    priceLevel: 3,
    distanceKm: 4.0,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    promotion: "15% off pick-up",
    pickupDiscountPercent: 15,
    address: "Sothearos Blvd, Tonle Bassac",
    city: "Phnom Penh",
    description: "Charcoal-grilled Korean BBQ, stews and crispy chicken.",
    openingHours: "Daily 11:00 – 23:00",
  },
  {
    slug: "sakura-bento",
    name: "Sakura Bento",
    kind: "restaurant",
    tags: ["japanese", "healthy"],
    emoji: "🍱",
    tint: ["#9D174D", "#F472B6"],
    rating: 4.6,
    reviewCount: 420,
    deliveryMinutes: 32,
    deliveryFee: 1.25,
    minimumOrder: 7,
    priceLevel: 3,
    distanceKm: 2.8,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    address: "Norodom Blvd, Chamkarmon",
    city: "Phnom Penh",
    description: "Bento boxes, sushi rolls and ramen made with care.",
    openingHours: "Daily 10:30 – 21:30",
  },
  {
    slug: "burger-lab-kh",
    name: "Burger Lab KH",
    kind: "restaurant",
    tags: ["burgers", "fast-food"],
    emoji: "🍔",
    tint: ["#B45309", "#FBBF24"],
    rating: 4.4,
    reviewCount: 980,
    deliveryMinutes: 20,
    deliveryFee: 0.75,
    minimumOrder: 4,
    priceLevel: 2,
    distanceKm: 0.9,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    promotion: "Free delivery",
    address: "St. 278, BKK1",
    city: "Phnom Penh",
    description: "Smash burgers, crispy chicken and loaded fries.",
    openingHours: "Daily 10:00 – 00:00",
  },
  {
    slug: "riverside-pizza-co",
    name: "Riverside Pizza Co.",
    kind: "restaurant",
    tags: ["pizza", "fast-food"],
    emoji: "🍕",
    tint: ["#991B1B", "#FB923C"],
    rating: 4.5,
    reviewCount: 640,
    deliveryMinutes: 30,
    deliveryFee: 1,
    minimumOrder: 6,
    priceLevel: 2,
    distanceKm: 1.8,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    promotion: "Up to 20% off",
    address: "Sisowath Quay, Daun Penh",
    city: "Phnom Penh",
    description: "Stone-baked pizzas with a local twist.",
    openingHours: "Daily 11:00 – 23:00",
  },
  {
    slug: "morning-bay-cafe",
    name: "Morning Bay Café",
    kind: "restaurant",
    tags: ["coffee", "breakfast"],
    emoji: "☕",
    tint: ["#44403C", "#A8A29E"],
    rating: 4.7,
    reviewCount: 1105,
    deliveryMinutes: 18,
    deliveryFee: 0.5,
    minimumOrder: 3,
    priceLevel: 1,
    distanceKm: 0.6,
    isOpen: true,
    acceptsVouchers: false,
    freeDeliveryFirstOrder: true,
    address: "St. 63, BKK1",
    city: "Phnom Penh",
    description: "Specialty coffee, Khmer iced coffee and all-day breakfast.",
    openingHours: "Daily 06:30 – 18:00",
  },
  {
    slug: "sweet-palm-desserts",
    name: "Sweet Palm Desserts",
    kind: "restaurant",
    tags: ["desserts", "khmer"],
    emoji: "🍧",
    tint: ["#6D28D9", "#C4B5FD"],
    rating: 4.8,
    reviewCount: 390,
    deliveryMinutes: 22,
    deliveryFee: 0.75,
    minimumOrder: 3,
    priceLevel: 1,
    distanceKm: 1.5,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    promotion: "Buy 2 save 10%",
    address: "Russian Market, Tuol Tompoung",
    city: "Phnom Penh",
    description: "Traditional Khmer sweets and chilled bingsu.",
    openingHours: "Daily 10:00 – 22:00",
  },
  {
    slug: "boba-garden",
    name: "Boba Garden",
    kind: "restaurant",
    tags: ["drinks"],
    emoji: "🧋",
    tint: ["#0E7490", "#67E8F9"],
    rating: 4.6,
    reviewCount: 1520,
    deliveryMinutes: 15,
    deliveryFee: 0.5,
    minimumOrder: 2,
    priceLevel: 1,
    distanceKm: 0.8,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    promotion: "Buy 1 get 1",
    pickupDiscountPercent: 20,
    address: "Toul Kork Blvd",
    city: "Phnom Penh",
    description: "Fresh milk teas with house-cooked pearls.",
    openingHours: "Daily 09:00 – 22:30",
  },
  {
    slug: "green-bowl",
    name: "Green Bowl",
    kind: "restaurant",
    tags: ["healthy", "vegetarian"],
    emoji: "🥗",
    tint: ["#166534", "#86EFAC"],
    rating: 4.7,
    reviewCount: 310,
    deliveryMinutes: 25,
    deliveryFee: 1,
    minimumOrder: 5,
    priceLevel: 2,
    distanceKm: 2.2,
    isOpen: false,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    address: "St. 360, BKK3",
    city: "Phnom Penh",
    description: "Colourful bowls, spring rolls and cold-pressed juices.",
    openingHours: "Mon – Sat 08:00 – 20:00",
  },
  {
    slug: "crispy-wings-corner",
    name: "Crispy Wings Corner",
    kind: "restaurant",
    tags: ["fried-chicken", "fast-food"],
    emoji: "🍗",
    tint: ["#C2410C", "#FDBA74"],
    rating: 4.3,
    reviewCount: 770,
    deliveryMinutes: 24,
    deliveryFee: 0.75,
    minimumOrder: 4,
    priceLevel: 1,
    distanceKm: 3.5,
    isOpen: true,
    acceptsVouchers: false,
    freeDeliveryFirstOrder: true,
    promotion: "Up to 15% off",
    address: "Street 2004, Sen Sok",
    city: "Phnom Penh",
    description: "Double-fried wings and chicken rice boxes.",
    openingHours: "Daily 10:00 – 23:00",
  },
  {
    slug: "daily-mart-express",
    name: "Daily Mart Express",
    kind: "shop",
    tags: ["convenience", "grocery"],
    emoji: "🛒",
    tint: ["#00008B", "#60A5FA"],
    imageUrl: "/logos/shops/daily-mart-express.png",
    logoUrl: "/logos/shops/daily-mart-express.png",
    rating: 4.5,
    reviewCount: 2100,
    deliveryMinutes: 20,
    deliveryFee: 0.99,
    minimumOrder: 3,
    priceLevel: 1,
    distanceKm: 0.7,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    promotion: "Up to 20% off essentials",
    address: "Mao Tse Toung Blvd",
    city: "Phnom Penh",
    description: "Everyday essentials, snacks and drinks delivered fast.",
    openingHours: "Open 24 hours",
  },
  {
    slug: "fresh-field-market",
    name: "Fresh Field Market",
    kind: "shop",
    tags: ["fresh-market", "grocery"],
    emoji: "🥬",
    tint: ["#15803D", "#BBF7D0"],
    imageUrl: "/logos/shops/fresh-field-market.png",
    logoUrl: "/logos/shops/fresh-field-market.png",
    rating: 4.6,
    reviewCount: 640,
    deliveryMinutes: 35,
    deliveryFee: 1.25,
    minimumOrder: 5,
    priceLevel: 1,
    distanceKm: 2.9,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    address: "Orussey Market area",
    city: "Phnom Penh",
    description: "Fresh vegetables, fruit, meat and seafood from local farms.",
    openingHours: "Daily 06:00 – 20:00",
  },
  {
    slug: "bloom-and-petal",
    name: "Bloom & Petal",
    kind: "shop",
    tags: ["flowers", "gifts"],
    emoji: "💐",
    tint: ["#BE185D", "#FBCFE8"],
    imageUrl: "/logos/shops/bloom-and-petal.png",
    logoUrl: "/logos/shops/bloom-and-petal.png",
    rating: 4.9,
    reviewCount: 210,
    deliveryMinutes: 45,
    deliveryFee: 1.5,
    minimumOrder: 10,
    priceLevel: 3,
    distanceKm: 3.8,
    isOpen: true,
    acceptsVouchers: false,
    freeDeliveryFirstOrder: false,
    address: "St. 57, BKK1",
    city: "Phnom Penh",
    description: "Hand-tied bouquets and potted orchids for every occasion.",
    openingHours: "Daily 08:00 – 20:00",
  },
  {
    slug: "sunrise-bakery",
    name: "Sunrise Bakery",
    kind: "shop",
    tags: ["bakery"],
    emoji: "🥐",
    tint: ["#92400E", "#FDE68A"],
    imageUrl: "/logos/shops/sunrise-bakery.png",
    logoUrl: "/logos/shops/sunrise-bakery.png",
    rating: 4.7,
    reviewCount: 530,
    deliveryMinutes: 20,
    deliveryFee: 0.75,
    minimumOrder: 3,
    priceLevel: 1,
    distanceKm: 1.1,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    address: "St. 108, Wat Phnom",
    city: "Phnom Penh",
    description: "Fresh baguettes, pastries and cakes baked daily.",
    openingHours: "Daily 06:00 – 19:00",
  },
  {
    slug: "petpal-supply",
    name: "PetPal Supply",
    kind: "shop",
    tags: ["pet-shop"],
    emoji: "🐾",
    tint: ["#1E3A8A", "#93C5FD"],
    imageUrl: "/logos/shops/petpal-supply.png",
    logoUrl: "/logos/shops/petpal-supply.png",
    rating: 4.6,
    reviewCount: 180,
    deliveryMinutes: 40,
    deliveryFee: 1.25,
    minimumOrder: 5,
    priceLevel: 2,
    distanceKm: 4.4,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: false,
    address: "Russian Blvd, Toul Kork",
    city: "Phnom Penh",
    description: "Food, litter, toys and care products for your pets.",
    openingHours: "Daily 09:00 – 21:00",
  },
  {
    slug: "care-plus",
    name: "Care Plus Health & Beauty",
    kind: "shop",
    tags: ["health-beauty"],
    emoji: "🧴",
    tint: ["#0F766E", "#99F6E4"],
    imageUrl: "/logos/shops/care-plus.png",
    logoUrl: "/logos/shops/care-plus.png",
    rating: 4.5,
    reviewCount: 340,
    deliveryMinutes: 30,
    deliveryFee: 0.99,
    minimumOrder: 4,
    priceLevel: 2,
    distanceKm: 1.9,
    isOpen: true,
    acceptsVouchers: true,
    freeDeliveryFirstOrder: true,
    promotion: "10% off skincare",
    address: "Kampuchea Krom Blvd",
    city: "Phnom Penh",
    description: "Personal care, skincare and everyday health products.",
    openingHours: "Daily 08:00 – 22:00",
  },
];

export const foods: FoodItem[] = [
  ...buildMenu("mekong-kitchen", [
    [
      "Signature Dishes",
      [
        ["Fish Amok", "Steamed curried fish custard in banana leaf with coconut and kroeung.", 5.5, "🐟", "rice", undefined, true],
        ["Beef Lok Lak", "Wok-seared pepper beef with lime-pepper dip, fried egg and rice.", 5, "🥩", "rice", 4.25, true],
        ["Samlor Korko", "Hearty Khmer vegetable soup with roasted rice powder.", 4.5, "🥣", "spicy"],
      ],
    ],
    [
      "Rice & Noodles",
      [
        ["Bai Sach Chrouk", "Grilled coconut-garlic pork over broken rice with pickles.", 3.5, "🍚", "rice", undefined, true],
        ["Phnom Penh Kuy Teav", "Clear pork broth, rice noodles, fresh herbs and garlic oil.", 3.75, "🍜", "noodle"],
        ["Nom Banh Chok", "Fresh rice noodles with green fish curry and herbs.", 3.25, "🍝", "plain"],
      ],
    ],
    [
      "Drinks",
      [
        ["Iced Palm Sugar Coffee", "Strong Khmer coffee sweetened with Kampong Speu palm sugar.", 1.75, "☕", "coffee"],
        ["Fresh Sugarcane Juice", "Pressed to order with a squeeze of kumquat.", 1.25, "🥤", "coffee"],
      ],
    ],
  ]),
  ...buildMenu("golden-lotus-noodle-house", [
    [
      "Noodles",
      [
        ["Hand-pulled Beef Noodle Soup", "Slow-braised beef, rich broth and chewy hand-pulled noodles.", 4.5, "🍜", "noodle", undefined, true],
        ["Dan Dan Noodles", "Sesame-chilli sauce, minced pork and scallions.", 3.75, "🌶️", "noodle"],
      ],
    ],
    [
      "Dumplings & Mains",
      [
        ["Pork & Chive Dumplings (10)", "Pan-fried until crisp, with black vinegar dip.", 3.5, "🥟", "plain", undefined, true],
        ["Yangzhou Fried Rice", "Egg fried rice with shrimp, char siu and spring onion.", 3.75, "🍚", "rice"],
        ["Mapo Tofu", "Silken tofu in a numbing Sichuan pepper sauce.", 4, "🌶️", "spicy"],
        ["Char Siu Rice", "Honey-glazed roast pork over steamed rice.", 4.25, "🍖", "rice", 3.6],
      ],
    ],
    ["Drinks", [["Chrysanthemum Tea", "Lightly sweet floral tea, served iced.", 1.25, "🍵", "coffee"]]],
  ]),
  ...buildMenu("bangkok-street-bites", [
    [
      "Mains",
      [
        ["Pad Thai Goong", "Rice noodles with prawns, tamarind, peanuts and lime.", 4.5, "🍤", "noodle", undefined, true],
        ["Green Curry Chicken", "Creamy coconut green curry with Thai basil.", 4.75, "🍛", "spicy", undefined, true],
        ["Tom Yum Soup", "Hot and sour lemongrass soup with prawns.", 5, "🥘", "spicy"],
        ["Basil Pork with Fried Egg", "Holy basil stir-fry over jasmine rice.", 4, "🍳", "rice", 3.4],
      ],
    ],
    [
      "Desserts & Drinks",
      [
        ["Mango Sticky Rice", "Sweet coconut sticky rice with ripe mango.", 3, "🥭", "plain"],
        ["Thai Iced Tea", "Strong orange tea with condensed milk.", 1.75, "🧋", "drink"],
      ],
    ],
  ]),
  ...buildMenu("seoul-grill-bbq", [
    [
      "BBQ Sets",
      [
        ["Beef Bulgogi Set", "Sweet soy marinated beef with rice and banchan.", 7.5, "🥩", "rice", undefined, true],
        ["Stone-pot Bibimbap", "Sizzling rice bowl with vegetables, beef and egg.", 5.5, "🍲", "rice", undefined, true],
      ],
    ],
    [
      "Chicken & Stews",
      [
        ["Korean Fried Chicken (Half)", "Double-fried, glazed in sweet-spicy gochujang.", 8, "🍗", "spicy", 6.8],
        ["Kimchi Jjigae", "Bubbling kimchi stew with pork and tofu.", 5, "🥘", "spicy"],
        ["Tteokbokki", "Chewy rice cakes in spicy red sauce.", 4, "🌶️", "spicy"],
      ],
    ],
    ["Drinks", [["Iced Yuzu Tea", "Refreshing citrus tea.", 2, "🍹", "coffee"]]],
  ]),
  ...buildMenu("sakura-bento", [
    [
      "Bento & Rice",
      [
        ["Salmon Teriyaki Bento", "Glazed salmon, rice, salad and pickles.", 6.5, "🍱", "rice", undefined, true],
        ["Chicken Katsu Curry", "Crispy cutlet with mild Japanese curry.", 5.75, "🍛", "rice"],
      ],
    ],
    [
      "Sushi & Ramen",
      [
        ["Salmon Avocado Roll (8)", "Fresh salmon, avocado and sesame.", 5, "🍣", "plain", undefined, true],
        ["Tonkotsu Ramen", "Creamy pork bone broth with chashu and egg.", 6, "🍜", "noodle", 5.1],
        ["Edamame", "Steamed soybeans with sea salt.", 2, "🫛", "plain"],
      ],
    ],
    ["Drinks", [["Matcha Latte", "Stone-ground matcha with fresh milk.", 2.5, "🍵", "coffee"]]],
  ]),
  ...buildMenu("burger-lab-kh", [
    [
      "Burgers",
      [
        ["Classic Beef Burger", "Beef patty, lettuce, tomato and house sauce.", 4.5, "🍔", "burger", undefined, true],
        ["Chicken Burger", "Crispy buttermilk chicken, slaw and pickles.", 4.5, "🍔", "burger", undefined, true],
        ["Double Cheese Smash", "Two smashed patties with melted cheddar.", 6.5, "🍔", "burger", 5.5],
      ],
    ],
    [
      "Sides & Shakes",
      [
        ["Loaded Fries", "Fries with cheese sauce and crispy shallots.", 2.75, "🍟", "plain"],
        ["Onion Rings", "Beer-battered and golden.", 2.25, "🧅", "plain"],
        ["Chocolate Milkshake", "Thick shake made with real ice cream.", 2.75, "🥤", "coffee"],
      ],
    ],
  ]),
  ...buildMenu("riverside-pizza-co", [
    [
      "Pizzas",
      [
        ["Margherita", "Tomato, mozzarella and fresh basil.", 6, "🍕", "pizza", undefined, true],
        ["Pepperoni", "Loaded with pepperoni and mozzarella.", 7.5, "🍕", "pizza", undefined, true],
        ["Kroeung Chicken Pizza", "Lemongrass chicken, red onion and chilli.", 7.75, "🍕", "pizza", 6.6],
        ["Seafood Supreme", "Prawns, squid and garlic butter.", 8.5, "🍤", "pizza"],
      ],
    ],
    [
      "Sides",
      [
        ["Garlic Bread", "Toasted with herb butter.", 2.5, "🥖", "plain"],
        ["Caesar Salad", "Crisp romaine, parmesan and croutons.", 4, "🥗", "plain"],
      ],
    ],
  ]),
  ...buildMenu("morning-bay-cafe", [
    [
      "Coffee",
      [
        ["Iced Latte", "Double espresso over fresh milk and ice.", 2.25, "☕", "coffee", undefined, true],
        ["Coconut Cold Brew", "18-hour cold brew with fresh coconut water.", 2.75, "🥥", "coffee"],
        ["Khmer Iced Milk Coffee", "Dark roast with sweet condensed milk.", 1.5, "☕", "coffee"],
      ],
    ],
    [
      "Breakfast",
      [
        ["Big Breakfast Plate", "Eggs, sausage, bacon, toast and grilled tomato.", 5.5, "🍳", "plain", undefined, true],
        ["Avocado Toast", "Sourdough, smashed avocado and chilli flakes.", 4.25, "🥑", "plain"],
        ["Butter Croissant", "Flaky, baked every morning.", 1.75, "🥐", "plain", 1.5],
      ],
    ],
  ]),
  ...buildMenu("sweet-palm-desserts", [
    [
      "Khmer Sweets",
      [
        ["Pumpkin Custard", "Steamed palm-sugar custard in a whole pumpkin slice.", 2, "🎃", "plain", undefined, true],
        ["Coconut Jelly Cup", "Silky coconut jelly with fresh coconut flesh.", 1.75, "🥥", "plain"],
        ["Durian Sticky Rice", "Sticky rice with rich durian cream.", 3.5, "🍚", "plain", 3],
      ],
    ],
    [
      "Chilled",
      [
        ["Mango Bingsu", "Shaved milk ice with fresh mango and cream.", 4.5, "🍧", "plain", undefined, true],
        ["Chocolate Lava Cake", "Warm cake with a molten centre.", 3.25, "🍫", "plain"],
        ["Taro Ice Cream", "Creamy purple taro scoop.", 2, "🍨", "plain"],
      ],
    ],
  ]),
  ...buildMenu("boba-garden", [
    [
      "Milk Tea",
      [
        ["Brown Sugar Pearl Milk", "Fresh milk with slow-cooked brown sugar pearls.", 2.5, "🧋", "drink", undefined, true],
        ["Classic Milk Tea", "Black tea with creamy milk.", 2, "🧋", "drink", undefined, true],
        ["Taro Milk Tea", "Real taro blended with milk tea.", 2.25, "🧋", "drink"],
      ],
    ],
    [
      "Fruit Tea",
      [
        ["Passion Fruit Green Tea", "Jasmine green tea with fresh passion fruit.", 2, "🍹", "drink", 1.7],
        ["Strawberry Yogurt Smoothie", "Blended strawberries and yogurt.", 2.75, "🍓", "drink"],
        ["Matcha Cheese Foam", "Matcha topped with salty cheese foam.", 2.75, "🍵", "drink"],
      ],
    ],
  ]),
  ...buildMenu("green-bowl", [
    [
      "Bowls",
      [
        ["Tofu Buddha Bowl", "Crispy tofu, brown rice, greens and peanut dressing.", 5, "🥗", "plain", undefined, true],
        ["Grilled Chicken Quinoa Bowl", "Lean chicken, quinoa and roasted vegetables.", 5.75, "🥙", "plain"],
        ["Vegan Green Curry", "Coconut curry with seasonal vegetables.", 4.75, "🍛", "spicy"],
      ],
    ],
    [
      "Light Bites & Juice",
      [
        ["Fresh Spring Rolls (4)", "Rice paper rolls with herbs and tofu.", 3, "🥬", "plain", undefined, true],
        ["Cold-pressed Green Juice", "Kale, apple, cucumber and ginger.", 2.75, "🥤", "plain", 2.3],
        ["Fruit & Granola Bowl", "Yogurt, seasonal fruit and house granola.", 3.75, "🍓", "plain"],
      ],
    ],
  ]),
  ...buildMenu("crispy-wings-corner", [
    [
      "Chicken",
      [
        ["6pc Crispy Wings", "Double-fried wings with your choice of heat.", 4.5, "🍗", "spicy", undefined, true],
        ["Chicken Rice Box", "Crispy chicken over garlic rice.", 3.75, "🍱", "rice", undefined, true],
        ["Spicy Drumsticks (3)", "Juicy drumsticks in chilli glaze.", 4, "🌶️", "spicy", 3.4],
        ["Chicken Popcorn", "Bite-size pieces with dipping sauce.", 2.75, "🍿", "plain"],
      ],
    ],
    [
      "Sides & Drinks",
      [
        ["Coleslaw", "Creamy and crunchy.", 1.25, "🥗", "plain"],
        ["Iced Lemon Tea", "Fresh-brewed with lemon.", 1.25, "🍋", "coffee"],
      ],
    ],
  ]),
  ...buildMenu("daily-mart-express", [
    [
      "Essentials",
      [
        ["Drinking Water 1.5L", "Purified bottled water.", 0.5, "💧", "plain", undefined, true],
        ["Instant Noodles (5-pack)", "Chicken flavour.", 1.75, "🍜", "plain"],
        ["UHT Fresh Milk 1L", "Full cream.", 1.6, "🥛", "plain", 1.4],
      ],
    ],
    [
      "Snacks & Household",
      [
        ["Potato Chips 100g", "Sea salt.", 1.25, "🥔", "plain", undefined, true],
        ["Chocolate Bar", "Milk chocolate 45g.", 1, "🍫", "plain"],
        ["Tissue Box", "3-ply, 150 sheets.", 1.2, "🧻", "plain"],
      ],
    ],
  ]),
  ...buildMenu("fresh-field-market", [
    [
      "Vegetables",
      [
        ["Morning Glory (bunch)", "Picked this morning.", 0.5, "🥬", "plain", undefined, true],
        ["Tomatoes 500g", "Vine-ripened.", 0.9, "🍅", "plain"],
      ],
    ],
    [
      "Fruits",
      [
        ["Cambodian Mango 1kg", "Sweet Keo Romeat mangoes.", 2, "🥭", "plain", 1.75, true],
        ["Dragon Fruit 1kg", "Red flesh variety.", 1.75, "🐉", "plain"],
      ],
    ],
    [
      "Meat & Seafood",
      [
        ["Chicken Thigh 500g", "Boneless, skin-on.", 2.5, "🍗", "plain"],
        ["Fresh Prawns 500g", "Cleaned and deveined.", 5.5, "🦐", "plain"],
      ],
    ],
  ]),
  ...buildMenu("bloom-and-petal", [
    [
      "Bouquets",
      [
        ["Red Rose Bouquet (12)", "Classic long-stem roses.", 18, "🌹", "plain", undefined, true],
        ["Sunflower Bundle", "Bright and cheerful.", 12, "🌻", "plain"],
        ["Mixed Tulips", "Seasonal colours.", 25, "🌷", "plain", 22],
      ],
    ],
    [
      "Plants & Gifts",
      [
        ["Orchid Pot", "Phalaenopsis in ceramic pot.", 22, "🌸", "plain"],
        ["Greeting Card", "Add a handwritten message.", 1.5, "💌", "plain"],
      ],
    ],
  ]),
  ...buildMenu("sunrise-bakery", [
    [
      "Bread",
      [
        ["Baguette", "Crusty, baked every 2 hours.", 0.75, "🥖", "plain", undefined, true],
        ["Chicken Pâté Sandwich", "Num pang with pickles and chilli.", 2, "🥪", "plain", undefined, true],
      ],
    ],
    [
      "Pastries & Cakes",
      [
        ["Pain au Chocolat", "Buttery with dark chocolate.", 1.5, "🥐", "plain"],
        ["Banana Cake Loaf", "Moist and fragrant.", 3.5, "🍌", "plain", 3],
        ["Cheesecake Slice", "Baked New York style.", 2.75, "🍰", "plain"],
      ],
    ],
  ]),
  ...buildMenu("petpal-supply", [
    [
      "Food",
      [
        ["Dry Dog Food 2kg", "Adult formula.", 9.5, "🐶", "plain", undefined, true],
        ["Cat Food Pouches (12)", "Tuna in jelly.", 7, "🐱", "plain", 6.3],
      ],
    ],
    [
      "Care & Toys",
      [
        ["Cat Litter 5L", "Clumping, low dust.", 4.5, "🪣", "plain"],
        ["Chew Toy", "Durable rubber bone.", 3, "🦴", "plain"],
        ["Pet Shampoo", "Gentle oatmeal formula.", 5, "🧴", "plain"],
      ],
    ],
  ]),
  ...buildMenu("care-plus", [
    [
      "Skincare",
      [
        ["Sunscreen SPF50", "Lightweight daily protection.", 8.5, "☀️", "plain", 7.6, true],
        ["Face Masks (50)", "3-ply disposable.", 3.5, "😷", "plain"],
      ],
    ],
    [
      "Health & Personal Care",
      [
        ["Vitamin C 1000mg", "30 effervescent tablets.", 6, "💊", "plain"],
        ["Hand Sanitizer 250ml", "70% alcohol.", 2, "🧼", "plain"],
        ["Shampoo 400ml", "Daily care.", 4.5, "🧴", "plain"],
      ],
    ],
  ]),
];

export const deals: Deal[] = [
  { id: "deal-mekong", title: "Up to 25% off", subtitle: "Khmer favourites at Mekong Kitchen", restaurantSlug: "mekong-kitchen", tint: ["#00008B", "#2F4BFF"], emoji: "🍲", imageUrl: "/icons/deals/deal-mekong.png" },
  { id: "deal-burger", title: "Free delivery", subtitle: "First order from Burger Lab KH", restaurantSlug: "burger-lab-kh", tint: ["#B45309", "#F59E0B"], emoji: "🍔", imageUrl: "/icons/deals/deal-burger.png" },
  { id: "deal-boba", title: "Buy 1 get 1", subtitle: "Selected milk teas at Boba Garden", restaurantSlug: "boba-garden", tint: ["#0E7490", "#22D3EE"], emoji: "🧋", imageUrl: "/icons/deals/deal-boba.png" },
  { id: "deal-seoul", title: "15% off pick-up", subtitle: "Collect your order at Seoul Grill BBQ", restaurantSlug: "seoul-grill-bbq", tint: ["#7F1D1D", "#F87171"], emoji: "🥩", imageUrl: "/icons/deals/deal-seoul.png" },
  { id: "deal-pizza", title: "Up to 20% off", subtitle: "Stone-baked pizzas at Riverside", restaurantSlug: "riverside-pizza-co", tint: ["#1E1B4B", "#6366F1"], emoji: "🍕", imageUrl: "/icons/deals/deal-pizza.png" },
];

export const shopDeals: Deal[] = [
  { id: "deal-mart", title: "Up to 20% off", subtitle: "Everyday essentials at Daily Mart Express", restaurantSlug: "daily-mart-express", tint: ["#00008B", "#3B82F6"], emoji: "🛒", imageUrl: "/icons/shops/shop-mart.png" },
  { id: "deal-fresh", title: "Fresh mango season", subtitle: "Keo Romeat mangoes at Fresh Field", restaurantSlug: "fresh-field-market", tint: ["#166534", "#4ADE80"], emoji: "🥭", imageUrl: "/icons/shops/shop-fresh.png" },
  { id: "deal-care", title: "10% off skincare", subtitle: "Sun care at Care Plus", restaurantSlug: "care-plus", tint: ["#0F766E", "#2DD4BF"], emoji: "☀️", imageUrl: "/icons/shops/shop-care.png" },
  { id: "deal-bakery", title: "Morning bakes", subtitle: "Fresh baguettes from Sunrise Bakery", restaurantSlug: "sunrise-bakery", tint: ["#92400E", "#FBBF24"], emoji: "🥖", imageUrl: "/icons/shops/shop-bakery.png" },
];

export function getRestaurant(slug: string) {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function getFood(id: string) {
  return foods.find((food) => food.id === id);
}

export function getMenu(slug: string) {
  return foods.filter((food) => food.restaurantSlug === slug);
}

export function getMenuCategories(slug: string) {
  return Array.from(new Set(getMenu(slug).map((food) => food.category)));
}

export function getCategory(slug: string) {
  return [...cuisines, ...shopTypes].find((category) => category.slug === slug);
}

export function searchCatalog(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return { restaurants: [] as Restaurant[], foods: [] as FoodItem[] };
  const tagMatches = (restaurant: Restaurant) =>
    restaurant.tags.some((tag) => getCategory(tag)?.name.toLowerCase().includes(needle));
  return {
    restaurants: restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(needle) ||
        restaurant.description.toLowerCase().includes(needle) ||
        tagMatches(restaurant)
    ),
    foods: foods.filter(
      (food) =>
        food.name.toLowerCase().includes(needle) ||
        food.description.toLowerCase().includes(needle)
    ),
  };
}
