# frozen_string_literal: true

namespace :cloudinary do
  FOLDER = "image_food24kh/foods/white-bg"

  desc "Upload backend/public/foods/white-bg images to Cloudinary folder image_food24kh"
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
      public_id = "#{FOLDER}/#{File.basename(filename, ".*")}"

      puts "Uploading #{filename} → #{public_id}"
      result = Cloudinary::Uploader.upload(
        path.to_s,
        public_id: public_id,
        overwrite: true,
        resource_type: "image"
      )

      mapping[filename] = result.fetch("secure_url")
      mapping["/foods/white-bg/#{filename}"] = result.fetch("secure_url")
    end

    out = Rails.root.join("db/seeds/cloudinary_food_images.json")
    File.write(out, JSON.pretty_generate(mapping))
    puts "Wrote #{mapping.size / 2} assets → #{out}"
    mapping.select { |k, _| k.start_with?("/") }.each { |k, v| puts "  #{k} => #{v}" }
  end

  desc "Move food images from food24kh/... into image_food24kh/... and update Neon URLs"
  task move_to_image_food24kh: :environment do
    require "cloudinary"
    require "json"

    unless ENV["CLOUDINARY_URL"].present? || ENV["CLOUDINARY_API_SECRET"].present?
      abort "Set CLOUDINARY_URL before moving."
    end

    # Re-upload into the target folder (more reliable than rename over flaky networks).
    Rake::Task["cloudinary:upload_foods"].reenable
    Rake::Task["cloudinary:upload_foods"].invoke

    mapping = JSON.parse(File.read(Rails.root.join("db/seeds/cloudinary_food_images.json")))

    updated = 0
    Food.find_each do |food|
      next if food.image_url.blank?

      basename = File.basename(URI.parse(food.image_url).path).sub(/\.(jpg|jpeg|png|webp)\z/i, "")
      local_key = "/foods/white-bg/#{basename}.png"
      new_url = mapping[local_key] || mapping["#{basename}.png"] || food.image_url.gsub("/food24kh/", "/image_food24kh/")
      next if new_url == food.image_url

      food.update!(image_url: new_url)
      updated += 1
    end
    puts "Updated #{updated} food image URLs in the database."

    # Best-effort cleanup of old food24kh/ assets
    deleted = 0
    next_cursor = nil
    begin
      loop do
        result = Cloudinary::Api.resources(type: "upload", prefix: "food24kh/", max_results: 100, next_cursor: next_cursor)
        ids = Array(result["resources"]).map { |r| r["public_id"] }
        if ids.any?
          Cloudinary::Api.delete_resources(ids)
          deleted += ids.size
          puts "Deleted #{ids.size} old assets under food24kh/"
        end
        next_cursor = result["next_cursor"]
        break if next_cursor.blank?
      end
    rescue StandardError => e
      puts "Cleanup warning (old folder may still exist): #{e.message}"
    end
    puts "Done. Moved into image_food24kh/. Deleted #{deleted} old food24kh assets."
  end
end
