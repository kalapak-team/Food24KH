class CreateCouponsAndExchangeRates < ActiveRecord::Migration[8.1]
  def change
    create_table :coupons do |t|
      t.string :code, null: false
      t.string :description
      t.string :discount_type, null: false
      t.decimal :value, precision: 10, scale: 2, null: false, default: 0
      t.decimal :minimum_order, precision: 10, scale: 2, null: false, default: 0
      t.decimal :maximum_discount, precision: 10, scale: 2
      t.integer :usage_limit
      t.integer :used_count, null: false, default: 0
      t.datetime :starts_at
      t.datetime :ends_at
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :coupons, :code, unique: true
    add_check_constraint :coupons, "discount_type IN ('percent', 'fixed', 'free_delivery')", name: "coupons_type_check"
    add_check_constraint :coupons, "value >= 0 AND minimum_order >= 0", name: "coupons_money_check"
    add_check_constraint :coupons, "discount_type <> 'percent' OR value <= 100", name: "coupons_percent_check"

    create_table :exchange_rates do |t|
      t.string :base_currency, null: false, default: "USD"
      t.string :quote_currency, null: false, default: "KHR"
      t.decimal :rate, precision: 14, scale: 4, null: false
      t.datetime :effective_from, null: false
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :exchange_rates, [:base_currency, :quote_currency, :effective_from], unique: true,
              name: "index_exchange_rates_on_pair_and_effective_from"
    add_check_constraint :exchange_rates, "rate > 0", name: "exchange_rates_rate_check"
  end
end
