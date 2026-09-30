Rails.application.routes.draw do
  # Load balancer / uptime probe (Rails built-in)
  get "up" => "rails/health#show", as: :rails_health_check

  # Friendly landing for the public Railway URL (API-only app has no HTML homepage)
  root "api/v1/health#show"

  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"
      resources :foods, only: %i[index show]
      resources :restaurants, only: %i[index show]
    end
  end
end
