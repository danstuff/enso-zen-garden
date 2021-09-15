from flask import Flask
from flask import render_template
from flask import url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("base.html",
            scene="index",
            jsdir=url_for("static", filename="js"));

@app.route("/garden/<sessionID>")
def garden(sessionID=None):
    return render_template("base.html",
            scene="garden", 
            jsdir=url_for("static", filename="js"));
