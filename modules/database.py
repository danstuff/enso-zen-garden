from flask_sqlalchemy import SQLAlchemy
from flask import Flask
#import pymysql


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + "database address"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "12345"

db = SQLAlchemy(app)


# table for Garden
class Garden(db.Model):
    __tablename__ = "garden"
    id = db.Column(db.Integer, primary_key=True) # primary key
    water_level = db.Column(db.String(10), nullable=False) # water level can not be null


# table for Mesh
class Mesh(db.Model):
    __tablename__ = "mesh"
    id = db.Column(db.Integer, primary_key=True) # primary key
    vertices = db.Column(db.integer(50), nullable=False) # vertices can not be null
    colors = db.Column(db.String(50), nullable=False) # color can not be null


# table for Dialogue
class Dialogue(db.Model):
    __tablename__ = "dialogue"
    id = db.Column(db.Integer, primary_key=True) # primary key
    text = db.Column(db.String(100), nullable=False)
    options = db.Column(db.String(10), nullable=False)
    font_size = db.Column(db.Integer(10), nullable=False)
    time = db.Column(db.String(6), nullable=False)
    weather_type = db.Column(db.String(10), nullable=False)
    day_time = db.Column(db.String(6), nullable=False)


# table for Object
class Object(db.Model):
    __tablename__ = "object"
    id = db.Column(db.Integer, primary_key=True) # primary key
    pos = db.Column(db.Integer(100), nullable=False)
    mesh_pos = db.Column(db.Integer(100), nullable=False)
