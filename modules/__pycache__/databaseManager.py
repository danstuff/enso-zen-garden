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
        #connect to the database and create an engine
        self.engine = create_engine("sqlite:///main_database.db")
        Model.metadata.create_all(self.engine)
        

    def addDialogue(self, _innerHTML, _tags):
        #connect a session, add the dialogue, commit, and close
        session = sessionmaker(bind=self.engine)

        d = Dialogue(innerHTML=_innerHTML, tags=_tags)

        session.add(d)
        session.commit()

        session.close()

    def getDialogueString(self, eventJSON):
        # TODO filter dialogues by the event tags,
        # then pick from the filtered dialogues at random
        session = sessionmaker(bind=self.engine)()

        query = session.query(Dialogue)
        instance = query.first()

        session.close()

        if instance:
            return instance.innerHTML
        else:
            return "No dialogues found."
