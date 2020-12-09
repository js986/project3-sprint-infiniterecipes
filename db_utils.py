# pylint: disable=missing-module-docstring
# pylint: disable=missing-function-docstring
import os
from os.path import join, dirname
import flask_sqlalchemy
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), "sql.env")
load_dotenv(dotenv_path)
database_uri = os.environ["DATABASE_URL"]
db = flask_sqlalchemy.SQLAlchemy()


def init_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    db.init_app(app)
    db.app = app
