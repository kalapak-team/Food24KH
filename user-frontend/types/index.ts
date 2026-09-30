export type Locale = "en" | "km";
export type Currency = "USD" | "KHR";
export type Fulfilment = "delivery" | "pickup";
export type ListingKind = "restaurant" | "shop";

export type OptionChoice = { id: string; name: string; priceDelta: number };
export type OptionGroup = { id: string; name: string; choices: OptionChoice[] };
export type Addon = { id: string; name: string; price: number };

export type FoodItem = {
  id: string;
  restaurantSlug: string;
  restaurantName?: string;
  category: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  emoji: string;
  imageUrl?: string;
  popular: boolean;
  available: boolean;
  prepMinutes: number;
  optionGroups: OptionGroup[];
  addons: Addon[];
};

export type Restaurant = {
  slug: string;
  name: string;
  kind: ListingKind;
  tags: string[];
  emoji: string;
  tint: [string, string];
  imageUrl?: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  deliveryMinutes: number;
  deliveryFee: number;
  minimumOrder: number;
  priceLevel: 1 | 2 | 3;
  distanceKm: number;
  isOpen: boolean;
  acceptsVouchers: boolean;
  freeDeliveryFirstOrder: boolean;
  promotion?: string;
  pickupDiscountPercent?: number;
  address: string;
  city: string;
  description: string;
  openingHours: string;
};

export type Category = { slug: string; name: string; nameKm: string; emoji: string; imageUrl?: string };

export type Deal = {
  id: string;
  title: string;
  subtitle: string;
  restaurantSlug: string;
  tint: [string, string];
  emoji: string;
  imageUrl?: string;
};

export type CartSelection = {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  priceDelta: number;
};

export type CartLine = {
  key: string;
  foodId: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  selections: CartSelection[];
  addons: Addon[];
  note: string;
};

export type Cart = { restaurantSlug: string | null; lines: CartLine[] };

export type AddressLabel = "Home" | "Work" | "Other";

export type Address = {
  id: string;
  label: AddressLabel;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  commune: string;
  street: string;
  houseNumber: string;
  additionalInfo: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PriceSummary = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
};

export type Order = {
  id: string;
  number: string;
  restaurantSlug: string;
  restaurantName: string;
  restaurantEmoji: string;
  lines: CartLine[];
  summary: PriceSummary;
  couponCode: string | null;
  fulfilment: Fulfilment;
  paymentMethod: "cash";
  paymentStatus: "UNPAID";
  status: OrderStatus;
  address: Address | null;
  specialInstructions: string;
  createdAt: string;
  timeline: { status: OrderStatus; at: string }[];
};

export type Profile = { name: string; phone: string; email: string };
