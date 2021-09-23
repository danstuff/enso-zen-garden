from flask import Flask
from flask import render_template
from flask import url_for
from flask import request

from modules.databaseManager import DatabaseManager

app = Flask(__name__)

dbMan = DatabaseManager()

#render the base template if you're on the index or a garden
@app.route("/", methods=['GET'])
@app.route("/garden/<gardenID>", methods=['GET'])
def mainRoute(gardenID=None):
    return render_template("base.html",
            jsdir=url_for("static", filename="js"));

#GET and PUT routes for reading/updating garden data
@app.route("/garden/data/<gardenID>", methods=['GET', 'PUT'])
def gardenDataRoute(gardenID=None):
    if request.method == 'GET':
        return dbMan.getGarden(gardenID);
    if request.method == 'PUT':
        dbMan.putGarden(gardenID, request.get_json());

#GET for reading mesh data from the server
@app.route("/static/data/", methods=['GET'])
def staticDataRoute():
    return dbMan.getStaticData();

#GET for reading dialogue data from the server
@app.route("/dialogue/data/", methods=['GET'])
def dialogueDataRoute():
    return dbMan.getDialogue(request.get_json());
