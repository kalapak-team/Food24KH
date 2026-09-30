module Api
  module V1
    class BaseController < ApplicationController
      private

      def render_success(data:, message: "OK", meta: nil, status: :ok)
        payload = { success: true, message: message, data: data }
        payload[:meta] = meta if meta
        render json: payload, status: status
      end

      def render_error(message:, status: :unprocessable_entity, errors: nil)
        payload = { success: false, message: message }
        payload[:errors] = errors if errors
        render json: payload, status: status
      end

      def pagination_meta(scope)
        {
          current_page: scope.current_page,
          per_page: scope.limit_value,
          total: scope.total_count,
          total_pages: scope.total_pages
        }
      end
    end
  end
end
