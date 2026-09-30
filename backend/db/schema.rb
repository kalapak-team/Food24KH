# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_30_070000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "slug", null: false
    t.string "name", null: false
    t.string "name_km", null: false
    t.string "emoji"
    t.string "kind", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kind", "position"], name: "index_categories_on_kind_and_position"
    t.index ["slug"], name: "index_categories_on_slug", unique: true
    t.check_constraint "kind::text = ANY (ARRAY['cuisine'::character varying, 'shop_type'::character varying]::text[])", name: "categories_kind_check"
  end

  create_table "cities", force: :cascade do |t|
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_cities_on_name", unique: true
  end

  create_table "coupons", force: :cascade do |t|
    t.string "code", null: false
    t.string "description"
    t.string "discount_type", null: false
    t.decimal "value", precision: 10, scale: 2, default: "0.0", null: false
    t.decimal "minimum_order", precision: 10, scale: 2, default: "0.0", null: false
    t.decimal "maximum_discount", precision: 10, scale: 2
    t.integer "usage_limit"
    t.integer "used_count", default: 0, null: false
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_coupons_on_code", unique: true
    t.check_constraint "discount_type::text <> 'percent'::text OR value <= 100::numeric", name: "coupons_percent_check"
    t.check_constraint "discount_type::text = ANY (ARRAY['percent'::character varying, 'fixed'::character varying, 'free_delivery'::character varying]::text[])", name: "coupons_type_check"
    t.check_constraint "value >= 0::numeric AND minimum_order >= 0::numeric", name: "coupons_money_check"
  end

  create_table "deals", force: :cascade do |t|
    t.string "key", null: false
    t.string "title", null: false
    t.string "subtitle"
    t.bigint "restaurant_id", null: false
    t.string "section", default: "food", null: false
    t.string "tint_from"
    t.string "tint_to"
    t.string "emoji"
    t.boolean "active", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_deals_on_key", unique: true
    t.index ["restaurant_id"], name: "index_deals_on_restaurant_id"
    t.check_constraint "section::text = ANY (ARRAY['food'::character varying, 'shop'::character varying]::text[])", name: "deals_section_check"
  end

  create_table "exchange_rates", force: :cascade do |t|
    t.string "base_currency", default: "USD", null: false
    t.string "quote_currency", default: "KHR", null: false
    t.decimal "rate", precision: 14, scale: 4, null: false
    t.datetime "effective_from", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["base_currency", "quote_currency", "effective_from"], name: "index_exchange_rates_on_pair_and_effective_from", unique: true
    t.check_constraint "rate > 0::numeric", name: "exchange_rates_rate_check"
  end

  create_table "food_addons", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.string "key", null: false
    t.string "name", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["food_id", "key"], name: "index_food_addons_on_food_id_and_key", unique: true
    t.index ["food_id"], name: "index_food_addons_on_food_id"
    t.check_constraint "price >= 0::numeric", name: "food_addons_price_check"
  end

  create_table "food_option_choices", force: :cascade do |t|
    t.bigint "food_option_group_id", null: false
    t.string "key", null: false
    t.string "name", null: false
    t.decimal "price_delta", precision: 10, scale: 2, default: "0.0", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["food_option_group_id", "key"], name: "index_food_option_choices_on_food_option_group_id_and_key", unique: true
    t.index ["food_option_group_id"], name: "index_food_option_choices_on_food_option_group_id"
    t.check_constraint "price_delta >= 0::numeric", name: "food_option_choices_price_check"
  end

  create_table "food_option_groups", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.string "key", null: false
    t.string "name", null: false
    t.boolean "required", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["food_id", "key"], name: "index_food_option_groups_on_food_id_and_key", unique: true
    t.index ["food_id"], name: "index_food_option_groups_on_food_id"
  end

  create_table "foods", force: :cascade do |t|
    t.bigint "restaurant_id", null: false
    t.bigint "menu_category_id", null: false
    t.string "slug", null: false
    t.string "name", null: false
    t.text "description"
    t.decimal "price", precision: 10, scale: 2, null: false
    t.decimal "discount_price", precision: 10, scale: 2
    t.string "emoji"
    t.boolean "popular", default: false, null: false
    t.boolean "available", default: true, null: false
    t.integer "prep_minutes", default: 15, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_url"
    t.index ["image_url"], name: "index_foods_on_image_url"
    t.index ["menu_category_id"], name: "index_foods_on_menu_category_id"
    t.index ["restaurant_id"], name: "index_foods_on_restaurant_id"
    t.index ["slug"], name: "index_foods_on_slug", unique: true
    t.check_constraint "discount_price IS NULL OR discount_price >= 0::numeric AND discount_price < price", name: "foods_discount_price_check"
    t.check_constraint "price >= 0::numeric", name: "foods_price_check"
  end

  create_table "menu_categories", force: :cascade do |t|
    t.bigint "restaurant_id", null: false
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id", "name"], name: "index_menu_categories_on_restaurant_id_and_name", unique: true
    t.index ["restaurant_id"], name: "index_menu_categories_on_restaurant_id"
  end

  create_table "restaurant_categories", force: :cascade do |t|
    t.bigint "restaurant_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_restaurant_categories_on_category_id"
    t.index ["restaurant_id", "category_id"], name: "index_restaurant_categories_on_restaurant_id_and_category_id", unique: true
    t.index ["restaurant_id"], name: "index_restaurant_categories_on_restaurant_id"
  end

  create_table "restaurants", force: :cascade do |t|
    t.string "slug", null: false
    t.string "name", null: false
    t.string "kind", default: "restaurant", null: false
    t.string "status", default: "pending", null: false
    t.text "description"
    t.string "emoji"
    t.string "tint_from"
    t.string "tint_to"
    t.decimal "rating", precision: 2, scale: 1, default: "0.0", null: false
    t.integer "review_count", default: 0, null: false
    t.integer "delivery_minutes", default: 30, null: false
    t.decimal "delivery_fee", precision: 10, scale: 2, default: "0.0", null: false
    t.decimal "minimum_order", precision: 10, scale: 2, default: "0.0", null: false
    t.integer "price_level", default: 1, null: false
    t.decimal "distance_km", precision: 6, scale: 2
    t.boolean "is_open", default: true, null: false
    t.boolean "accepts_vouchers", default: true, null: false
    t.boolean "free_delivery_first_order", default: false, null: false
    t.string "promotion"
    t.integer "pickup_discount_percent"
    t.string "address"
    t.bigint "city_id"
    t.string "opening_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "logo_url"
    t.index ["city_id"], name: "index_restaurants_on_city_id"
    t.index ["kind", "status"], name: "index_restaurants_on_kind_and_status"
    t.index ["slug"], name: "index_restaurants_on_slug", unique: true
    t.check_constraint "delivery_fee >= 0::numeric AND minimum_order >= 0::numeric", name: "restaurants_money_check"
    t.check_constraint "kind::text = ANY (ARRAY['restaurant'::character varying, 'shop'::character varying]::text[])", name: "restaurants_kind_check"
    t.check_constraint "pickup_discount_percent IS NULL OR pickup_discount_percent >= 0 AND pickup_discount_percent <= 100", name: "restaurants_pickup_discount_check"
    t.check_constraint "price_level >= 1 AND price_level <= 3", name: "restaurants_price_level_check"
    t.check_constraint "rating >= 0::numeric AND rating <= 5::numeric", name: "restaurants_rating_check"
    t.check_constraint "status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'suspended'::character varying]::text[])", name: "restaurants_status_check"
  end

  add_foreign_key "deals", "restaurants", on_delete: :cascade
  add_foreign_key "food_addons", "foods", on_delete: :cascade
  add_foreign_key "food_option_choices", "food_option_groups", on_delete: :cascade
  add_foreign_key "food_option_groups", "foods", on_delete: :cascade
  add_foreign_key "foods", "menu_categories"
  add_foreign_key "foods", "restaurants", on_delete: :cascade
  add_foreign_key "menu_categories", "restaurants", on_delete: :cascade
  add_foreign_key "restaurant_categories", "categories", on_delete: :cascade
  add_foreign_key "restaurant_categories", "restaurants", on_delete: :cascade
  add_foreign_key "restaurants", "cities"
end
