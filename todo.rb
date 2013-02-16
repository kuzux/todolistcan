require 'rubygems'
require 'bundler/setup'

require 'sinatra/base'
require 'json'
require 'sequel'

DB = Sequel.sqlite("todo.sqlite3")
Sequel::Model.plugin :timestamps
Sequel::Model.plugin :json_serializer
Sequel::Model.plugin :validation_helpers

class Item < Sequel::Model
    def validate
        super
        validates_presence :text
        validates_unique :text
    end
end

class Todo < Sinatra::Base
    helpers do
        def json(obj)
            content_type :json
            obj.to_json
        end
        def json_status(code, reason)
            status code
            json(:status => code, :reason => reason)
        end
    end

    get '/' do
        send_file File.join(settings.public_folder, 'index.html')
    end

    get '/items/?' do
        json Item.all
    end

    get '/items/:id/?' do
        item = Item[params[:id].to_i]
        if item.nil?
            json_status 404, "Todo Item does not exist"
        else
            json item
        end
    end

    delete '/items/:id/?' do
        item = Item[params[:id].to_i]
        if item.nil?
            json_status 404, "Todo Item does not exist"
        else
            if item.destroy
                json_status 200, ""
            else 
                json_status 500, "Failed to delete Todo Item"
            end
        end
    end

    post '/items/?' do
        begin
            req = JSON.parse(request.body.read)
            item = Item.new(req)
            if item.save
                status 201
                json item
            else
                json_status 500, "Failed to create Todo Item"
            end
        rescue Sequel::ValidationFailed
            json_status 409, item.errors.full_messages
        end
    end

    put '/items/:id/?' do
        req = JSON.parse(request.body.read)
        item = Item[params[:id].to_i]
        if item.nil?
            json_status 404, "Todo Item does not exist"
        else
            if item.update(req)
                json item
            else
                json_status 500, "Failed to update Todo Item"
            end
        end
    end
end
