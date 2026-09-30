# Loads the Food24KH development catalogue (fictional businesses).
# Source: db/seeds/catalog.json, exported from user-frontend with `npm run export:catalog`.
# Safe to run repeatedly: records are matched by slug/key and updated in place.

catalog = JSON.parse(File.read(Rails.root.join("db/seeds/catalog.json")))

def upsert(model, lookup, attributes)
  record = model.find_or_initialize_by(lookup)
  record.assign_attributes(attributes)
  record.save!
  record
end

ActiveRecord::Base.transaction do
  cities = (catalog["cities"] + catalog["restaurants"].map { |r| r["city"] }).uniq
  city_records = cities.each_with_index.to_h do |name, index|
    [name, upsert(City, { name: name }, position: index, active: true)]
  end

  categories = {}
  { "cuisines" => "cuisine", "shopTypes" => "shop_type" }.each do |key, kind|
    catalog[key].each_with_index do |row, index|
      categories[row["slug"]] = upsert(Category, { slug: row["slug"] },
                                       name: row["name"], name_km: row["nameKm"], emoji: row["emoji"],
                                       kind: kind, position: index)
    end
  end

  restaurants = catalog["restaurants"].to_h do |row|
    restaurant = upsert(Restaurant, { slug: row["slug"] },
                        name: row["name"],
                        kind: row["kind"],
                        status: "approved",
                        description: row["description"],
                        emoji: row["emoji"],
                        tint_from: row.dig("tint", 0),
                        tint_to: row.dig("tint", 1),
                        rating: row["rating"],
                        review_count: row["reviewCount"],
                        delivery_minutes: row["deliveryMinutes"],
                        delivery_fee: row["deliveryFee"],
                        minimum_order: row["minimumOrder"],
                        price_level: row["priceLevel"],
                        distance_km: row["distanceKm"],
                        is_open: row["isOpen"],
                        accepts_vouchers: row["acceptsVouchers"],
                        free_delivery_first_order: row["freeDeliveryFirstOrder"],
                        promotion: row["promotion"],
                        pickup_discount_percent: row["pickupDiscountPercent"],
                        address: row["address"],
                        city: city_records.fetch(row["city"]),
                        opening_hours: row["openingHours"])
    restaurant.categories = row["tags"].filter_map { |slug| categories[slug] }
    [row["slug"], restaurant]
  end

  catalog["foods"].group_by { |row| row["restaurantSlug"] }.each do |slug, rows|
    restaurant = restaurants.fetch(slug)
    menu_categories = rows.map { |row| row["category"] }.uniq.each_with_index.to_h do |name, index|
      [name, upsert(MenuCategory, { restaurant: restaurant, name: name }, position: index)]
    end

    rows.each_with_index do |row, index|
      food = upsert(Food, { slug: row["id"] },
                    restaurant: restaurant,
                    menu_category: menu_categories.fetch(row["category"]),
                    name: row["name"],
                    description: row["description"],
                    price: row["price"],
                    discount_price: row["discountPrice"],
                    emoji: row["emoji"],
                    popular: row["popular"],
                    available: row["available"],
                    prep_minutes: row["prepMinutes"],
                    position: index)

      group_keys = row["optionGroups"].each_with_index.map do |group_row, group_index|
        group = upsert(FoodOptionGroup, { food: food, key: group_row["id"] },
                       name: group_row["name"], required: true, position: group_index)
        choice_keys = group_row["choices"].each_with_index.map do |choice_row, choice_index|
          upsert(FoodOptionChoice, { food_option_group: group, key: choice_row["id"] },
                 name: choice_row["name"], price_delta: choice_row["priceDelta"], position: choice_index)
          choice_row["id"]
        end
        group.choices.where.not(key: choice_keys).destroy_all
        group_row["id"]
      end
      food.option_groups.where.not(key: group_keys).destroy_all

      addon_keys = row["addons"].each_with_index.map do |addon_row, addon_index|
        upsert(FoodAddon, { food: food, key: addon_row["id"] },
               name: addon_row["name"], price: addon_row["price"], position: addon_index)
        addon_row["id"]
      end
      food.addons.where.not(key: addon_keys).destroy_all
    end
  end

  (catalog["deals"] + catalog["shopDeals"]).each_with_index do |row, index|
    upsert(Deal, { key: row["id"] },
           title: row["title"], subtitle: row["subtitle"], section: row["section"],
           restaurant: restaurants.fetch(row["restaurantSlug"]),
           tint_from: row.dig("tint", 0), tint_to: row.dig("tint", 1), emoji: row["emoji"],
           active: true, position: index)
  end

  [
    { code: "FOOD24", description: "10% off, min $10, max $5", discount_type: "percent", value: 10, minimum_order: 10, maximum_discount: 5 },
    { code: "WELCOME", description: "$2 off orders over $8", discount_type: "fixed", value: 2, minimum_order: 8, maximum_discount: nil },
    { code: "FREEDEL", description: "Free delivery on orders over $5", discount_type: "free_delivery", value: 0, minimum_order: 5, maximum_discount: nil }
  ].each do |attributes|
    upsert(Coupon, { code: attributes[:code] }, attributes.except(:code).merge(active: true))
  end

  upsert(ExchangeRate,
         { base_currency: "USD", quote_currency: "KHR", effective_from: Time.zone.parse("2026-01-01") },
         rate: ENV.fetch("KHR_PER_USD", "4100"), active: true)
end

puts "Seeded #{City.count} cities, #{Category.count} categories, #{Restaurant.count} restaurants, " \
     "#{MenuCategory.count} menu categories, #{Food.count} foods, #{FoodOptionGroup.count} option groups, " \
     "#{FoodOptionChoice.count} option choices, #{FoodAddon.count} add-ons, #{Deal.count} deals, " \
     "#{Coupon.count} coupons, #{ExchangeRate.count} exchange rate(s)."

load Rails.root.join("db/seeds/bulk_1000_foods.rb")
