# models.py
from db_utils import db

tags = db.Table('tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id'), primary_key=True)
)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(50), nullable=False)
    profile_pic = db.Column(db.String(), nullable=False)
    owned_recipes = db.relationship('Recipe', backref='user', lazy=True)
    shared_recipes = db.Column(db.PickleType)
    saved_recipes = db.Column(db.PickleType)
    
class Levels(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    difficulty = db.Column(db.String(50), unique=True)
    recipes = db.relationship('Recipe', backref='levels', lazy=True)
    
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(), nullable=False)
    images = db.Column(db.PickleType, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    difficulty = db.Column(db.String(50), db.ForeignKey('levels.difficulty'), nullable=False)
    ingredients = db.Column(db.PickleType, nullable=False)
    tags = db.relationship('Tag', secondary=tags, back_populates='recipes')
    instructions = db.Column(db.PickleType, nullable=False)
    ready_in_minutes = db.Column(db.Integer, nullable=False)
    servings = db.Column(db.Integer, nullable=False)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    recipes = db.relationship('Recipe', secondary = tags, back_populates='tags')