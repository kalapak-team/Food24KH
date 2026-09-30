class CatalogSerializer
  def self.food(food)
    {
      id: food.slug,
      restaurantSlug: food.restaurant.slug,
      restaurantName: food.restaurant.name,
      category: food.menu_category.name,
      name: food.name,
      description: food.description,
      price: food.price.to_f,
      discountPrice: food.discount_price&.to_f,
      emoji: food.emoji,
      imageUrl: food.image_url,
      popular: food.popular,
      available: food.available,
      prepMinutes: food.prep_minutes,
      optionGroups: food.option_groups.includes(:choices).map { |group| option_group(group) },
      addons: food.addons.map { |addon| addon_json(addon) }
    }
  end

  def self.food_card(food)
    {
      id: food.slug,
      restaurantSlug: food.restaurant.slug,
      restaurantName: food.restaurant.name,
      category: food.menu_category.name,
      name: food.name,
      description: food.description,
      price: food.price.to_f,
      discountPrice: food.discount_price&.to_f,
      emoji: food.emoji,
      imageUrl: food.image_url,
      popular: food.popular,
      available: food.available,
      prepMinutes: food.prep_minutes,
      optionGroups: [],
      addons: []
    }
  end

  def self.restaurant(restaurant, foods_count: nil)
    cover =
      restaurant.logo_url.presence ||
      (restaurant.association(:foods).loaded? ?
        restaurant.foods.find { |f| f.image_url.present? }&.image_url :
        restaurant.foods.where.not(image_url: [nil, ""]).order(:position).limit(1).pick(:image_url))

    {
      slug: restaurant.slug,
      name: restaurant.name,
      kind: restaurant.kind,
      tags: restaurant.categories.sort_by(&:position).map(&:slug),
      emoji: restaurant.emoji,
      tint: [restaurant.tint_from || "#00008B", restaurant.tint_to || "#3B5BDB"],
      imageUrl: cover,
      logoUrl: restaurant.logo_url,
      rating: restaurant.rating.to_f,
      reviewCount: restaurant.review_count,
      deliveryMinutes: restaurant.delivery_minutes,
      deliveryFee: restaurant.delivery_fee.to_f,
      minimumOrder: restaurant.minimum_order.to_f,
      priceLevel: restaurant.price_level,
      distanceKm: restaurant.distance_km&.to_f || 0,
      isOpen: restaurant.is_open,
      acceptsVouchers: restaurant.accepts_vouchers,
      freeDeliveryFirstOrder: restaurant.free_delivery_first_order,
      promotion: restaurant.promotion,
      pickupDiscountPercent: restaurant.pickup_discount_percent,
      address: restaurant.address,
      city: restaurant.city&.name,
      description: restaurant.description,
      openingHours: restaurant.opening_hours,
      foodsCount: foods_count || restaurant.foods.size
    }
  end

  def self.option_group(group)
    {
      id: group.key,
      name: group.name,
      choices: group.choices.map do |choice|
        { id: choice.key, name: choice.name, priceDelta: choice.price_delta.to_f }
      end
    }
  end

  def self.addon_json(addon)
    { id: addon.key, name: addon.name, price: addon.price.to_f }
  end
end
