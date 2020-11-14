import os
import sys
import unittest
import unittest.mock as mock
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db_queries
from os.path import join, dirname
from dotenv import load_dotenv

import db_queries
import models
from db_utils import db
from flask import Flask
from flask_testing import TestCase

class MyTest(TestCase):
    
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    
    TEST_ID = 738270100
    
    TEST_RECIPE = {
            'user': TEST_ID,
            'images': ['https://spoonacular.com/recipeImages/657178-556x370.jpg'],
            'title': 'Protein Packed Carrot Muffins',
            'readyInMinutes': 45,
            'difficulty': 'intermediate',
            'servings': 6,
            'description': 'A description', 
            'tags': ['gluten free', 'dinner'],
            'ingredients': [{'name': 'Spice Rub', 'amount': 1.0, 'unit': 'tbsp'}],
            'instructions': [{'number': 1, 'step': 'Preheat oven to 350 f.'}]
        }
        
    TEST_USER = {
            'name': 'Mr.Tester',
            'imageURL': 'image',
            'email': 'tester@tester.com'
        }
        
    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = self.SQLALCHEMY_DATABASE_URI
        db.init_app(app)
        db.app = app
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
    
    def test_add_user(self):
        user_id = db_queries.add_user(self.TEST_USER)
        self.assertEqual(self.TEST_USER['name'], 
                        db.session.query(models.Users).get(user_id).name)
        self.assertEqual(self.TEST_USER['email'], 
                        db.session.query(models.Users).get(user_id).email)
        self.assertEqual(self.TEST_USER['imageURL'], 
                        db.session.query(models.Users).get(user_id).profile_pic)
    
    def test_add_recipe(self):
        db.session.add(models.Users(id=self.TEST_ID, 
        email=self.TEST_USER['email'], 
        name=self.TEST_USER['name'],
        shopping_list = [], 
        shared_recipes=[], 
        saved_recipes=[], 
        profile_pic = self.TEST_USER['imageURL']))
        
        recipe_id = db_queries.add_recipe(self.TEST_RECIPE)
        
        self.assertEqual(self.TEST_RECIPE['user'], 
                        db.session.query(models.Recipe).get(recipe_id).user_id)
        self.assertEqual(self.TEST_RECIPE['title'], 
                        db.session.query(models.Recipe).get(recipe_id).title)
        self.assertEqual(self.TEST_RECIPE['description'], 
                        db.session.query(models.Recipe).get(recipe_id).description)
        self.assertEqual(self.TEST_RECIPE['images'], 
                        db.session.query(models.Recipe).get(recipe_id).images)
        self.assertEqual(self.TEST_RECIPE['difficulty'], 
                        db.session.query(models.Recipe).get(recipe_id).difficulty)
        self.assertEqual(self.TEST_RECIPE['ingredients'], 
                        db.session.query(models.Recipe).get(recipe_id).ingredients)
        self.assertEqual(self.TEST_RECIPE['instructions'], 
                        db.session.query(models.Recipe).get(recipe_id).instructions)
        self.assertEqual(self.TEST_RECIPE['readyInMinutes'], 
                        db.session.query(models.Recipe).get(recipe_id).ready_in_minutes)
        self.assertEqual(self.TEST_RECIPE['servings'], 
                        db.session.query(models.Recipe).get(recipe_id).servings)
    
    def test_get_user_id(self):
        db.session.add(models.Users(id=self.TEST_ID, 
        email=self.TEST_USER['email'], 
        name=self.TEST_USER['name'],
        shopping_list = [], 
        shared_recipes=[], 
        saved_recipes=[], 
        profile_pic = self.TEST_USER['imageURL']))
        
        user_id = db_queries.get_user_id('tester@tester.com')
        self.assertEqual(user_id, self.TEST_ID)

        
if __name__ == "__main__":
    unittest.main()
        