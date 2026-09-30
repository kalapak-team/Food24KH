class CreateCatalogTables < ActiveRecord::Migration[8.1]
  def change
    create_table :cities do |t|
      t.string :name, null: false
      t.integer :position, null: false, default: 0
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :cities, :name, unique: true

    create_table :categories do |t|
      t.string :slug, null: false
      t.string :name, null: false
      t.string :name_km, null: false
      t.string :emoji
      t.string :kind, null: false
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :categories, :slug, unique: true
    add_index :categories, [:kind, :position]
    add_check_constraint :categories, "kind IN ('cuisine', 'shop_type')", name: "categories_kind_check"

    create_table :restaurants do |t|
      t.string :slug, null: false
      t.string :name, null: false
      t.string :kind, null: false, default: "restaurant"
      t.string :status, null: false, default: "pending"
      t.text :description
      t.string :emoji
      t.string :tint_from
      t.string :tint_to
      t.decimal :rating, precision: 2, scale: 1, null: false, default: 0
      t.integer :review_count, null: false, default: 0
      t.integer :delivery_minutes, null: false, default: 30
      t.decimal :delivery_fee, precision: 10, scale: 2, null: false, default: 0
      t.decimal :minimum_order, precision: 10, scale: 2, null: false, default: 0
      t.integer :price_level, null: false, default: 1
      t.decimal :distance_km, precision: 6, scale: 2
      t.boolean :is_open, null: false, default: true
      t.boolean :accepts_vouchers, null: false, default: true
      t.boolean :free_delivery_first_order, null: false, default: false
      t.string :promotion
      t.integer :pickup_discount_percent
      t.string :address
      t.references :city, foreign_key: true
      t.string :opening_hours
      t.timestamps
    end
    add_index :restaurants, :slug, unique: true
    add_index :restaurants, [:kind, :status]
    add_check_constraint :restaurants, "kind IN ('restaurant', 'shop')", name: "restaurants_kind_check"
    add_check_constraint :restaurants, "status IN ('pending', 'approved', 'rejected', 'suspended')", name: "restaurants_status_check"
    add_check_constraint :restaurants, "rating BETWEEN 0 AND 5", name: "restaurants_rating_check"
    add_check_constraint :restaurants, "delivery_fee >= 0 AND minimum_order >= 0", name: "restaurants_money_check"
    add_check_constraint :restaurants, "price_level BETWEEN 1 AND 3", name: "restaurants_price_level_check"
    add_check_constraint :restaurants, "pickup_discount_percent IS NULL OR pickup_discount_percent BETWEEN 0 AND 100",
                         name: "restaurants_pickup_discount_check"

    create_table :restaurant_categories do |t|
      t.references :restaurant, null: false, foreign_key: { on_delete: :cascade }
      t.references :category, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps
    end
    add_index :restaurant_categories, [:restaurant_id, :category_id], unique: true

    create_table :menu_categories do |t|
      t.references :restaurant, null: false, foreign_key: { on_delete: :cascade }
      t.string :name, null: false
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :menu_categories, [:restaurant_id, :name], unique: true

    create_table :foods do |t|
      t.references :restaurant, null: false, foreign_key: { on_delete: :cascade }
      t.references :menu_category, null: false, foreign_key: true
      t.string :slug, null: false
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.decimal :discount_price, precision: 10, scale: 2
      t.string :emoji
      t.boolean :popular, null: false, default: false
      t.boolean :available, null: false, default: true
      t.integer :prep_minutes, null: false, default: 15
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :foods, :slug, unique: true
    add_check_constraint :foods, "price >= 0", name: "foods_price_check"
    add_check_constraint :foods, "discount_price IS NULL OR (discount_price >= 0 AND discount_price < price)",
                         name: "foods_discount_price_check"

    create_table :food_option_groups do |t|
      t.references :food, null: false, foreign_key: { on_delete: :cascade }
      t.string :key, null: false
      t.string :name, null: false
      t.boolean :required, null: false, default: true
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :food_option_groups, [:food_id, :key], unique: true

    create_table :food_option_choices do |t|
      t.references :food_option_group, null: false, foreign_key: { on_delete: :cascade }
      t.string :key, null: false
      t.string :name, null: false
      t.decimal :price_delta, precision: 10, scale: 2, null: false, default: 0
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :food_option_choices, [:food_option_group_id, :key], unique: true
    add_check_constraint :food_option_choices, "price_delta >= 0", name: "food_option_choices_price_check"

    create_table :food_addons do |t|
      t.references :food, null: false, foreign_key: { on_delete: :cascade }
      t.string :key, null: false
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :food_addons, [:food_id, :key], unique: true
    add_check_constraint :food_addons, "price >= 0", name: "food_addons_price_check"

    create_table :deals do |t|
      t.string :key, null: false
      t.string :title, null: false
      t.string :subtitle
      t.references :restaurant, null: false, foreign_key: { on_delete: :cascade }
      t.string :section, null: false, default: "food"
      t.string :tint_from
      t.string :tint_to
      t.string :emoji
      t.boolean :active, null: false, default: true
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :deals, :key, unique: true
    add_check_constraint :deals, "section IN ('food', 'shop')", name: "deals_section_check"
  end
end
