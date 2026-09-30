class Coupon < ApplicationRecord
  DISCOUNT_TYPES = %w[percent fixed free_delivery].freeze

  before_validation { self.code = code.to_s.strip.upcase }

  validates :code, presence: true, uniqueness: true
  validates :discount_type, inclusion: { in: DISCOUNT_TYPES }
  validates :value, :minimum_order, numericality: { greater_than_or_equal_to: 0 }
  validates :value, numericality: { less_than_or_equal_to: 100 }, if: -> { discount_type == "percent" }
  validates :maximum_discount, numericality: { greater_than: 0 }, allow_nil: true

  scope :active, -> { where(active: true) }
end
