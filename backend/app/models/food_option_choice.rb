class FoodOptionChoice < ApplicationRecord
  belongs_to :food_option_group

  validates :key, presence: true, uniqueness: { scope: :food_option_group_id }
  validates :name, presence: true
  validates :price_delta, numericality: { greater_than_or_equal_to: 0 }
end
