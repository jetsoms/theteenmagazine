class Post < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :category
  has_many :impressions

  validates :title, :presence => true
  validates :content, :presence => true

  scope :approved, -> {
  where(approved: true, after_approved: true)
  }
  scope :waiting_for_approval, -> {
  where(waiting_for_approval: true, approved: false)
  }
  scope :waiting_to_be_published, -> {
  where(approved: true, after_approved: nil)
  }
  scope :after_approved, -> {
  where(:after_approved => nil, :approved => true)
  }
  scope :fashion, -> {
  where(approved: true, after_approved: true, :meta_title => "Fashion")
  }
  scope :beauty, -> {
  where(approved: true, after_approved: true, :meta_title => "Beauty")
  }
  scope :health, -> {
  where(approved: true, after_approved: true, :meta_title => "Health & Fitness")
  }
  scope :tips, -> {
  where(approved: true, after_approved: true, :meta_title => "Tips & Hacks")
  }
  scope :academics, -> {
  where(approved: true, after_approved: true, :meta_title => "Academics")
  }
  scope :entertainment, -> {
  where(approved: true, after_approved: true, :meta_title => "Entertainment")
  }
  scope :get_involved, -> {
  where(approved: true, after_approved: true, :meta_title => "Get Involved")
  }
  scope :trends, -> {
  where(approved: true, after_approved: true, :meta_title => "Trends")
  }
  scope :other, -> {
  where(approved: true, after_approved: true, :meta_title => ['Health & Fitness', 'Lifestyle', 'Trends', 'Academics', 'Tips & Hacks', 'DIY', 'Travel', 'Love & Relationships'] )
  }

  scope :first_rank, -> {
  where(:ranking => 1)
  }
  scope :second_rank, -> {
  where(:ranking => 2)
  }
  scope :third_rank, -> {
  where(:ranking => 3)
  }
  scope :fourth_rank, -> {
  where(:ranking => 4)
  }
  scope :fifth_rank, -> {
  where(:ranking => 5)
  }
  scope :sixth_rank, -> {
  where(:ranking => 6)
  }
  scope :seventh_rank, -> {
  where(:ranking => 7)
  }
  scope :eighth_rank, -> {
  where(:ranking => 8)
  }
  scope :nineth_rank, -> {
  where(:ranking => 9)
  }
  scope :tenth_rank, -> {
  where(:ranking => 10)
  }

  has_attached_file :thumbnail, styles: {
      medium: '270x170#',
      large: '560x280#',
      large2: '540x340#'
    }

    # Validate the attached image is image/jpg, image/png, etc
    validates_attachment_content_type :thumbnail, :content_type => /\Aimage\/.*\Z/


  extend FriendlyId
  friendly_id :title, use: :slugged

  def should_generate_new_friendly_id?
    slug.blank? || title_changed?
  end

end
