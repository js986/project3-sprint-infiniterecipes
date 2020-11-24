import random
import models
from db_utils import db

ID_MIN = 100000000
ID_MAX = 999999999


def add_recipe(recipe_dict):
    gen_id = generate_random_recipe_id()

    new_recipe = models.Recipe(
        id=gen_id,
        user_id=recipe_dict["user"],
        title=recipe_dict["title"],
        description=recipe_dict["description"],
        difficulty=recipe_dict["difficulty"],
        instructions=recipe_dict["instructions"],
        ready_in_minutes=recipe_dict["readyInMinutes"],
        servings=recipe_dict["servings"],
        images=recipe_dict["images"],
        ingredients=recipe_dict["ingredients"],
    )
    
    if 'videos' in recipe_dict.keys():
        new_recipe.videos = recipe_dict['videos']
    else:
        new_recipe.videos = []
    
    for tag_text in recipe_dict["tags"]:
        tag = db.session.query(models.Tag).filter_by(name=tag_text).first()
        if tag:
            new_recipe.tags.append(tag)
        else:
            new_tag = models.Tag(name=tag_text)
            new_recipe.tags.append(new_tag)
            db.session.add(new_tag)

    db.session.add(new_recipe)
    db.session.commit()
    return gen_id


def add_user(user_dict):

    user = models.Users.query.filter_by(email=user_dict["email"]).first()
    if user:
        return user.id

    gen_id = generate_random_user_id()
    new_user = models.Users(
        id=gen_id,
        email=user_dict["email"],
        name=user_dict["name"],
        profile_pic=user_dict["imageURL"],
        favorite_recipes=[],
        saved_recipes=[],
        shopping_list=[],
    )
    db.session.add(new_user)
    db.session.commit()
    return gen_id

def edit_recipe(recipe_id, recipe_dict):
    recipe = models.Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
        return "No recipe with ID {} in database".format(recipe_id)
    for key in recipe_dict.keys():
        if key == "title":
            recipe.title = recipe_dict["title"]
            db.session.commit()
        elif key == "videos":
            recipe.videos = recipe_dict["videos"]
            db.session.commit()
        elif key == "ingredients":
            recipe.ingredients = recipe_dict["ingredients"]
            db.session.commit()
        elif key == "images":
            recipe.images = recipe_dict["images"]
            db.session.commit()
        elif key == "servings":
            recipe.servings = recipe_dict["servings"]
            db.session.commit()
        elif key == "readyInMinutes":
            recipe.ready_in_minutes = recipe_dict["readyInMinutes"]
            db.session.commit()
        elif key == "instructions":
            recipe.instructions = recipe_dict["instructions"]
            db.session.commit()
        elif key == "difficulty":
            recipe.difficulty = recipe_dict["difficulty"]
            db.session.commit()
        elif key == "description":
            recipe.description = recipe_dict["description"]
            db.session.commit()
        elif key == "tags":
            recipe.tags = []
            db.session.commit()
            for tag in recipe_dict["tags"]:
                db_tag = db.session.query(models.Tag).filter_by(name=tag).first()
                if db_tag:
                    recipe.tags.append(db_tag)
                    db.session.commit()
                else:
                    new_tag = models.Tag(name=tag)
                    recipe.tags.append(new_tag)
                    db.session.add(new_tag)
                    db.session.commit()
                    
    
def generate_random_user_id():
    gen_id = random.randint(ID_MIN, ID_MAX)
    user = models.Users.query.get(gen_id)
    while user:
        gen_id = random.randint(ID_MIN, ID_MAX)
    return gen_id
    

def generate_random_recipe_id():
    gen_id = random.randint(ID_MIN, ID_MAX)
    recipe = models.Recipe.query.get(gen_id)
    while recipe:
        gen_id = random.randint(ID_MIN, ID_MAX)
    return gen_id


def get_user_id(user_email):
    return models.Users.query.filter_by(email=user_email).first().id


def get_user(user_id):
    db_user = models.Users.query.get(user_id)
    if not db_user:
        return "ID not in db"
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "profile_pic": db_user.profile_pic,
        "saved_recipes": db_user.saved_recipes,
        "favorite_recipes": db_user.favorite_recipes,
        "owned_recipes": [recipe.id for recipe in db_user.owned_recipes],
        "shopping_list": db_user.shopping_list,
    }


def get_recipe(recipe_id):
    db_recipe = models.Recipe.query.get(recipe_id)
    if not db_recipe:
        return "ID not in db"
    return {
        "id": db_recipe.id,
        "user": db_recipe.user_id,
        "images": db_recipe.images,
        "title": db_recipe.title,
        "readyInMinutes": db_recipe.ready_in_minutes,
        "difficulty": db_recipe.difficulty,
        "servings": db_recipe.servings,
        "description": db_recipe.description,
        "tags": [tag.name for tag in db_recipe.tags],
        "ingredients": db_recipe.ingredients,
        "instructions": db_recipe.instructions,
    }


def get_shopping_list(user_id):
    user = models.Users.query.get(user_id)
    return user.shopping_list


def add_to_shopping_list(ingredient_list, user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    if not user.shopping_list:
        user.shopping_list = []
    shopping_list = user.shopping_list.copy()
    for item in ingredient_list:
        if item.lower() not in [s.lower() for s in shopping_list]:
            shopping_list.append(item.strip())
    user.shopping_list = shopping_list
    db.session.commit()


def remove_from_shopping_list(ingredient, user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    if not user.shopping_list:
        return
    shopping_list = user.shopping_list.copy()
    for item in shopping_list:
        if item.lower() == ingredient.lower():
            shopping_list.remove(item)
    user.shopping_list = shopping_list
    db.session.commit()


def add_favorite_recipe(recipe_id, user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    shared_recipe_list = user.favorite_recipes.copy()
    try:
        shared_recipe_list.index(recipe_id)
    except ValueError:
        shared_recipe_list.append(recipe_id)
        user.favorite_recipes = shared_recipe_list
        db.session.commit()

def remove_shared_recipe(recipe_id,user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    shared_recipe_list = user.favorite_recipes.copy()
    try:
        remove_index = shared_recipe_list.index(recipe_id)
        shared_recipe_list.pop(remove_index)
        user.favorite_recipes = shared_recipe_list
        db.session.commit()
    except ValueError:
        return -1

def add_saved_recipe(recipe_id, user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    saved_recipe_list = user.saved_recipes.copy()
    try:
        saved_recipe_list.index(recipe_id)
    except ValueError:
        saved_recipe_list.append(recipe_id)
        user.saved_recipes = saved_recipe_list
        db.session.commit()
        
def remove_saved_recipe(recipe_id,user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    saved_recipe_list = user.saved_recipes.copy()
    try:
        remove_index = saved_recipe_list.index(recipe_id)
        saved_recipe_list.pop(remove_index)
        user.saved_recipes = saved_recipe_list
        db.session.commit()
    except ValueError:
        return -1

def search_with_name(recipe_title):
    recipes = models.Recipe.query.filter(
        models.Recipe.title.ilike("%{}%".format(recipe_title))
    )
    if not recipes:
        return []
    return [get_recipe(r.id) for r in recipes]

def search_by_tag(tag_name):
    recipes = models.Tag.query.filter(
        models.Tag.name.ilike("%{}%".format(tag_name))
    ).first()
    if not recipes:
        return []
    return [get_recipe(r.id) for r in recipes.recipes]


def search_by_difficulty(difficulty):
    recipes = models.Levels.query.filter(
        models.Levels.difficulty.ilike("%{}%".format(difficulty))
    ).first()
    if not recipes:
        return []
    return [get_recipe(r.id) for r in recipes.recipes]


# Here for testing not a good way to get recipes
def get_n_recipes(number):
    recipes = models.Recipe.query.limit(number).all()
    return [get_recipe(r.id) for r in recipes]

