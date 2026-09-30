class FoodOptionGroup < ApplicationRecord
  belongs_to :food
  has_many :choices, -> { order(:position) }, class_name: "FoodOptionChoice", dependent: :destroy

  validates :key, presence: true, uniqueness: { scope: :food_id }
  validates :name, presence: true
end
