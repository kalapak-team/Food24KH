class Category < ApplicationRecord
  KINDS = %w[cuisine shop_type].freeze

  has_many :restaurant_categories, dependent: :destroy
  has_many :restaurants, through: :restaurant_categories

  validates :slug, presence: true, uniqueness: true
  validates :name, :name_km, presence: true
  validates :kind, inclusion: { in: KINDS }

  scope :cuisines, -> { where(kind: "cuisine").order(:position) }
  scope :shop_types, -> { where(kind: "shop_type").order(:position) }
end
