# pylint: disable=missing-function-docstring
# pylint: disable=missing-module-docstring
# pylint: disable=missing-class-docstring
# pylint: disable=unused-argument
# pylint: disable=no-self-use
# pylint: disable=wrong-import-position
# pylint: disable=import-error
import os
import sys
import unittest
import unittest.mock as mock

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app
from app import socketio, app

TEST_ID = 738270100
TEST_RECIPE_ID = 738270101
TEST_EMAIL = "batman@gmail.com"
DIFFICULTY = "easy"
TEST_RECIPE = {
    "user": TEST_ID,
    "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
    "videos": ["https://youtu.be/9MJhVk4Z1Zc"],
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
    "shopping_list": [
        {"name": "potatoes", "amount": 2.0, "unit": ""},
        {"name": "chocolate bars", "amount": 3.0, "unit": ""},
    ],
    "saved_recipes": [738270101],
    "owned_recipes": [738270101],
    "favorite_recipes": [738270101],
}
TEST_ADD_RECIPE = {
    "id": TEST_RECIPE_ID,
    "user": TEST_ID,
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

TEST_ADD_SHOPPING_LIST = [
    {"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"},
    {"name": "Hot Sauce", "amount": 3.0, "unit": "tbsp"},
    {"name": "Sugar", "amount": 0.5, "unit": "cups"},
    {"name": "Baking Soda", "amount": 4.0, "unit": "tbsp"},
]

TEST_SAVE_RECIPE = {
    "recipe_id": TEST_RECIPE_ID,
    "user_id": TEST_ID,
    "title": "Protein Packed Carrot Muffins",
    "description": "A description",
    "difficulty": DIFFICULTY,
    "instructions": [{"number": 1, "step": "Preheat oven to 350 f."}],
    "ready_in_minutes": 45,
    "servings": 6,
    "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
    "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
    "user_email": "batman@gmail.org",
}

TEST_SEARCH_BY_TAG = {"filter": "tag", "search": "lunch"}

TEST_SEARCH_BY_DIFFICULTY = {"filter": "difficulty", "search": "easy"}

TEST_SEARCH_BY_NAME = {"filter": "name", "search": "muffin"}

RECIPE_LIST = [
    {
        "id": 738270100,
        "user": 555555555,
        "title": "",
        "description": "",
        "difficulty": "",
        "instructions": [],
        "ready_in_minutes": 30,
        "servings": 3,
        "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
        "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
    },
    {
        "id": 738270101,
        "user": 555555556,
        "title": "",
        "description": "",
        "difficulty": "",
        "instructions": [],
        "ready_in_minutes": 45,
        "servings": 1,
        "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
        "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
    },
    {
        "id": 738270102,
        "user": 555555557,
        "title": "",
        "description": "",
        "difficulty": "",
        "instructions": [],
        "ready_in_minutes": 60,
        "servings": 6,
        "images": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
        "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
    },
]

TEST_NEW_RECIPE = {
    "id": TEST_RECIPE_ID,
    "user": TEST_ID,
    "name": "Mr.Tester",
    "title": "Protein Packed Carrot Muffins",
    "description": "A description",
    "difficulty": DIFFICULTY,
    "instructions": [{"number": 1, "step": "Preheat oven to 350 f."}],
    "readyInMinutes": 45,
    "servings": 6,
    "image": ["https://spoonacular.com/recipeImages/657178-556x370.jpg"],
    "video": [],
    "tags": [{"tag": "lunch"}, {"tag": "pastry"}, {"tag": "protein"}],
    "ingredients": [{"name": "Spice Rub", "amount": 1.0, "unit": "tbsp"}],
}


class AppTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def test_on_new_google_user(self):
        with mock.patch("app.emit_all_recipes"):
            with mock.patch("db_queries.get_user", mocked_get_user):
                with mock.patch("db_queries.add_user"):
                    with mock.patch(
                        "db_queries.get_shopping_list", mocked_get_shopping_list
                    ):
                        client = socketio.test_client(app)
                        client.emit("new google user", {"test": "test"})
                        received = client.get_received()
                        self.assertEqual(
                            TEST_ADD_USER["name"], received[-1]["args"][0]["username"]
                        )
                        client.disconnect()

    def test_on_old_google_user(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            client.emit("old google user", {})
            received = client.get_received()
            self.assertEqual("logout", received[-1]["args"][0]["logout"])
            client.disconnect()

    def test_on_connect(self):
        with mock.patch("app.emit_all_recipes"):
            socketio_test_client = socketio.test_client(app)
            assert socketio_test_client.is_connected()
            received = socketio_test_client.get_received()
            self.assertEqual("Connected", received[-1]["args"][0]["test"])
            socketio_test_client.disconnect()

    def test_on_disconnect(self):
        with mock.patch("app.emit_all_recipes"):
            client1 = socketio.test_client(app)
            client1.disconnect()
            assert not client1.is_connected()

    def test_on_recipe_page(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user", mocked_get_user):
                with mock.patch("db_queries.get_recipe", mocked_get_recipe):
                    client.emit("recipe page", {"id": 1})
                    received = client.get_received()
                    self.assertEqual(
                        TEST_RECIPE["title"], received[-1]["args"][0]["recipe"]["title"]
                    )
                    client.disconnect()

    def test_on_cart_page(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user_id", mocked_get_user_id):
                with mock.patch(
                    "db_queries.get_shopping_list", mocked_get_shopping_list
                ):
                    client.emit("cart page", {"user_email": "tester@tester.com"})
                    received = client.get_received()
                    cart_items = received[-1]["args"][0]["cartItems"]
                    self.assertEqual(cart_items[0]["name"], "potatoes")
                    self.assertEqual(cart_items[1]["name"], "chocolate bars")

                    client.disconnect()

    def test_on_new_user_page(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user", mocked_get_user):
                with mock.patch("db_queries.get_recipe", mocked_get_recipe):
                    client.emit("user page", {"user_id": TEST_ID})
                    received = client.get_received()
                    self.assertEqual(
                        TEST_ADD_USER["name"], received[-1]["args"][0]["user"]["name"]
                    )
                    client.disconnect()

    #     def test_add_to_cart(self):
    #         pass
    def test_on_new_zip(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            client.emit("new zipcode query", {"zip": "12345"})
            received = client.get_received()
            self.assertEqual("12345", received[-1]["args"][0])
            client.disconnect()

    def test_on_save_recipe(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user_id", mocked_get_user_id):
                with mock.patch("db_queries.add_saved_recipe", mocked_add_saved_recipe):
                    client.emit("save recipe", TEST_SAVE_RECIPE)
                    client.disconnect()

    def test_on_favorite_recipe(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user_id", mocked_get_user_id):
                with mock.patch(
                    "db_queries.add_favorite_recipe", mocked_add_favorite_recipe
                ):
                    client.emit("favorite recipe", TEST_SAVE_RECIPE)
                    client.disconnect()

    def test_on_content_page(self):
        with mock.patch("db_queries.get_n_recipes", mocked_db_queries_get_n_recipes):
            with mock.patch("db_queries.get_user", mocked_get_user):
                client = socketio.test_client(app)
                assert client.is_connected()
                client.emit("content page", {"content": "content"})
                received = client.get_received()
                recipe_list = received[-1]["args"][0]["all_display"]
                self.assertEqual(recipe_list[0]["servings"], 3)
                client.disconnect()

    def test_on_new_search_with_name(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user", mocked_get_user):
                with mock.patch("db_queries.search_with_name", mocked_search):
                    client.emit("new search input", TEST_SEARCH_BY_NAME)
                    received = client.get_received()
                    recipe_list = received[-1]["args"][0]["search_output"]
                    self.assertEqual(recipe_list[0]["servings"], 3)
                    client.disconnect()

    def test_on_new_search_with_tag(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user", mocked_get_user):
                with mock.patch("db_queries.search_by_tag", mocked_search):
                    client.emit("new search input", TEST_SEARCH_BY_TAG)
                    received = client.get_received()
                    recipe_list = received[-1]["args"][0]["search_output"]
                    self.assertEqual(recipe_list[0]["servings"], 3)
                    client.disconnect()

    def test_on_new_search_with_difficulty(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user", mocked_get_user):
                with mock.patch("db_queries.search_by_difficulty", mocked_search):
                    client.emit("new search input", TEST_SEARCH_BY_DIFFICULTY)
                    received = client.get_received()
                    recipe_list = received[-1]["args"][0]["search_output"]
                    self.assertEqual(recipe_list[0]["servings"], 3)
                    client.disconnect()

    def test_on_new_recipe(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user_id", mocked_get_user_id):
                with mock.patch("db_queries.add_recipe", mocked_add_recipe):
                    client.emit("new recipe", TEST_NEW_RECIPE)
                    client.disconnect()

    def test_on_fork_page(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_recipe", mocked_get_recipe):
                with mock.patch("db_queries.get_user", mocked_get_user):
                    client.emit("fork page", {"id": TEST_ID})
                    received = client.get_received()
                    recipe = received[-1]["args"][0]["recipe"]
                    self.assertEqual(recipe["title"], "Protein Packed Carrot Muffins")
                    self.assertEqual(recipe["readyInMinutes"], 45)
                    client.disconnect()

    def test_add_to_cart(self):
        with mock.patch("app.emit_all_recipes"):
            client = socketio.test_client(app)
            assert client.is_connected()
            with mock.patch("db_queries.get_user_id", mocked_get_user_id):
                with mock.patch(
                    "db_queries.get_shopping_list", mocked_get_shopping_list
                ):
                    with mock.patch(
                        "db_queries.add_to_shopping_list", mocked_add_to_shopping_list
                    ):
                        client.emit(
                            "add to cart",
                            {
                                "user_email": TEST_EMAIL,
                                "cartItems": TEST_ADD_SHOPPING_LIST,
                            },
                        )
                        received = client.get_received()
                        cart_num = received[-1]["args"][0]["cart_num"]
                        self.assertEqual(cart_num, "6")
                        client.disconnect()



def mocked_db_queries_get_n_recipes(num_items):
    return RECIPE_LIST


def mocked_get_shopping_list(user_id):
    return TEST_ADD_USER["shopping_list"]


def mocked_add_to_shopping_list(ingredient_list, user):
    TEST_ADD_USER["shopping_list"].extend(ingredient_list)


def mocked_get_user(user_id):
    return TEST_ADD_USER


def mocked_get_user_id(user_email):
    return TEST_ID


def mocked_add_saved_recipe(recipe_id, user_id):
    return TEST_SAVE_RECIPE


def mocked_add_favorite_recipe(recipe_id, user_id):
    return TEST_SAVE_RECIPE


def mocked_get_recipe(recipe_id):
    return TEST_RECIPE


def mocked_search(search):
    return RECIPE_LIST


def mocked_add_recipe(recipe_dict):
    pass


if __name__ == "__main__":
    unittest.main()
