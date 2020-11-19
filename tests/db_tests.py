import os
import sys
import unittest
import unittest.mock as mock
from flask import Flask
from flask_testing import TestCase

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db_queries
import models
from db_utils import db


class MyTest(TestCase):

    SQLALCHEMY_DATABASE_URI = "sqlite://"

    TEST_ID = 738270100
    TEST_RECIPE_ID = 738270101
    DIFFICULTY = "easy"
    TEST_RECIPE = {
        "user": TEST_ID,
        "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
        "title": "Protein Packed Carrot Muffins",
        "readyInMinutes": 45,
        "difficulty": DIFFICULTY,
        "servings": 6,
        "description": "A description",
        "tags": ["gluten free", "dinner"],
        "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
        "instructions": [{"number": 1, "step": "Preheat oven to 350 f."}],
    }

    TEST_USER = {"name": "Mr.Tester", "imageURL": "image", "email": "tester@tester.com"}
    TEST_ADD_USER = {
        "id": TEST_ID,
        "name": "Mr.Tester",
        "profile_pic": "image",
        "email": "tester@tester.com",
        "shared_recipes": [],
        "shopping_list": ["potato"],
        "saved_recipes": [],
    }
    TEST_ADD_RECIPE = {
        "id": TEST_RECIPE_ID,
        "user_id": TEST_ID,
        "title": "Protein Packed Carrot Muffins",
        "description": "A description",
        "difficulty": DIFFICULTY,
        "instructions": [{"number": 1, "step": "Preheat oven to 350 f."}],
        "ready_in_minutes": 45,
        "servings": 6,
        "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
        "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
    }

    TEST_ADD_TAG = {"name": "tag"}

    def create_app(self):
        app = Flask(__name__)
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = self.SQLALCHEMY_DATABASE_URI
        db.init_app(app)
        db.app = app
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_add_user(self):
        with mock.patch("db_queries.generate_random_user_id", mocked_generate_user_id):
            self.assertEqual(self.TEST_ID, db_queries.add_user(self.TEST_USER))
            self.assertEqual(
                self.TEST_USER["name"],
                db.session.query(models.Users).get(self.TEST_ID).name,
            )
            self.assertEqual(
                self.TEST_USER["email"],
                db.session.query(models.Users).get(self.TEST_ID).email,
            )
            self.assertEqual(
                self.TEST_USER["imageURL"],
                db.session.query(models.Users).get(self.TEST_ID).profile_pic,
            )

    def test_add_recipe(self):
        with mock.patch(
            "db_queries.generate_random_user_id", mocked_generate_recipe_id
        ):
            db.session.add(models.Levels(difficulty=self.DIFFICULTY))
            db.session.add(
                models.Users(
                    id=self.TEST_ID,
                    email=self.TEST_USER["email"],
                    name=self.TEST_USER["name"],
                    shopping_list=[],
                    shared_recipes=[],
                    saved_recipes=[],
                    profile_pic=self.TEST_USER["imageURL"],
                )
            )

            recipe_id = db_queries.add_recipe(self.TEST_RECIPE)

            self.assertEqual(
                self.TEST_RECIPE["user"],
                db.session.query(models.Recipe).get(recipe_id).user_id,
            )
            self.assertEqual(
                self.TEST_RECIPE["title"],
                db.session.query(models.Recipe).get(recipe_id).title,
            )
            self.assertEqual(
                self.TEST_RECIPE["description"],
                db.session.query(models.Recipe).get(recipe_id).description,
            )
            self.assertEqual(
                self.TEST_RECIPE["images"],
                db.session.query(models.Recipe).get(recipe_id).images,
            )
            self.assertEqual(
                self.TEST_RECIPE["difficulty"],
                db.session.query(models.Recipe).get(recipe_id).difficulty,
            )
            self.assertEqual(
                self.TEST_RECIPE["ingredients"],
                db.session.query(models.Recipe).get(recipe_id).ingredients,
            )
            self.assertEqual(
                self.TEST_RECIPE["instructions"],
                db.session.query(models.Recipe).get(recipe_id).instructions,
            )
            self.assertEqual(
                self.TEST_RECIPE["readyInMinutes"],
                db.session.query(models.Recipe).get(recipe_id).ready_in_minutes,
            )
            self.assertEqual(
                self.TEST_RECIPE["servings"],
                db.session.query(models.Recipe).get(recipe_id).servings,
            )

    def test_get_user_id(self):
        db.session.add(
            models.Users(
                id=self.TEST_ID,
                email=self.TEST_USER["email"],
                name=self.TEST_USER["name"],
                shopping_list=[],
                shared_recipes=[],
                saved_recipes=[],
                profile_pic=self.TEST_USER["imageURL"],
            )
        )

        user_id = db_queries.get_user_id("tester@tester.com")
        self.assertEqual(user_id, self.TEST_ID)

    def test_get_user(self):
        db.session.add(
            models.Users(
                id=self.TEST_ID,
                email=self.TEST_USER["email"],
                name=self.TEST_USER["name"],
                shopping_list=[],
                shared_recipes=[],
                saved_recipes=[],
                profile_pic=self.TEST_USER["imageURL"],
            )
        )

        db_user = db_queries.get_user(self.TEST_ID)

        self.assertEqual(self.TEST_USER["name"], db_user["name"])
        self.assertEqual(self.TEST_USER["email"], db_user["email"])
        self.assertEqual(self.TEST_USER["imageURL"], db_user["profile_pic"])
        self.assertEqual(db_user["shopping_list"], [])
        self.assertEqual(db_user["saved_recipes"], [])
        self.assertEqual(db_user["shared_recipes"], [])
        self.assertEqual(db_user["owned_recipes"], [])

    def test_get_recipe(self):
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(models.Recipe(**self.TEST_ADD_RECIPE))
        got_recipe = db_queries.get_recipe(self.TEST_RECIPE_ID)
        self.assertEqual(self.TEST_ADD_RECIPE["title"], got_recipe["title"])

    def test_generate_recipe_id(self):
        with mock.patch("random.randint", mocked_random_int):
            new_id = db_queries.generate_random_recipe_id()
            self.assertEqual(new_id, 5)

    def test_generate_user_id(self):
        with mock.patch("random.randint", mocked_random_int):
            new_id = db_queries.generate_random_user_id()
            self.assertEqual(new_id, 5)

    def test_get_shopping_list(self):
        db.session.add(models.Users(**self.TEST_ADD_USER))
        shop_list = db_queries.get_shopping_list(self.TEST_ID)
        self.assertEqual(shop_list, self.TEST_ADD_USER["shopping_list"])

    def test_add_to_shopping_list(self):
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db_queries.add_to_shopping_list(["test"], self.TEST_ID)
        db_user = db.session.query(models.Users).get(self.TEST_ID)
        assert "test" in db_user.shopping_list

    def test_remove_from_shopping_list(self):
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db_queries.remove_from_shopping_list("potato", self.TEST_ID)
        db_user = db.session.query(models.Users).get(self.TEST_ID)
        assert "test" not in db_user.shopping_list

    def test_add_shared_recipe(self):
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(models.Recipe(**self.TEST_ADD_RECIPE))
        db_queries.add_shared_recipe(self.TEST_RECIPE_ID, self.TEST_ID)
        db_user = db.session.query(models.Users).get(self.TEST_ID)
        assert self.TEST_RECIPE_ID in db_user.shared_recipes

    def test_add_saved_recipe(self):
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(models.Recipe(**self.TEST_ADD_RECIPE))
        db_queries.add_saved_recipe(self.TEST_RECIPE_ID, self.TEST_ID)
        db_user = db.session.query(models.Users).get(self.TEST_ID)
        assert self.TEST_RECIPE_ID in db_user.saved_recipes

    def test_search_with_name(self):
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(models.Recipe(**self.TEST_ADD_RECIPE))
        searched_recipes = db_queries.search_with_name("packed")
        self.assertEqual(searched_recipes[0]["title"], self.TEST_ADD_RECIPE["title"])

    def test_search_by_tag(self):
        recipe = models.Recipe(**self.TEST_ADD_RECIPE)
        tag = models.Tag(**self.TEST_ADD_TAG)
        recipe.tags.append(tag)
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(recipe)
        searched_recipes = db_queries.search_by_tag(self.TEST_ADD_TAG["name"])
        self.assertEqual(searched_recipes[0]["title"], self.TEST_ADD_RECIPE["title"])

    def test_search_by_difficulty(self):
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(models.Recipe(**self.TEST_ADD_RECIPE))
        searched_recipes = db_queries.search_by_difficulty(self.DIFFICULTY)
        self.assertEqual(searched_recipes[0]["title"], self.TEST_ADD_RECIPE["title"])

    def test_get_n_recipes(self):
        db.session.add(models.Levels(difficulty=self.DIFFICULTY))
        db.session.add(models.Users(**self.TEST_ADD_USER))
        db.session.add(models.Recipe(**self.TEST_ADD_RECIPE))
        searched_recipes = db_queries.get_n_recipes(1)
        self.assertEqual(searched_recipes[0]["title"], self.TEST_ADD_RECIPE["title"])


def mocked_generate_user_id():
    return 738270100


def mocked_generate_recipe_id():
    return 738270101


def mocked_random_int(low, high):
    return 5


if __name__ == "__main__":
    unittest.main()
