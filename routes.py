from flask import Flask
from flask import render_template
from flask import url_for
from flask import request

from modules.secure import APIKeys

app = Flask(__name__)

dbMan = DatabaseManager()
apiKeys = APIKeys()

#render the base template if you're on the index
@app.route("/", methods=['GET'])
def mainRoute():
    return render_template("base.html",
            jsdir=url_for("static", filename="js"))

#GET for reading dialogue data from the server
@app.route("/environment/post/", methods=['POST'])
def dialogueGetRoute():
    return dbMan.getDialogueString(request)

#GET for reading secure data from the server
@app.route("/secure/get/", methods=['GET'])
def secureGetRoute():
    return apiKeys.asJSON()
