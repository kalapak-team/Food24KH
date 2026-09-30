# frozen_string_literal: true

# Inserts foods until the table has TARGET products, each with a white-background image.
# Idempotent: skips existing slugs; safe to re-run.

TARGET = 1000
IMAGE_BASE = "/foods/white-bg"

IMAGE_BY_KEY = {
  "amok" => "#{IMAGE_BASE}/food-amok.png",
  "lok_lak" => "#{IMAGE_BASE}/food-lok-lak.png",
  "noodles" => "#{IMAGE_BASE}/food-noodles.png",
  "burger" => "#{IMAGE_BASE}/food-burger.png",
  "pizza" => "#{IMAGE_BASE}/food-pizza.png",
  "boba" => "#{IMAGE_BASE}/food-boba.png",
  "bbq" => "#{IMAGE_BASE}/food-bbq.png",
  "sushi" => "#{IMAGE_BASE}/food-sushi.png",
  "fried_chicken" => "#{IMAGE_BASE}/food-fried-chicken.png",
  "coffee" => "#{IMAGE_BASE}/food-coffee.png",
  "thai_curry" => "#{IMAGE_BASE}/food-thai-curry.png",
  "dumplings" => "#{IMAGE_BASE}/food-dumplings.png",
  "dessert" => "#{IMAGE_BASE}/food-dessert.png",
  "healthy" => "#{IMAGE_BASE}/food-healthy.png",
  "bakery" => "#{IMAGE_BASE}/food-bakery.png",
  "grocery" => "#{IMAGE_BASE}/food-grocery.png",
  "breakfast" => "#{IMAGE_BASE}/food-breakfast.png",
  "vegetarian" => "#{IMAGE_BASE}/food-vegetarian.png"
}.freeze

# Realistic dish templates: [name, description, category, base_price, emoji, image_key]
DISHES = [
  ["Fish Amok", "Steamed coconut fish curry in banana leaf.", "Khmer classics", 5.50, "🍲", "amok"],
  ["Chicken Amok", "Gentle coconut curry with chicken and kroeung.", "Khmer classics", 5.00, "🍲", "amok"],
  ["Prawn Amok", "Amok with fresh prawns and lemongrass.", "Khmer classics", 6.50, "🦐", "amok"],
  ["Beef Lok Lak", "Peppered beef cubes with lime-pepper dip.", "Khmer classics", 5.90, "🥩", "lok_lak"],
  ["Chicken Lok Lak", "Wok-tossed chicken with Kampot pepper.", "Khmer classics", 5.20, "🍗", "lok_lak"],
  ["Samlor Korko", "Traditional Cambodian mixed vegetable soup.", "Khmer classics", 4.50, "🥣", "amok"],
  ["Bai Sach Chrouk", "Grilled pork with rice and pickles.", "Breakfast", 3.50, "🍳", "breakfast"],
  ["Nom Banh Chok", "Khmer rice noodles with fish gravy.", "Noodles", 3.20, "🍜", "noodles"],
  ["Kuy Teav Phnom Penh", "Pork broth rice noodle soup.", "Noodles", 3.80, "🍜", "noodles"],
  ["Beef Pho", "Clear beef broth with flat rice noodles.", "Noodles", 4.20, "🍜", "noodles"],
  ["Chicken Pho", "Light chicken noodle soup with herbs.", "Noodles", 3.90, "🍜", "noodles"],
  ["Pad Thai Prawn", "Stir-fried rice noodles with prawns.", "Thai", 5.50, "🍛", "thai_curry"],
  ["Green Curry Chicken", "Thai green curry with Thai basil.", "Thai", 5.80, "🍛", "thai_curry"],
  ["Red Curry Beef", "Rich red curry with bamboo shoots.", "Thai", 6.20, "🍛", "thai_curry"],
  ["Tom Yum Goong", "Spicy sour prawn soup.", "Thai", 5.90, "🍜", "noodles"],
  ["Som Tum", "Green papaya salad with peanuts.", "Thai", 3.80, "🥗", "vegetarian"],
  ["Mango Sticky Rice", "Sweet sticky rice with ripe mango.", "Desserts", 3.50, "🥭", "dessert"],
  ["Coconut Pudding", "Chilled coconut milk pudding.", "Desserts", 2.80, "🍮", "dessert"],
  ["Chocolate Lava Cake", "Warm cake with molten chocolate centre.", "Desserts", 4.50, "🍰", "dessert"],
  ["Tiramisu Cup", "Coffee-soaked sponge dessert cup.", "Desserts", 4.20, "🍰", "dessert"],
  ["Classic Cheeseburger", "Beef patty, cheddar, pickles, soft bun.", "Burgers", 4.90, "🍔", "burger"],
  ["Chicken Burger", "Crispy chicken fillet burger.", "Burgers", 4.50, "🍔", "burger"],
  ["Double Smash Burger", "Two smash patties with cheese.", "Burgers", 6.50, "🍔", "burger"],
  ["Spicy Chicken Burger", "Crispy chicken with chilli mayo.", "Burgers", 5.20, "🍔", "burger"],
  ["Margherita Pizza", "Tomato, mozzarella, fresh basil.", "Pizza", 6.90, "🍕", "pizza"],
  ["Pepperoni Pizza", "Loaded pepperoni and mozzarella.", "Pizza", 7.90, "🍕", "pizza"],
  ["Seafood Pizza", "Prawn, squid and mozzarella.", "Pizza", 8.90, "🍕", "pizza"],
  ["Hawaiian Pizza", "Ham, pineapple and cheese.", "Pizza", 7.50, "🍕", "pizza"],
  ["BBQ Chicken Pizza", "Smoky BBQ chicken pizza.", "Pizza", 8.20, "🍕", "pizza"],
  ["Brown Sugar Boba", "Milk tea with brown sugar pearls.", "Drinks", 2.80, "🧋", "boba"],
  ["Matcha Latte", "Ceremonial-grade matcha milk tea.", "Drinks", 3.20, "🧋", "boba"],
  ["Thai Milk Tea", "Creamy Thai tea over ice.", "Drinks", 2.50, "🧋", "boba"],
  ["Passion Fruit Tea", "Iced fruit tea with pulp.", "Drinks", 2.60, "🧋", "boba"],
  ["Iced Latte", "Espresso with cold milk.", "Coffee", 2.90, "☕", "coffee"],
  ["Cappuccino", "Espresso with steamed milk foam.", "Coffee", 2.80, "☕", "coffee"],
  ["Vietnamese Coffee", "Strong drip coffee with condensed milk.", "Coffee", 2.50, "☕", "coffee"],
  ["Americano", "Espresso with hot water.", "Coffee", 2.20, "☕", "coffee"],
  ["Korean BBQ Short Ribs", "Marinated grilled galbi.", "Korean", 9.90, "🥩", "bbq"],
  ["Bulgogi Bowl", "Sweet soy beef over rice.", "Korean", 6.50, "🍖", "bbq"],
  ["Bibimbap", "Mixed rice bowl with egg and gochujang.", "Korean", 5.90, "🥗", "healthy"],
  ["Kimchi Fried Rice", "Spicy kimchi rice with fried egg.", "Korean", 4.80, "🍳", "breakfast"],
  ["Salmon Nigiri Set", "Fresh salmon nigiri platter.", "Japanese", 8.50, "🍣", "sushi"],
  ["California Roll", "Crab stick, avocado cucumber roll.", "Japanese", 5.50, "🍣", "sushi"],
  ["Spicy Tuna Roll", "Tuna roll with spicy mayo.", "Japanese", 6.20, "🍣", "sushi"],
  ["Chicken Teriyaki Bowl", "Teriyaki chicken over steamed rice.", "Japanese", 5.80, "🍱", "healthy"],
  ["Ramen Tonkotsu", "Pork bone broth ramen.", "Japanese", 6.90, "🍜", "noodles"],
  ["Crispy Fried Chicken", "Golden fried chicken pieces.", "Fried chicken", 5.50, "🍗", "fried_chicken"],
  ["Chicken Wings (6)", "Glazed chicken wings.", "Fried chicken", 4.80, "🍗", "fried_chicken"],
  ["Chicken Popcorn", "Bite-size crispy chicken.", "Fried chicken", 3.90, "🍗", "fried_chicken"],
  ["Steamed Dumplings", "Pork and chive dumplings.", "Chinese", 4.20, "🥟", "dumplings"],
  ["Xiao Long Bao", "Soup dumplings with pork.", "Chinese", 5.50, "🥟", "dumplings"],
  ["Mapo Tofu", "Sichuan spicy tofu with minced pork.", "Chinese", 5.20, "🌶️", "thai_curry"],
  ["Yangzhou Fried Rice", "Classic Chinese fried rice.", "Chinese", 4.00, "🍚", "breakfast"],
  ["Char Siu Rice", "BBQ pork roast over rice.", "Chinese", 5.50, "🍖", "bbq"],
  ["Caesar Salad", "Romaine, parmesan, croutons.", "Healthy", 4.50, "🥗", "healthy"],
  ["Salmon Poke Bowl", "Salmon, avocado, rice, edamame.", "Healthy", 7.20, "🥗", "healthy"],
  ["Quinoa Power Bowl", "Quinoa, greens and roasted veg.", "Healthy", 6.50, "🥗", "healthy"],
  ["Avocado Toast", "Smashed avocado on sourdough.", "Breakfast", 4.20, "🥑", "breakfast"],
  ["Eggs Benedict", "Poached eggs, hollandaise, muffin.", "Breakfast", 5.80, "🍳", "breakfast"],
  ["Pancake Stack", "Fluffy pancakes with maple syrup.", "Breakfast", 4.50, "🥞", "breakfast"],
  ["Tofu Buddha Bowl", "Tofu, greens, grains and tahini.", "Vegetarian", 5.90, "🥦", "vegetarian"],
  ["Veggie Spring Rolls", "Fresh rice paper rolls with herbs.", "Vegetarian", 3.50, "🥗", "vegetarian"],
  ["Mushroom Stir Fry", "Mixed mushrooms with garlic sauce.", "Vegetarian", 4.80, "🍄", "vegetarian"],
  ["Butter Croissant", "Flaky French-style croissant.", "Bakery", 1.80, "🥐", "bakery"],
  ["Baguette", "Crispy Cambodian-French baguette.", "Bakery", 1.20, "🥖", "bakery"],
  ["Chocolate Donut", "Soft donut with chocolate glaze.", "Bakery", 1.50, "🍩", "bakery"],
  ["Banana Bread Slice", "Moist banana loaf slice.", "Bakery", 2.00, "🍌", "bakery"],
  ["Fresh Mango (1kg)", "Keo Romeat mango season pack.", "Grocery", 3.50, "🥭", "grocery"],
  ["Mixed Salad Pack", "Washed salad greens.", "Grocery", 2.20, "🥬", "grocery"],
  ["Farm Eggs (10)", "Local free-range eggs.", "Grocery", 2.80, "🥚", "grocery"],
  ["Jasmine Rice 5kg", "Premium Cambodian jasmine rice.", "Grocery", 6.50, "🌾", "grocery"],
  ["Chicken Satay", "Grilled satay with peanut sauce.", "Grilled", 4.50, "🍢", "bbq"],
  ["Grilled Fish", "Whole grilled fish with chilli dip.", "Grilled", 7.50, "🐟", "bbq"],
  ["Beef Skewers", "Marinated beef skewers.", "Grilled", 5.20, "🍢", "bbq"],
  ["Laksa Bowl", "Coconut curry noodle soup.", "Noodles", 5.50, "🍜", "noodles"],
  ["Wonton Noodle Soup", "Clear broth with wonton and noodles.", "Noodles", 4.50, "🍜", "noodles"],
  ["Hainanese Chicken Rice", "Poached chicken with fragrant rice.", "Rice plates", 5.20, "🍗", "healthy"],
  ["Nasi Goreng", "Indonesian-style fried rice.", "Rice plates", 4.50, "🍚", "breakfast"],
  ["Garlic Butter Prawns", "Prawns in garlic butter.", "Seafood", 8.50, "🦐", "lok_lak"],
  ["Crispy Soft Shell Crab", "Fried soft shell crab.", "Seafood", 7.90, "🦀", "fried_chicken"],
  ["Lemon Cheesecake", "Creamy lemon cheesecake slice.", "Desserts", 4.00, "🍰", "dessert"],
  ["Fresh Coconut Juice", "Young coconut water with flesh.", "Drinks", 2.00, "🥥", "boba"],
  ["Smoothie Mango", "Blended mango smoothie.", "Drinks", 3.20, "🥭", "boba"]
].freeze

MODIFIERS = [
  nil,
  "House Special",
  "Chef's Choice",
  "Signature",
  "Family Size",
  "Lunch Set",
  "Spicy",
  "Mild",
  "Extra Portion",
  "Premium",
  "Combo",
  "Value Pack",
  "Weekend Special",
  "Street Style",
  "Home Style",
  "Phnom Penh Style",
  "Siem Reap Style",
  "Large",
  "Regular",
  "Mini"
].freeze

def slugify(value)
  value.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")
end

def image_for_existing(food)
  text = "#{food.name} #{food.menu_category&.name}".downcase
  key =
    if text.match?(/amok|korko|khmer/) then "amok"
    elsif text.match?(/lok lak|lok-lak/) then "lok_lak"
    elsif text.match?(/noodle|pho|kuy|ramen|laksa|wonton/) then "noodles"
    elsif text.match?(/burger/) then "burger"
    elsif text.match?(/pizza/) then "pizza"
    elsif text.match?(/boba|milk tea|tea|smoothie|juice|drink/) then "boba"
    elsif text.match?(/bbq|grill|satay|galbi|bulgogi|skew/) then "bbq"
    elsif text.match?(/sushi|nigiri|roll|sashimi/) then "sushi"
    elsif text.match?(/fried chicken|wing|crispy chicken/) then "fried_chicken"
    elsif text.match?(/coffee|latte|cappuccino|americano|espresso/) then "coffee"
    elsif text.match?(/curry|pad thai|tom yum|thai/) then "thai_curry"
    elsif text.match?(/dumpling|bao|wonton/) then "dumplings"
    elsif text.match?(/dessert|cake|pudding|mango sticky|cheesecake|tiramisu/) then "dessert"
    elsif text.match?(/salad|poke|healthy|quinoa|bowl/) then "healthy"
    elsif text.match?(/croissant|baguette|bakery|donut|bread/) then "bakery"
    elsif text.match?(/grocery|egg|rice 5|mango \(1|shampoo|market/) then "grocery"
    elsif text.match?(/breakfast|pancake|benedict|toast|bai sach/) then "breakfast"
    elsif text.match?(/veg|tofu|vegetarian|buddha/) then "vegetarian"
    else
      "healthy"
    end
  IMAGE_BY_KEY.fetch(key)
end

restaurants = Restaurant.order(:id).to_a
raise "No restaurants found. Seed the catalogue first." if restaurants.empty?

ActiveRecord::Base.transaction do
  # Attach white-background photos to existing foods.
  Food.find_each do |food|
    next if food.image_url.present?

    food.update!(image_url: image_for_existing(food))
  end

  needed = TARGET - Food.count
  if needed <= 0
    puts "Already have #{Food.count} foods (>= #{TARGET}). Images refreshed where missing."
  else
    created = 0
    index = 0

    while created < needed
      restaurant = restaurants[index % restaurants.size]
      dish = DISHES[index % DISHES.size]
      modifier = MODIFIERS[(index / DISHES.size) % MODIFIERS.size]
      variant = (index / (DISHES.size * MODIFIERS.size)) + 1

      name, description, category_name, price, emoji, image_key = dish
      display_name = [modifier, name].compact.join(" ")
      display_name = "#{display_name} ##{variant}" if variant > 1

      slug = "#{restaurant.slug}--#{slugify(display_name)}"
      unless Food.exists?(slug: slug)
        menu_category = MenuCategory.find_or_create_by!(restaurant: restaurant, name: category_name) do |mc|
          mc.position = restaurant.menu_categories.count
        end

        base_price = (price + ((index % 7) * 0.1)).round(2)
        discount = (index % 11).zero? ? (base_price * 0.85).round(2) : nil

        Food.create!(
          restaurant: restaurant,
          menu_category: menu_category,
          slug: slug,
          name: display_name,
          description: description,
          price: base_price,
          discount_price: discount,
          emoji: emoji,
          popular: (index % 17).zero?,
          available: true,
          prep_minutes: 10 + (index % 4) * 5,
          position: restaurant.foods.count,
          image_url: IMAGE_BY_KEY.fetch(image_key)
        )
        created += 1
      end

      index += 1
      raise "Could not generate enough unique foods" if index > TARGET * 40
    end

    puts "Created #{created} new foods."
  end
end

puts "Foods total: #{Food.count}"
puts "With images: #{Food.where.not(image_url: nil).count}"
puts "Sample: #{Food.order(:id).last(3).map { |f| "#{f.name} -> #{f.image_url}" }.join(' | ')}"
