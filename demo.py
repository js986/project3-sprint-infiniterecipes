import json
import requests

headers = {
 'Content-Type': 'application/x-www-form-urlencoded'
}
requests.get('https://api.kroger.com/v1/connect/oauth2/authorize?scope={{SCOPES}}&response_type=code&client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}', headers=headers)
 
in_file = open("out.json")

 
json.dumps(in_file.read().json())