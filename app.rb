require "sinatra"
require 'stripe'
require_relative "authentication.rb"

set :publishable_key, 'pk_test_QzPFEBocGtBYwRV8kHu71KX8' #ENV['PUBLISHABLE_KEY']
set :secret_key, 'sk_test_1uaXIj6rRI106ol3lWZCTke9' #ENV['SECRET_KEY']

Stripe.api_key = settings.secret_key

# need install dm-sqlite-adapter
# if on heroku, use Postgres database
# if not use sqlite3 database I gave you
if ENV['DATABASE_URL']
  DataMapper::setup(:default, ENV['DATABASE_URL'] || 'postgres://localhost/mydb')
else
  DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/app.db")
end

class Video
	include DataMapper::Resource

	property :id, Serial
	property :title, String
	property :description, String
	property :video_url, String
	property :pro, Boolean, :default => false
end

DataMapper.finalize
User.auto_upgrade!
Video.auto_upgrade!

#make an admin user if one doesn't exist!
if User.all(administrator: true).count == 0
	u = User.new
	u.email = "admin@admin.com"
	u.password = "admin"
	u.administrator = true
	u.save
end

#the following urls are included in authentication.rb
# GET /login
# GET /logout
# GET /sign_up

# authenticate! will make sure that the user is signed in, if they are not they will be redirected to the login page
# if the user is signed in, current_user will refer to the signed in user object.
# if they are not signed in, current_user will be nil

get "/" do
	erb :index
end

get "/videos" do
	authenticate!

	if current_user
		@videos = Video.all
		@cur_user = current_user
		erb :"video/videos_display"
	end
end

post "/videos/create" do
	if current_user.administrator == true
		title = params[:title]
		url = params[:video_url]
		description = params[:description]
		pro = params[:pro]

		if title && url && description && (!pro || pro)
			v = Video.new
			v.title = title
			v.video_url = url
			v.description = description
			if pro == "on"
				v.pro = true
			end
			v.save
		#	erb :"video:/video_successful"
		#else
		#	erb :"video:/video_unsuccessful"
		end
	else
		redirect "/"
	end
end

get "/videos/new" do
	authenticate!

	if current_user.administrator == true
		erb :"video/videos_create"
	else
		redirect "/"
	end
end

get "/upgrade" do
	authenticate!

	if current_user.pro == false && current_user.administrator == false
		erb :"stripe/pro_upgrade"
	else
		redirect "/"
	end
end

post "/charge" do
	current_user.pro = true
	current_user.save
	erb :"stripe/charged"
end