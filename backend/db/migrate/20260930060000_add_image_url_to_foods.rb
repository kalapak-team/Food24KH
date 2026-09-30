class AddImageUrlToFoods < ActiveRecord::Migration[8.1]
  def change
    add_column :foods, :image_url, :string
    add_index :foods, :image_url
  end
end
