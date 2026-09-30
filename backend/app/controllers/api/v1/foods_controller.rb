module Api
  module V1
    class FoodsController < BaseController
      def index
        page = [params.fetch(:page, 1).to_i, 1].max
        per_page = [[params.fetch(:per_page, 24).to_i, 1].max, 60].min
        scope = Food.includes(:restaurant, :menu_category, :option_groups, :addons)
                    .joins(:restaurant)
                    .where(restaurants: { status: "approved" })
                    .order(popular: :desc, id: :asc)

        scope = scope.where(popular: true) if ActiveModel::Type::Boolean.new.cast(params[:popular])
        scope = scope.where(restaurants: { slug: params[:restaurant_slug] }) if params[:restaurant_slug].present?
        if params[:q].present?
          q = "%#{ActiveRecord::Base.sanitize_sql_like(params[:q].to_s.strip)}%"
          scope = scope.where("foods.name ILIKE ? OR foods.description ILIKE ?", q, q)
        end

        total = scope.count
        foods = scope.offset((page - 1) * per_page).limit(per_page)

        render_success(
          data: foods.map { |food| CatalogSerializer.food_card(food) },
          message: "Foods loaded",
          meta: {
            current_page: page,
            per_page: per_page,
            total: total,
            total_pages: (total.to_f / per_page).ceil
          }
        )
      end

      def show
        food = Food.includes(:restaurant, :menu_category, :addons, option_groups: :choices)
                   .find_by!(slug: params[:id])
        render_success(data: CatalogSerializer.food(food), message: "Food loaded")
      rescue ActiveRecord::RecordNotFound
        render_error(message: "Food not found", status: :not_found)
      end
    end
  end
end
