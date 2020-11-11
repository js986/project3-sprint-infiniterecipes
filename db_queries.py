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