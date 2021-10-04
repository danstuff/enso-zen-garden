from flask import Flask
from flask import render_template
from flask import url_for
from flask import request

from modules.databaseManager import DatabaseManager

app = Flask(__name__)

dbMan = DatabaseManager()

#render the base template if you're on the index
@app.route("/", methods=['GET'])
def mainRoute(gardenID=None):
    return render_template("base.html",
            jsdir=url_for("static", filename="js"));

#GET for reading mesh data from the server
@app.route("/data/static/", methods=['GET'])
def staticDataRoute():
    return dbMan.getStaticData();

#GET for reading dialogue data from the server
@app.route("/data/dialogue/", methods=['GET'])
def dialogueDataRoute():
    return dbMan.getDialogue(request.get_json());
