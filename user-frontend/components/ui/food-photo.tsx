import { resolveFoodImage } from "@/lib/food-images";
import { cn } from "@/lib/utils";

type FoodPhotoProps = {
  name: string;
  imageUrl?: string | null;
  category?: string;
  description?: string;
  emoji?: string;
  className?: string;
  imgClassName?: string;
};

/** Always shows a real product photo when possible. */
export function FoodPhoto({ name, imageUrl, category, description, emoji = "🍽️", className, imgClassName }: FoodPhotoProps) {
  const src = resolveFoodImage({ name, category, description, imageUrl });
  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className={cn("h-full w-full object-contain p-2", imgClassName)} />
      {!imageUrl && !src && (
        <span className="absolute inset-0 grid place-items-center text-5xl" aria-hidden>
          {emoji}
        </span>
      )}
    </div>
  );
}
