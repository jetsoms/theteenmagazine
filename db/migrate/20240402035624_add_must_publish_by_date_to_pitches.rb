class AddMustPublishByDateToPitches < ActiveRecord::Migration[7.0]
  def change
    add_column :pitches, :must_publish_by_date, :timestamp
  end
end
