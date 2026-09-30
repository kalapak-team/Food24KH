class RestaurantCategory < ApplicationRecord
  belongs_to :restaurant
  belongs_to :category

  validates :category_id, uniqueness: { scope: :restaurant_id }
end
