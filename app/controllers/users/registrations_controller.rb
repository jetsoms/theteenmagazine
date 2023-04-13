class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :verify_authenticity_token
  skip_before_action :require_no_authentication, only: %i[new create]

  # All users should first have an application
  def new
    redirect_to "/apply"
  end

  # POST /resource
  def create
    build_resource(sign_up_params)

    # create a new user with sign up params
    @user = resource
    if params[:decision].eql? "Accept"
      resource.save

      # from devise code
      yield resource if block_given?
      if resource.persisted?
        if resource.active_for_authentication?
          sign_up(resource_name, resource)
        else
          expire_data_after_sign_in!
        end
        # send welcome email
        ApplicationMailer.welcome_email(resource).deliver
        begin
          # subscribe to TTM newsletter
          maybe_subscriber = Subscriber.find_by(email: resource.email)
          if !maybe_subscriber.present?
            @token = SecureRandom.urlsafe_base64
            subscriber = Subscriber.new(
                email: resource.email, 
                first_name: resource.first_name, 
                last_name: resource.last_name, 
                token: @token,
                source: "Became a writer",
                opted_in_at: Time.now,
                subscribed_to_reader_newsletter: true,
                subscribed_to_writer_newsletter: true,
            )
            subscriber.save
          else
            maybe_subscriber.update_columns({
              first_name: resource.first_name, 
              last_name: resource.last_name, 
              user_id: resource.id,
              subscribed_to_reader_newsletter: true,
              subscribed_to_writer_newsletter: true,
            })
          end
        rescue StandardError
          puts "Error: Failed to create subscriber"
        end
        @application = Apply.find_by(email: @user.email.downcase)
        @application.update(user_id: resource.id)
        if @application.invitation.present?
          @application.invitation.update_column("status", "Accepted")
        end

        # if user was saved, then redirect to user path
        redirect_to applies_path, notice: "Application successfully accepted."
      else
        # user model did not persist
        clean_up_passwords resource
        set_minimum_password_length
        redirect_to "/writers/", notice: "Something went wrong."
      end
    else
      @application = Apply.find_by(email: @user.email.downcase)
      @application.update(rejected_writer_at: Time.now)
      if @application.invitation.present?
        @application.invitation.update_column("status", "Not accepted")
      end
      ApplicationMailer.rejection_email(resource).deliver
      redirect_to applies_path, notice: "Application was rejected."
    end
  end

  def sign_up(resource_name, resource)
    true
  end

  protected

  # def after_sign_up_path_for(resource)
  #   users_path
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   "/submitted/"
  # end

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  def after_update_path_for(resource)
    user_path(resource)
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   "/users/submitted/"
  # end
end
