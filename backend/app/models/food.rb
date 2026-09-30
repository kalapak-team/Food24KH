class Food < ApplicationRecord
  belongs_to :restaurant
  belongs_to :menu_category
  has_many :option_groups, -> { order(:position) }, class_name: "FoodOptionGroup", dependent: :destroy
  has_many :addons, -> { order(:position) }, class_name: "FoodAddon", dependent: :destroy

  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :image_url, length: { maximum: 500 }, allow_nil: true
  validates :discount_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :discount_below_price
  validate :menu_category_belongs_to_restaurant

  scope :available, -> { where(available: true) }

  private

  def discount_below_price
    return if discount_price.nil? || price.nil? || discount_price < price

    errors.add(:discount_price, "must be less than the price")
  end

  def menu_category_belongs_to_restaurant
    return if menu_category.nil? || menu_category.restaurant_id == restaurant_id

    errors.add(:menu_category, "must belong to the same restaurant")
  end
end
