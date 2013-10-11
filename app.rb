require 'rubygems'
require 'sinatra'

get '/' do
  erb :index
end

get '/huilv' do
  HuiLv.getLastestRate
end

get '/huilvdate' do
  HuiLv.getLastestDate
end

get '/huilvrealtime' do
  HuiLv.getRealTimeRate
end