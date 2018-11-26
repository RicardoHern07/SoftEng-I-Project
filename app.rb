require "sinatra"
require "stripe"
require_relative "authentication.rb"

# set stripe publishable key
# Set stripe secret key
# Stripe.api_key = settings.secret_key

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

class Tabletop
	include DataMapper::Resource

	property :id, Serial
	property :name, String
	property :version, String
	property :max_players, Integer

	# Should there be tabletop game sessions 
	# that only pro users can save? 
	# property :pro, Boolean, :default => false
end

class Monopoly_player
	include DataMapper::Resource

	property :player_name
	property :current_money
	
end

DataMapper.finalize
Monopoly_player.auto_upgrade!
User.auto_upgrade!
Tabletop.auto_upgrade!

# Create admins
if User.all(role: 2).count == 0
	u = User.new
	u.email = "admin@admin.com"
	u.user_name = "admin"
	u.password = "admin"
	u.role = 2
	u.save
end

get "/" do
	erb :index
end

get "/tabletop_display" do
	authenticate!
	@tabletops = Tabletop.all
	@cur_user = current_user
	erb :"tabletop/tabletop_display"
end

get "/tabletop/new" do
	authenticate!

	# Must be an admin to access this page
	if current_user.role == 2
		erb :"tabletop/tabletop_create"
	else
		redirect "/"
	end
end

post "/tabletop/create" do
	if current_user.role == 2
		tabletop_name = params[:tabletop_name]
		tabletop_version = params[:tabletop_version]
		tabletop_max_players = params[:tabletop_max_players]
		# tabletop_pro = params[:pro]

		if tabletop_name && tabletop_version && tabletop_max_players # && (!pro || pro)
			t = Tabletop.new
			t.name = tabletop_name
			t.version = tabletop_version
			t.max_players = tabletop_max_players
			# if tabletop_pro = "on"
			# 	t.pro = true
			# end
			puts "Tabletop saved"
			t.save
			@tabletops = Tabletop.all	
			erb :"tabletop/tabletop_display"
		end
	else
		redirect "/"
	end
end

get "/monopoly_Gamers_form" do 
	erb :Monopoly_Gamers
end

get "/upgrade" do
	authenticate!

	if current_user.role == 0
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

get "/dashboard" do
	erb :dashboard
end

post "/sign_up" do
	erb :sign_up
end