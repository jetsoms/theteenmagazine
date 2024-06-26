Rails.application.routes.draw do
  mount Ckeditor::Engine => "/ckeditor"
  devise_for :users,
             controllers: {
               registrations: "users/registrations",
               sessions: "users/sessions",
             }

  devise_scope :user do
    get "/login" => "users/sessions#new"
    get "/onboarding" => "users#onboarding"
    get "/editor-onboarding" => "users#editor_onboarding"
    post "/writers" => "users/registrations#create"
    post "/partners" => "users#create"
  end

  resources :users, path: "writers", except: [:new]
  resources :users, only: [:index] do
    post :impersonate, on: :member
    post :stop_impersonating, on: :collection
  end
  
  resources :users, path: "partners", only: [:new]
  resources :contacts, only: %i[new create]
  resources :applies
  resources :categories
  resources :pitches
  resources :reviews
  resources :feedbacks
  resources :subscribers
  resources :constants
  resources :analytics
  resources :comments
  resources :outreaches
  resources :newsletters
  resources :invitations
  resources :pages

  #asynchronously fetched
  get :get_trending_posts, controller: :welcome
  get :get_recent_posts, controller: :welcome

  get :get_recent_posts_in_category, controller: :posts
  get :get_conversations_following, controller: :posts
  get :get_promoted_posts, controller: :posts
  get :get_comments_published, controller: :posts
  get :generate_shareable_token, controller: :posts
  get :get_header_image, controller: :posts

  get :get_all_comments, controller: :comments
  get :get_all_review_comments, controller: :comments

  get :get_sent_invitations, controller: :invitations
  get :get_sent_invitations_admin, controller: :invitations
  get :dismissed_notification, controller: :invitations

  get :get_profile, controller: :users
  get :get_editor_stats, controller: :users
  get :get_past_invites, controller: :users
  get :get_published_articles, controller: :users

  get :get_editor_activity, controller: :reviews
  get :enable_notify_of_new_review, controller: :reviews
  get :disable_notify_of_new_review, controller: :reviews

  get :send_test_newsletter, controller: :newsletters
  get :send_to_audience, controller: :newsletters

  get "welcome/index"
  root "welcome#index"

  get '/ads.txt', to: redirect('https://ads.adthrive.com/sites/6581f45a00f9c812fa0bcb0c/ads.txt', status: 301)
  get "/community" => "posts#index"
  get "/categories/:id/dashboard" => "categories#dashboard"
  get "/admin/dashboard" => "categories#admin_dashboard"
  get "/categories/:id/team" => "categories#team"
  get "/interviews" => "pitches#interviews"
  get "/interviews/new" => "pitches#new_interview"
  get "/interviews/:id/edit" => "pitches#edit_interview"
  get "/drafts/:id" => "posts#draft"
  get "/drafts/:id/edit" => "posts#edit"
  get "criteria" => "pages#criteria"
  get "about-us" => "pages#team"
  get "contact-us" => "pages#contact"
  get "choosing-a-topic" => "pages#topics"
  get "/pitch-requirements" => "pages#reviewing_pitches"
  get "/article-requirements" => "pages#reviewing_articles"
  get "/pitching-new-articles" => "pages#pitching_new_articles"
  get "/editor-requirements" => "pages#start"
  get "/editor-onboarding" => "users#editor_onboarding"
  get "/editors/:id" => "reviews#index"
  get "writing-the-perfect-article" => "pages#writing"
  get "finding-images" => "pages#images"
  get "formatting" => "pages#formatting"
  get "checklist" => "pages#checklist"
  get "ranking" => "pages#ranking"
  get "privacy-policy" => "pages#privacy"
  get "copyright-policy" => "pages#copyright"
  get "subscribe" => "pages#subscribe"
  get "email-preferences" => "pages#email_preferences"
  post "email-preferences", to: "pages#email_preferences"
  get "manage-images" => "pages#manage_images"
  get "trending" => "pages#trending"
  get "most-viewed" => "pages#most_viewed"
  get "newsletters/:id/featured-posts" => "newsletters#featured"
  get "newsletters/users/:recipient_id" => "newsletters#send_user_email", :as => :send_user_email
  get "newsletters/manage/:manager_id" => "newsletters#manage_newsletters"
  get "reviews:post_id" => "pages#reviews"
  get "/apply" => "applies#new"
  get "/applications/editor", to: "applies#editor"
  get "/submitted" => "applies#create"
  get "/reset-password" => "pages#reset"
  get "/search" => "pages#search"
  get "/sitemap.xml", to: "pages#sitemap"
  get "/users/:id", to: "users#redirect"
  get "/partners/:id", to: "users#partner"
  get "/partners/:id/edit", to: "users#edit"
  get "/partners", to: "users#partners"
  get "/editors", to: "users#editors"
  get "/managing-editors", to: "users#managing_editors"
  get "/editors/:id/edit", to: "users#edit"
  get "/interviewers", to: "users#interviewers"
  get "/partners/:id/share", to: "users#share"
  get "/writers/:id/extensions", to: "users#extensions"
  get "/writers/:id/invitations", to: "invitations#index"
  get "/writers/:slug/invitations/:token", to: "invitations#show"
  get "/partners/:id/published", to: "users#sponsored"
  get "/september-2021-bexesyjj-bxducjpuj-hrhhqug-xqkoktbve", to: "pages#issue"
  post "/september-2021-bexesyjj-bxducjpuj-hrhhqug-xqkoktbve", to: "pages#issue"
  post "/posts/:id/subscribe", to: "posts#subscribe"

  get '/autocomplete/posts', to: 'posts#autocomplete'
  get '/autocomplete/writers', to: 'users#autocomplete'

  patch "users/:id/:post_id/modal" => "users#post_modal", :as => :post_modal
  patch "users/:id/:post_id/promote" => "users#promote_post",
        :as => :promote_post

  patch "pitches/:id/modal" => "pitches#pitch_modal", :as => :pitch_modal
  post "pitches/:id/claim" => "pitches#pitch_onboarding_claim",
       :as => :pitch_onboarding_claim
  patch "pitches/:id/unclaim" => "pitches#pitch_onboarding_unclaim",
        :as => :pitch_onboarding_unclaim

  post "writers/:slug/invitations/:token/apply_through_invitation" => "invitations#apply_through_invitation",
       :as => :apply_through_invitation

  get "/community", to: "posts#index"
  post "/community", to: "posts#index"

  # Token endpoint
  get 'token/generate', to: 'token#generate'
  post 'token/generate', to: 'token#generate'

  resources :posts, only: %i[new create index] do
    member { patch :update_newsletter }
  end
  resources :posts, path: "", except: %i[new create]
end
