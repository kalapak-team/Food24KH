# frozen_string_literal: true

# Configured via CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET.
if ENV["CLOUDINARY_URL"].present? || ENV["CLOUDINARY_CLOUD_NAME"].present?
  Cloudinary.config_from_url(ENV["CLOUDINARY_URL"]) if ENV["CLOUDINARY_URL"].present?

  Cloudinary.config do |config|
    config.cloud_name = ENV["CLOUDINARY_CLOUD_NAME"] if ENV["CLOUDINARY_CLOUD_NAME"].present?
    config.api_key = ENV["CLOUDINARY_API_KEY"] if ENV["CLOUDINARY_API_KEY"].present?
    config.api_secret = ENV["CLOUDINARY_API_SECRET"] if ENV["CLOUDINARY_API_SECRET"].present?
    config.secure = true
  end
end
