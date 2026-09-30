class City < ApplicationRecord
  has_many :restaurants, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true

  scope :active, -> { where(active: true).order(:position) }
end
