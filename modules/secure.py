class SecureData:
    def __init__(self):
        this.openWeather = "bf86e0c88de658dd300efbc09f6e9ab9"

    def asJSON(self):
        return json.dumps(self.__dict__)
        
