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
    user = db_queries.add_user(data)
    print("USER IS: " + str(user))
    user_obj = db_queries.get_user(user)
    username = user_obj['name']
    user_email = user_obj['email']
    print("THIS IS " + str(username))
    socketio.emit('logged in',
        {
            'username': username,
            'email' : user_email,
        }
    )
    
@socketio.on('old google user')
def on_old_google_user(data):
    print("Got an event for old google user input with data:", data)
    logout = "logout"
    socketio.emit('logged out',
        {'logout': logout}
    )
    
@socketio.on('connect')
def on_connect():
    emit_all_recipes(SEND_RECIPES_CHANNEL)
    print('Someone connected!')
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
    search_filter = data['filter']
    if search_filter == "name":
        search_query = db_queries.search_with_name(data['search'])
    if search_filter == "tag":
        search_query = db_queries.search_by_tag(data['search'])
    if search_filter == "difficulty":
        search_query = db_queries.search_by_difficulty(data['search'])
    socketio.emit(SEARCHES_RECEIVED_CHANNEL, {
        'search_output' : search_query
    },
    room=client_id)
    
@socketio.on('user page')
def on_new_user_page(data):
    print('received data from client ' + str(data['user_id']))
    user= db_queries.get_user(data['user_id'])
    print(user['email'])
    socketio.emit('user page load', {
        'user': user
    })
    
@socketio.on('add to cart')
def add_to_cart(data):
    ingredients = data['cartItems']
    email = data['user_email']
    user = db_queries.get_user_id(email)
    shopping_list = db_queries.get_shopping_list(user)
    ingredient_list = []
    for item in ingredients:
        if item['name'] not in shopping_list:
            ingredient_list.append(item["name"])
    if len(ingredient_list) > 0:
        db_queries.add_to_shopping_list(ingredient_list,user)
    shopping_list = db_queries.get_shopping_list(user)
    print("There are " + str(len(shopping_list)) + " in the cart!")
    
@socketio.on('new zipcode query')
def on_new_zip(data):
    zipcode = data['zip']
    if zipcode.isdigit() and len(zipcode) == 5: 
        socketio.emit('new zip', zipcode)


    
@socketio.on('cart page')
def cart_page(data):
    email = data["user_email"]
    user_id = db_queries.get_user_id(email)
    if user_id is not None:
        shopping_list = db_queries.get_shopping_list(user_id)
        socketio.emit('cart items received', {
            "cartItems": shopping_list,
        },room=flask.request.sid)
        
@socketio.on('content page')
def content_page(data):
    emit_all_recipes(SEND_RECIPES_CHANNEL)
    
@socketio.on('new recipe')
def new_recipe(data):
    print('Received new recipe' +  str(data))
    email = data['user']
    name = data['name']
    servings = data['servings']
    readyInMinutes = data["readyInMinutes"]
    images = data['image']
    difficulty = data['difficulty']
    description = data['description']
    ingredients = data['ingredients']
    instructions = data["instructions"]
    tags = []
    for tag in data["tags"]:
        tags.append(tag['tag'])
    user = db_queries.get_user_id(email)
    recipe_dict = {
        'user': user,
        'title': name,
        'description': description,
        'difficulty': difficulty,
        'instructions': instructions,
        'readyInMinutes': readyInMinutes,
        'servings': servings,
        'images': images,
        'ingredients': ingredients,
        'tags': tags
    }
    
    db_queries.add_recipe(recipe_dict)

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
