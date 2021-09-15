from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("base.html", scene="index")

@app.route("/garden/<sessionID>")
def garden(sessionID=None):
    return render_template("base.html", scene="garden")
