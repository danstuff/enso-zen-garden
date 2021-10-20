from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Time

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Model = declarative_base()

class Dialogue(Model):
    __tablename__ = "dialogue"

    id = Column(Integer, primary_key=True) # primary key
    
    innerHTML = Column(String(1024), nullable=False)
    weather_condition = Column(String(32), nullable=True)

    wind_speed_min = Column(Integer, nullable=True)
    wind_speed_max = Column(Integer, nullable=True)

    time_min = Column(Time(True), nullable=True)
    time_max = Column(Time(True), nullable=True)

class DatabaseManager:
    def __init__(self):
        self.engine = create_engine("sqlite:///main_database.db");

        # create the dialogue table
        Model.metadata.create_all(self.engine)

        # create a new session and add the dialogue
        self.session = sessionmaker(bind=self.engine)()
 
        # create example dialogue
        d = Dialogue(innerHTML=
                "The obstacle in the path becomes the path.<br>" +
                "Never forget, within every obstacle is an opportunity" +
                "<br> to improve our condition.")
       
        #self.addDialogue(d)

    def addDialogue(self, d):
        self.session.add(d)
        self.session.commit()

    def getDialogueString(self, eventJSON):
        # TODO filter dialogues by the event data (time, weather, etc)
        # then pick from the filtered dialogues at random
        self.query = self.session.query(Dialogue)
        instance = self.query.first()

        print(instance)

        if instance:
            return instance.innerHTML
        else:
            return ""
