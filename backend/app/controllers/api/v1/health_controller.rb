module Api
  module V1
    class HealthController < ApplicationController
      def show
        render json: {
          success: true,
          message: "Food24KH API is running",
          data: {
            service: "Food24KH API",
            version: "v1",
            status: "ok",
            timestamp: Time.current.iso8601
          }
        }, status: :ok
      end
    end
  end
end
