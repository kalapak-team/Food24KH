module Api
  module V1
    class RestaurantsController < BaseController
      def index
        page = [params.fetch(:page, 1).to_i, 1].max
        per_page = [[params.fetch(:per_page, 24).to_i, 1].max, 60].min
        scope = Restaurant.approved.includes(:city, :categories, :foods).order(:name)
        scope = scope.where(kind: params[:kind]) if params[:kind].in?(%w[restaurant shop])

        total = scope.count
        restaurants = scope.offset((page - 1) * per_page).limit(per_page)

        render_success(
          data: restaurants.map { |restaurant| CatalogSerializer.restaurant(restaurant) },
          message: "Restaurants loaded",
          meta: {
            current_page: page,
            per_page: per_page,
            total: total,
            total_pages: (total.to_f / per_page).ceil
          }
        )
      end

      def show
        restaurant = Restaurant.approved.includes(:city, :categories, foods: [:menu_category, :addons, { option_groups: :choices }])
                               .find_by!(slug: params[:id])
        foods = restaurant.foods.sort_by(&:position)
        render_success(
          data: CatalogSerializer.restaurant(restaurant).merge(
            foods: foods.map { |food| CatalogSerializer.food(food) },
            menuCategories: foods.map { |food| food.menu_category.name }.uniq
          ),
          message: "Restaurant loaded"
        )
      rescue ActiveRecord::RecordNotFound
        render_error(message: "Restaurant not found", status: :not_found)
      end
    end
  end
end
