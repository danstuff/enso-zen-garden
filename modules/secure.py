import json

class APIKeys:
    def __init__(self):
        self.openWeather = "bf86e0c88de658dd300efbc09f6e9ab9"

    def asJSON(self):
        return json.dumps(self.__dict__)
