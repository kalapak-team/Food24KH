# Be sure to restart your server when you modify this file.
#
# CORS origins are controlled via CORS_ORIGINS (comma-separated).
# Never use "*" in production.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*ENV.fetch("CORS_ORIGINS", "http://localhost:3001,http://localhost:3002").split(",").map(&:strip))

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "Authorization" ],
      max_age: 600
  end
end
