require 'rubygems'
require 'bundler'

Bundler.require

require './app.rb'
require './ExchangeUtils.rb'
run Sinatra::Application