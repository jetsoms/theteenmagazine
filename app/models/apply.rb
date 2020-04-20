class Apply < ActiveRecord::Base
  include MailForm::Delivery

  attributes :first_name,  :validate => true
  attributes :last_name,  :validate => true
  attributes :email, :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  attributes :description, :validate => true
  attributes :nickname,   :captcha => true

  self.per_page = 10

  def headers
  {
    :subject => "Writer Application ##{id}: theteenmagazine.com/applies/#{id}",
    :to => "editors@theteenmagazine.com",
    :from => %("#{first_name} #{last_name}" <#{email}>)
  }
  end
end
