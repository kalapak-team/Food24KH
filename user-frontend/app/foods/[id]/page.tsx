import type { Metadata } from "next";
import { FoodDetailLoader } from "@/components/menu/food-detail-loader";
import { getFood, getRestaurant } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const food = getFood(id);
  const restaurant = food && getRestaurant(food.restaurantSlug);
  if (!food || !restaurant) return { title: "Dish" };
  const title = `${food.name} from ${restaurant.name}`;
  return {
    title,
    description: `${food.description} Order ${food.name} from ${restaurant.name} on Food24KH.`,
    alternates: { canonical: `/foods/${food.id}` },
    openGraph: { title, description: food.description },
  };
}

export default async function FoodPage({ params }: Props) {
  const { id } = await params;
  return <FoodDetailLoader id={id} />;
}
