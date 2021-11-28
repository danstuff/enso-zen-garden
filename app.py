from flask import Flask
from flask import render_template
from flask import url_for
from flask import send_file
from flask import request
from flask import redirect

from modules.secure import APIKeys

apiKeys = APIKeys()


app = Flask(__name__)
app.config["DEBUG"] = False
app.config["TESTING"] = False



#render the base template if you're on the index
@app.route("/", methods=['GET'])
def mainRoute():
    return render_template("base.html",
            jsdir=url_for("static", filename="js"),
            assetdir=url_for("static", filename="assets"))

#GET for reading secure data from the server
@app.route("/secure/get/", methods=['GET'])
def secureGetRoute():
    return apiKeys.asJSON()

#GET for rerouting to a google feedback form
@app.route("/feedback/", methods=['GET'])
def feedbackGetRoute():
    return redirect("https://forms.gle/LDbzCCEXvjq6rncm8");
