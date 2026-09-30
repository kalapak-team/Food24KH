# frozen_string_literal: true

namespace :cloudinary do
  desc "Upload backend/public/foods/white-bg images to Cloudinary and write URL map"
  task upload_foods: :environment do
    require "cloudinary"
    require "json"

    unless ENV["CLOUDINARY_URL"].present? || ENV["CLOUDINARY_API_SECRET"].present?
      abort "Set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET) before uploading."
    end

    dir = Rails.root.join("public/foods/white-bg")
    abort "Missing #{dir}" unless dir.directory?

    mapping = {}
    Dir.children(dir).sort.each do |filename|
      next unless filename.downcase.end_with?(".png", ".jpg", ".jpeg", ".webp")

      path = dir.join(filename)
      public_id = "food24kh/foods/white-bg/#{File.basename(filename, ".*")}"

      puts "Uploading #{filename} → #{public_id}"
      result = Cloudinary::Uploader.upload(
        path.to_s,
        public_id: public_id,
        overwrite: true,
        resource_type: "image",
        folder: nil
      )

      mapping[filename] = result.fetch("secure_url")
      mapping["/foods/white-bg/#{filename}"] = result.fetch("secure_url")
    end

    out = Rails.root.join("db/seeds/cloudinary_food_images.json")
    File.write(out, JSON.pretty_generate(mapping))
    puts "Wrote #{mapping.size / 2} assets → #{out}"
    mapping.select { |k, _| k.start_with?("/") }.each { |k, v| puts "  #{k} => #{v}" }
  end
end
