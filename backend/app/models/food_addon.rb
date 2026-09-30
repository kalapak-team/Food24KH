class FoodAddon < ApplicationRecord
  belongs_to :food

  validates :key, presence: true, uniqueness: { scope: :food_id }
  validates :name, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
end
