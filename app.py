# pylint: disable=unused-argument
# pylint: disable=invalid-envvar-default
"""
app.py
"""
import os
import flask
import flask_socketio
import models
import db_queries
import db_utils

SEARCHES_RECEIVED_CHANNEL = "search results received"
SEND_RECIPES_CHANNEL = "recipes received"
SEND_ONE_RECIPE_CHANNEL = "recipe page load"

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")


def emit_all_recipes(channel):
    """
    emit all recipes
    """
    recipes = db_queries.get_n_recipes(50)
    for recipe in recipes:
        user = db_queries.get_user(recipe["user"])
        username = user["name"]
        recipe["name"] = username
    all_searches = recipes
    client_id = flask.request.sid
    socketio.emit(
        channel,
        {
            "all_display": all_searches,
        },
        room=client_id,
    )


def emit_recipe(channel, recipe):
    """
    emit a recipe
    """
    client_id = flask.request.sid
    socketio.emit(channel, {"recipe": recipe}, room=client_id)


@socketio.on("new google user")
def on_new_google_user(data):
    """
    login using google
    """
    user = db_queries.add_user(data)
    user_obj = db_queries.get_user(user)
    username = user_obj["name"]
    user_email = user_obj["email"]
    client_id = flask.request.sid
    shopping_list = db_queries.get_shopping_list(user_obj["id"])
    cart_num_items = len(shopping_list)
    socketio.emit(
        "logged in",
        {
            "userId": user,
            "username": username,
            "email": user_email,
            "cartNumItems": cart_num_items,
        },
        room=client_id,
    )


@socketio.on("old google user")
def on_old_google_user(data):
    """
    logout using google
    """
    logout = "logout"
    client_id = flask.request.sid
    socketio.emit("logged out", {"logout": logout}, room=client_id)


@socketio.on("connect")
def on_connect():
    """
    connect to page
    """
    emit_all_recipes(SEND_RECIPES_CHANNEL)
    socketio.emit("connected", {"test": "Connected"}, room=flask.request.sid)


@socketio.on("disconnect")
def on_disconnect():
    """
    disconnect to page
    """
    print("Someone disconnected!")


@socketio.on("recipe page")
def on_recipe_page(data):
    """
    recipe page
    """
    recipe = db_queries.get_recipe(data["id"])
    username = db_queries.get_user(recipe["user"])["name"]
    start_adding = False
    video_parsed = ""
    for video in recipe["videos"]:
        for character in video:
            if character == "=":
                start_adding = True
                continue
            if start_adding is True:
                video_parsed += character
    recipe["name"] = username
    emit_recipe(SEND_ONE_RECIPE_CHANNEL, recipe)
    if start_adding:  # If there is a youtube video in the recipe
        socketio.emit("video available", video_parsed)


@socketio.on("fork page")
def on_fork_page(data):
    """
    on fork page
    """
    recipe = db_queries.get_recipe(data["id"])
    username = db_queries.get_user(recipe["user"])["name"]
    # namespace = "/recipe/" + str(id)
    recipe["name"] = username
    emit_recipe("load fork page", recipe)


@socketio.on("new search input")
def on_new_search(data):
    """
    search for recipe
    """
    client_id = flask.request.sid
    search_filter = data["filter"]
    if search_filter == "name":
        search_query = db_queries.search_with_name(data["search"])

    if search_filter == "tag":
        search_query = db_queries.search_by_tag(data["search"])
    if search_filter == "difficulty":
        search_query = db_queries.search_by_difficulty(data["search"])
    for recipe in search_query:
        username = db_queries.get_user(recipe["user"])["name"]
        recipe["name"] = username
    socketio.emit(
        SEARCHES_RECEIVED_CHANNEL, {"search_output": search_query}, room=client_id
    )


@socketio.on("user page")
def on_new_user_page(data):
    """
    new user
    """
    user = db_queries.get_user(data["user_id"])
    saved_recipes = []
    saved_recipes_id = user["saved_recipes"]
    for recipe_id in saved_recipes_id:
        recipe = db_queries.get_recipe(recipe_id)
        username = db_queries.get_user(recipe["user"])["name"]
        recipe["name"] = username
        saved_recipes.append(recipe)
    owned_recipes = []
    owned_recipes_id = user["owned_recipes"]
    for recipe_id in owned_recipes_id:
        recipe = db_queries.get_recipe(recipe_id)
        username = db_queries.get_user(recipe["user"])["name"]
        recipe["name"] = username
        owned_recipes.append(recipe)
    favorite_recipes = []
    favorite_recipes_id = user["favorite_recipes"]
    for recipe_id in favorite_recipes_id:
        recipe = db_queries.get_recipe(recipe_id)
        username = db_queries.get_user(recipe["user"])["name"]
        recipe["name"] = username
        favorite_recipes.append(recipe)
    socketio.emit(
        "user page load",
        {
            "user": user,
            "owned_recipes": owned_recipes,
            "saved_recipes": saved_recipes,
            "favorite_recipes": favorite_recipes,
        },
        room=flask.request.sid,
    )


@socketio.on("add to cart")
def add_to_cart(data):
    """
    add to cart page
    """
    ingredients = data["cartItems"]
    email = data["user_email"]
    user = db_queries.get_user_id(email)
    shopping_list = db_queries.get_shopping_list(user)
    ingredient_list = []
    for item in ingredients:
        if item["name"] not in shopping_list:
            ingredient_list.append(item["name"])
    if len(ingredient_list) > 0:
        db_queries.add_to_shopping_list(ingredient_list, user)
    shopping_list = db_queries.get_shopping_list(user)
    socketio.emit(
        "received cart item num",
        {"cart_num": str(len(shopping_list))},
        room=flask.request.sid,
    )


@socketio.on("new zipcode query")
def on_new_zip(data):
    """
    zipcode entry
    """
    zipcode = data["zip"]
    if zipcode.isdigit() and len(zipcode) == 5:
        socketio.emit("new zip", zipcode, room=flask.request.sid)


@socketio.on("cart page")
def cart_page(data):
    """
    cart page
    """
    email = data["user_email"]
    user_id = db_queries.get_user_id(email)
    if user_id is not None:
        shopping_list = db_queries.get_shopping_list(user_id)
        socketio.emit(
            "cart items received",
            {
                "cartItems": shopping_list,
            },
            room=flask.request.sid,
        )


@socketio.on("content page")
def content_page(data):
    """
    content
    """
    emit_all_recipes(SEND_RECIPES_CHANNEL)


@socketio.on("new recipe")
def new_recipe(data):
    """
    new recipe
    """
    email = data["user"]
    name = data["name"]
    servings = data["servings"]
    ready_in_minutes = data["readyInMinutes"]
    images = data["image"]
    difficulty = data["difficulty"]
    description = data["description"]
    ingredients = data["ingredients"]
    instructions = data["instructions"]
    videos = data["video"]
    tags = []
    for tag in data["tags"]:
        tags.append(tag["tag"])
    user = db_queries.get_user_id(email)
    recipe_dict = {
        "user": user,
        "title": name,
        "description": description,
        "difficulty": difficulty,
        "instructions": instructions,
        "readyInMinutes": ready_in_minutes,
        "videos": videos,
        "servings": servings,
        "images": images,
        "ingredients": ingredients,
        "tags": tags,
    }
    db_queries.add_recipe(recipe_dict)


@socketio.on("save recipe")
def on_save_recipe(data):
    """
    save recipe
    """
    user_id = db_queries.get_user_id(data["user_email"])
    db_queries.add_saved_recipe(data["recipe_id"], user_id)


@socketio.on("favorite recipe")
def on_favorite_recipe(data):
    """
    favorite recipe
    """
    user_id = db_queries.get_user_id(data["user_email"])
    db_queries.add_favorite_recipe(data["recipe_id"], user_id)


@socketio.on("new recipe user image")
def on_new_recipe_user_image(data):
    """
    on new recipe user image
    """
    if db_queries.get_user_id(data["user_email"]) is not None:
        db_queries.add_user_submitted_image(data["recipe_id"], [data["image"]])


@app.route("/")
def index():
    """
    to index.html
    """
    models.db.create_all()
    return flask.render_template("index.html")


@app.route("/about")
def user_page():
    """
    to about.html
    """
    return flask.render_template("about.html")


if __name__ == "__main__":
    db_utils.init_db(app)
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
