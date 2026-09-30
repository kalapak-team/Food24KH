class ExchangeRate < ApplicationRecord
  validates :base_currency, :quote_currency, presence: true
  validates :rate, numericality: { greater_than: 0 }
  validates :effective_from, presence: true

  def self.current(base: "USD", quote: "KHR")
    where(base_currency: base, quote_currency: quote, active: true)
      .where(effective_from: ..Time.current)
      .order(effective_from: :desc)
      .first
  end
end
