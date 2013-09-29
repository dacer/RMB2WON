require 'rubygems'
require 'sinatra'

get '/' do
  erb :index
end

get '/agent' do
  # use the views/agent.erb file
  erb :agent
end