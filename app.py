# app.py
from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_sqlalchemy
import flask_socketio
import models 

SEARCHES_RECEIVED_CHANNEL = 'searches received'

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

dotenv_path = join(dirname(__file__), 'sql.env')
load_dotenv(dotenv_path)

database_uri = os.environ['DATABASE_URL']

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app


db.create_all()
db.session.commit()

def emit_all_addresses(channel):
    all_searches = [ \
        db_address.address for db_address \
        in db.session.query(models.Usps).all()]
    # all_users = [ \
    #     user.name for user \
    #     in db.session.query(models.AuthUser).all()]
    # print("logged in: " + str(all_users))
        
    socketio.emit(channel, {
        'allSearches': all_searches,
        # 'allUsers': all_users
    })
    
# def push_new_user_to_db(name, profile, auth_type):
#     if name != "John Doe":
#         db.session.add(models.AuthUser(name, profile, auth_type));
#         db.session.commit();
    
# emit_all_addresses(SEARCHES_RECEIVED_CHANNEL)
    
# @socketio.on('new google user')
# def on_new_google_user(data):
#     print("Got an event for new google user input with data:", data)
#     push_new_user_to_db(data['name'], data['profile'], models.AuthUserType.GOOGLE)


@socketio.on('connect')
def on_connect():
    print('Someone connected!')
    socketio.emit('connected', {
        'test': 'Connected'
    })
    
    emit_all_addresses(SEARCHES_RECEIVED_CHANNEL)
    

@socketio.on('disconnect')
def on_disconnect():
    print ('Someone disconnected!')

@socketio.on('new search input')
def on_new_address(data):
    print("Got an event for new search input with data:", data)
    
    db.session.add(models.Usps(data["search"]));
    db.session.commit();
    
    emit_all_addresses(SEARCHES_RECEIVED_CHANNEL)

@app.route('/')
def index():
    emit_all_addresses(SEARCHES_RECEIVED_CHANNEL)

    return flask.render_template("index.html")

if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
