from flask import Flask
from flask import render_template
from flask import url_for
from flask import request

from modules.databaseManager import DatabaseManager
from modules.secure import SecureData

app = Flask(__name__)

dbMan = DatabaseManager()
secureData = SecureData()

#render the base template if you're on the index
@app.route("/", methods=['GET'])
def mainRoute():
    return render_template("base.html",
            jsdir=url_for("static", filename="js"))

#GET for reading mesh data from the server
@app.route("/entity/get/<entityName>", methods=['GET'])
def entityGetRoute(entityName=None):
    return dbMan.getEntityJSON(entityName)

#GET for reading dialogue data from the server
@app.route("/dialogue/get/<eventString>", methods=['GET'])
def dialogueGetRoute(eventString=None):
    return dbMan.getDialogueJSON(eventString)

#GET for reading secure data from the server
@app.route("/secure/get/", methods=['GET'])
def secureGetRoute():
    return secureData.asJSON()
