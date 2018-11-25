require 'data_mapper' # metagem, requires common plugins too.

class User
    include DataMapper::Resource

    property :id, Serial
    property :email, String
    property :user_name, String
    property :password, String
    property :created_at, DateTime
    # Roles: 0-Regular, 1-Pro, 2-Admin
    property :role, Integer, :default => 0
    property :number_sessions, Integer, :default => 0
    
    def login(password)
        return self.password == password
    end
end

