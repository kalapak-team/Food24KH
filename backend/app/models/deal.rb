class Deal < ApplicationRecord
  SECTIONS = %w[food shop].freeze

  belongs_to :restaurant

  validates :key, presence: true, uniqueness: true
  validates :title, presence: true
  validates :section, inclusion: { in: SECTIONS }

  scope :active, -> { where(active: true).order(:position) }
end
