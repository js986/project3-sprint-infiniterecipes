import random
import models
from db_utils import db

ID_MIN = 100000000
ID_MAX = 999999999

def add_recipe(recipe_dict):
    gen_id = generate_random_recipe_id()
    
    new_recipe = models.Recipe(
        id = gen_id,
        user_id = get_user_id(recipe_dict['user']),
        title = recipe_dict['title'],
        description = recipe_dict['description'],
        difficulty = recipe_dict['difficulty'],
        instructions = recipe_dict['instructions'],
        ready_in_minutes = recipe_dict['readyInMinutes'],
        servings = recipe_dict['servings'],
        images = recipe_dict['images'],
        ingredients = recipe_dict['ingredients']
        )
        
    for tag in recipe_dict['tags']:
        tag = db.session.query(models.Tag).filter_by(name=tag).first()
        if(tag):
            new_recipe.tags.append(tag)
        else:
            new_tag = models.Tag(name=tag)
            new_recipe.tags.append(new_tag)
            db.session.add(new_tag)
    
    db.session.add(new_recipe)
    db.session.commit()
    return gen_id   

def add_user(user_dict):
    gen_id = generate_random_user_id()
    new_user = models.Users(
        id = gen_id,
        email = user_dict['email'],
        name = user_dict['name'],
        profile_pic = user_dict['imageURL'],
        shared_recipes = [],
        saved_recipes = []
        )
    db.session.add(new_user)
    db.session.commit()
    return gen_id 

def generate_random_user_id():
    gen_id = random.randint(ID_MIN, ID_MAX)
    user = models.Users.query.get(gen_id)
    while(user):
       gen_id = random.randint(ID_MIN, ID_MAX)
    return gen_id

def generate_random_recipe_id():
    gen_id = random.randint(ID_MIN, ID_MAX)
    recipe = models.Recipe.query.get(gen_id)
    while(recipe):
       gen_id = random.randint(ID_MIN, ID_MAX)
    return gen_id

def get_user_id(user_email):
    return models.Users.query.filter_by(email=user_email).first().id
    

def get_user(id):
    db_user = models.Users.query.get(id)
    return {
        "id":db_user.id,
        "email":db_user.email,
        "name":db_user.id,
        "profile_pic":db_user.profile_pic,
        "saved_recipes":db_user.saved_recipes,
        "shared_recipes":db_user.shared_recipes,
        "owned_recipes":[recipe.id for recipe in db_user.owned_recipes]
    }
    
def get_recipe(id):
    db_recipe = models.Recipe.query.get(id)
    return {
        "id":db_recipe.id,
        "user":db_recipe.user_id,
        "images":db_recipe.images,
        "title":db_recipe.title,
        "readyInMinutes":db_recipe.ready_in_minutes,
        "difficulty":db_recipe.difficulty,
        "servings":db_recipe.servings,
        "description":db_recipe.description,
        "tags":[tag.name for tag in db_recipe.tags],
        "ingredients":db_recipe.ingredients,
        "instructions":db_recipe.instructions
    }

def add_shared_recipe(recipe_id, user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    shared_recipe_list = user.shared_recipes.copy()
    shared_recipe_list.append(recipe_id)
    user.shared_recipes = shared_recipe_list
    db.session.commit()
    
def add_saved_recipe(recipe_id, user_id):
    user = models.Users.query.filter_by(id=user_id).first()
    saved_recipe_list = user.saved_recipes.copy()
    saved_recipe_list.append(recipe_id)
    user.saved_recipes = saved_recipe_list
    db.session.commit()
    

def search_with_name(recipe_title):
    recipes = models.Recipe.query.filter(models.Recipe.title.contains(recipe_title))
    return [get_recipe(r.id) for r in recipes]

def search_by_tag(tag_name):
    recipes = models.Tag.query.filter_by(name=tag_name).first()
    return [get_recipe(r.id) for r in recipes.recipes]


#Here for testing not a good way to get recipes
def get_n_recipes(n):
    recipes = models.Recipe.query.limit(n).all()
    return [get_recipe(r.id) for r in recipes]