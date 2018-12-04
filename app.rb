require "sinatra"
require "stripe"
require_relative "authentication.rb"

# set stripe publishable key
# Set stripe secret key
# Stripe.api_key = settings.secret_key

#H_1 = {"Property" => user_id}

number_of_players = 0

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
	property :id, Serial
	property :player_name, String
	property :current_money, Integer
	property :session_id, Integer
	property :user_id, Integer

end

class Properties
	include DataMapper::Resource
	property :id, Serial
	property :property_name, String
	property :property_color, String
end

class Player_Properties 
	include DataMapper::Resource
	property :id, Serial
	property :player_id, Integer
	property :monopoly_property_id, Integer
	property :monopoly_property_name, String
end

class Session
	include DataMapper::Resource
	property :id, Serial
	property :user_id, Integer
	property :tabletop_game_name, String
	property :session_user_id, Integer
end

DataMapper.finalize
Monopoly_player.auto_upgrade!
User.auto_upgrade!
Tabletop.auto_upgrade!
Properties.auto_upgrade!
Player_Properties.auto_upgrade!
Session.auto_upgrade!


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

#displays all tabletop games available with their respective textboxes 
#so that the user says how many players they have in their session
get "/tabletop_display" do
	authenticate!
	@tabletops = Tabletop.all
	@cur_user = current_user
	erb :"tabletop/tabletop_display"
end

#checks if you are allowed to create a new tabletop
get "/tabletop/new" do
	authenticate!
	# Must be an admin to access this page
	if current_user.role == 2
		erb :"tabletop/tabletop_create"
	else
		redirect "/"
	end
end

#creates a tabletop to be displayed in the tabletop_display
post "/tabletop/create" do
	authenticate!
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
			t.save
			@tabletops = Tabletop.all	
			erb :"tabletop/tabletop_display"
		end
	else
		redirect "/"
	end
end


#this post request is used to make sure we get the right
#number of players and make sure we display the right amount
#of players.
post "/monopoly_Original_form" do
	authenticate!
	#---------------------------------------------------------------#
	#variable used to know how many text boxes the form should show
	@number_of_players = 0
	#changes name of parameter
	@player_string = ""
	#iterator for parameter name change
	@iterator_for_names = 1
	#---------------------------------------------------------------#
	
	if params[:number_of_players] && params[:number_of_players].to_i <= 8
		@number_of_players = params[:number_of_players].to_i
	else
		@number_of_players = 8
	end
	number_of_players = @number_of_players

	#form with the correct number of players
	#there's alot of logic in erb form, however
	#it is only used to show the correct number of textboxes
	erb :"tabletop/monopoly_Original_form"
end


#this post request is used to create the players of the session
post "/monopoly_Original_form/properties" do
	authenticate!
	iterator = 1
	session_id_locator = Session.all(:user_id => current_user.id).count + 1
	puts session_id_locator
	while (iterator <= number_of_players) do 
		if (params['Player_' + iterator.to_s])
			m = Monopoly_player.new
			m.player_name = params['Player_' + iterator.to_s]
			m.current_money = params['Money_' + iterator.to_s].to_i
			m.session_id = session_id_locator
			m.user_id = current_user.id
			m.save
			iterator = iterator + 1
		end
	end
	#---------------------------------------------------------------#
	#iterator for parameter name change
	@iterator_for_parameter_names = 1
	#---------------------------------------------------------------#
	@players = Monopoly_player.all(:session_id => session_id_locator, :user_id => current_user.id)
	@properties = Properties.all()
	erb :"tabletop/monopoly_Original_properties_form"
end

post "/monopoly_Original_form/create" do
	authenticate!
	property_iterator = 1
	session_id_locator = Session.all(:user_id => current_user.id).count + 1
	while (property_iterator <= 28)
		pp = Player_Properties.new
		monopoly_player_id = Monopoly_player.all(:player_name => params["Property" + property_iterator.to_s + "\"\""], :session_id => session_id_locator, :user_id => current_user.id)
		monopoly_player_id.each do |mono_player|
			pp.player_id = mono_player.id
			pp.monopoly_property_id = Properties.get(property_iterator).id
			pp.monopoly_property_name = Properties.get(property_iterator).property_name
			pp.save
		end
		property_iterator += 1 
	end
	s = Session.new
	s.user_id = current_user.id
	s.tabletop_game_name = "Monopoly_Original"
	s.session_user_id = session_id_locator
	s.save
	@sessions = Session.all(:user_id => current_user.id)
	erb :session_list
end

post "/monopoly_original_session_form" do
	authenticate!
	@properties_for_session = []
	iterator_for_properties = 0
	session_locator = Session.all(:user_id => current_user.id)
	current_session = params[:Session]
	puts session_locator
	puts current_session
	session_locator.each do |session|
		@players = Monopoly_player.all(:session_id => current_session, :user_id => current_user.id)
		puts @players
	end	
	@players.each do |player|
		@properties_for_session[iterator_for_properties] = Player_Properties.all(:player_id => player.id)
		iterator_for_properties += 1
	end
	erb :"tabletop/monopoly_original_session_form"
end

get "/session_list" do
	authenticate!
	@sessions = Session.all(:user_id => current_user.id)
	erb :session_list
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