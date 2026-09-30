class AddLogoUrlToRestaurants < ActiveRecord::Migration[8.1]
  def change
    add_column :restaurants, :logo_url, :string
  end
end
