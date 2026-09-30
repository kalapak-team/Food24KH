class MenuCategory < ApplicationRecord
  belongs_to :restaurant
  has_many :foods, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
end
