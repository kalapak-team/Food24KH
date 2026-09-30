import type { FilterState } from "@/components/marketplace/filters-panel";
import type { Restaurant } from "@/types";

export function applyFilters(list: Restaurant[], filters: FilterState) {
  const filtered = list.filter((restaurant) => {
    if (filters.topRatedOnly && restaurant.rating < 4.5) return false;
    if (filters.freeDelivery && !restaurant.freeDeliveryFirstOrder) return false;
    if (filters.openNow && !restaurant.isOpen) return false;
    if (filters.acceptsVouchers && !restaurant.acceptsVouchers) return false;
    if (filters.hasDeals && !restaurant.promotion && !restaurant.pickupDiscountPercent) return false;
    if (filters.priceLevels.length && !filters.priceLevels.includes(restaurant.priceLevel)) return false;
    if (filters.tags.length && !filters.tags.some((tag) => restaurant.tags.includes(tag))) return false;
    return true;
  });

  const sorters: Record<FilterState["sort"], (a: Restaurant, b: Restaurant) => number> = {
    relevance: (a, b) => Number(b.isOpen) - Number(a.isOpen) || b.rating * Math.log(b.reviewCount) - a.rating * Math.log(a.reviewCount),
    fastest: (a, b) => a.deliveryMinutes - b.deliveryMinutes,
    distance: (a, b) => a.distanceKm - b.distanceKm,
    topRated: (a, b) => b.rating - a.rating,
  };

  return [...filtered].sort(sorters[filters.sort]);
}
