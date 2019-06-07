class User < ActiveRecord::Base
  has_many :posts
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_attached_file :profile, styles: {
      thumb: '100x100>',
      square: '200x200#',
      medium: '300x300>'
    }

  # Validate the attached image is image/jpg, image/png, etc
  validates_attachment_content_type :profile, :content_type => /\Aimage\/.*\Z/

  extend FriendlyId
  friendly_id :set_full_name, use: :slugged

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  def set_full_name
    self.full_name = "#{self.first_name} #{self.last_name}"
    self.full_name
  end

  def should_generate_new_friendly_id?
    slug.blank? || first_name_changed? || last_name_changed?
  end
end
