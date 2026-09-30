class Restaurant < ApplicationRecord
  KINDS = %w[restaurant shop].freeze
  STATUSES = %w[pending approved rejected suspended].freeze

  belongs_to :city, optional: true
  has_many :restaurant_categories, dependent: :destroy
  has_many :categories, through: :restaurant_categories
  has_many :menu_categories, -> { order(:position) }, dependent: :destroy
  has_many :foods, -> { order(:position) }, dependent: :destroy
  has_many :deals, dependent: :destroy

  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true
  validates :kind, inclusion: { in: KINDS }
  validates :status, inclusion: { in: STATUSES }
  validates :rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }
  validates :delivery_fee, :minimum_order, numericality: { greater_than_or_equal_to: 0 }
  validates :price_level, inclusion: { in: 1..3 }
  validates :pickup_discount_percent, numericality: { in: 0..100 }, allow_nil: true

  scope :approved, -> { where(status: "approved") }
end
