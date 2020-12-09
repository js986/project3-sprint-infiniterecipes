# pylint: disable=missing-function-docstring
# pylint: disable=missing-module-docstring
# pylint: disable=missing-class-docstring
# pylint: disable=no-member
# pylint: disable=too-few-public-methods
# models.py
from db_utils import db

tags = db.Table(
    "tags",
    db.Column("tag_id", db.Integer, db.ForeignKey("tag.id"), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipe.id"), primary_key=True),
)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(50), nullable=False)
    profile_pic = db.Column(db.String(), nullable=False)
    owned_recipes = db.relationship("Recipe", backref="user", lazy=True)
    favorite_recipes = db.Column(db.PickleType)
    saved_recipes = db.Column(db.PickleType)
    shopping_list = db.Column(db.PickleType)
    ratings = db.relationship("Rating", backref="user", lazy=True)


class Levels(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    difficulty = db.Column(db.String(50), unique=True)
    recipes = db.relationship("Recipe", backref="levels", lazy=True)


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String())
    number_of_forks = db.Column(db.Integer)
    forked_from_recipe = db.Column(db.Integer)
    images = db.Column(db.PickleType, nullable=False)
    user_submitted_images = db.Column(db.PickleType)
    videos = db.Column(db.PickleType)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    difficulty = db.Column(
        db.String(50), db.ForeignKey("levels.difficulty"), nullable=False
    )
    ingredients = db.Column(db.PickleType, nullable=False)
    tags = db.relationship("Tag", secondary=tags, back_populates="recipes")
    instructions = db.Column(db.PickleType, nullable=False)
    ready_in_minutes = db.Column(db.Integer, nullable=False)
    servings = db.Column(db.Integer, nullable=False)
    ratings = db.relationship("Rating", backref="recipe", lazy=True)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    recipes = db.relationship("Recipe", secondary=tags, back_populates="tags")


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    rate = db.Column(db.Float, nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
