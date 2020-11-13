# app.py
from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_sqlalchemy
import flask_socketio
import models 
import db_queries
import requests
import json
import random
from db_utils import db
import db_queries
import db_utils

SEARCHES_RECEIVED_CHANNEL = 'search results received'
SEND_RECIPES_CHANNEL = 'recipes received'
SEND_ONE_RECIPE_CHANNEL = 'recipe page load'

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
spoonacular_key = os.getenv('spoonacular_key')


global username
username = ""
cart_collection = {}


def emit_all_recipes(channel):
    recipes = db_queries.get_n_recipes(10)
    for recipe in recipes:
        username = db_queries.get_user(recipe["user"])['name']
        recipe['name'] = username
    all_searches =  recipes
    client_id = flask.request.sid
    #print(all_searches)    
    socketio.emit(channel, {
        'all_display': all_searches,
        'username': username
    },room=client_id)
    
def emit_recipe(channel,recipe):
    client_id = flask.request.sid
    socketio.emit(channel, {
        'recipe': recipe
    },
    room=client_id)
    
    
# def push_new_user_to_db(name, profile, auth_type):
#     db.session.add(models.AuthUser(name, profile, auth_type));
#     db.session.commit();
    
@socketio.on('new google user')
def on_new_google_user(data):
    print("Got an event for new google user input with data:", data)
    global username
    user = db_queries.add_user(data)
    username = db_queries.get_user(user)['name']
    print("THIS IS " + username)
    # push_new_user_to_db(data['name'], data['profile'], models.AuthUserType.GOOGLE)
    username = data['name']
    print("THIS IS " + username)

@socketio.on('connect')
def on_connect():
    emit_all_recipes(SEND_RECIPES_CHANNEL)
    print('Someone connected!')
    cart_collection[flask.request.sid] = []
    socketio.emit('connected', {
        'test': 'Connected'
    })

@socketio.on('disconnect')
def on_disconnect():
    print ('Someone disconnected!')
    
@socketio.on('recipe page')
def on_recipe_page(data):
    print('received data from client ' + str(data['id']))
    recipe=db_queries.get_recipe(data['id'])
    client_id = flask.request.sid
    username = db_queries.get_user(recipe["user"])["email"]
    namespace="/recipe/" + str(id)
    recipe['name'] = username
    emit_recipe(SEND_ONE_RECIPE_CHANNEL,recipe)


@socketio.on('new search input')
def on_new_search(data):
    print("Got an event for new search input with data:", data)
    client_id = flask.request.sid
    search_query = db_queries.search_with_name(data['search'])
    #search_query.extend(db_queries.search_by_tag(data['search']))
    socketio.emit(SEARCHES_RECEIVED_CHANNEL, {
        'search_output' : search_query
    },
    room=client_id)
    
@socketio.on('add to cart')
def add_to_cart(data):
    ingredients = data['cartItems']
    for item in ingredients:
        if item not in cart_collection[flask.request.sid]:
            cart_collection[flask.request.sid].append(item)
    print("There are " + str(len(cart_collection[flask.request.sid])) + " in the cart!")
    
@socketio.on('cart page')
def cart_page(data):
    if flask.request.sid in cart_collection.keys():
        print("client has items in cart!")
        socketio.emit('cart items received', {
            "cartItems": cart_collection[flask.request.sid],
        },room=flask.request.sid)
        
@socketio.on('content page')
def content_page(data):
    emit_all_recipes(SEND_RECIPES_CHANNEL)
    

@app.route('/')
def index():
    models.db.create_all()
    return flask.render_template("index.html")
    
@app.route('/about')
def UserPage():
    return flask.render_template('about.html')

if __name__ == '__main__': 
    db_utils.init_db(app)
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
