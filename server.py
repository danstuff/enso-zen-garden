from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Oh look it's a beautiful zen garden</p>"
