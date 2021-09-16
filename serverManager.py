from flask import Flask
from flask import render_template
from flask import url_for

from modules import aiManager
from modules import sessionManager
from modules import databaseManager

app = Flask(__name__)

@app.route("/")
@app.route("/garden/<sessionID>")
def mainRoute(sessionID=None):
    return render_template("base.html",
            jsdir=url_for("static", filename="js"));
