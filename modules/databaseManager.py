class DatabaseManager:
    def __init__(self):
        # TODO
        pass

    def getGarden(self, sid):
        # if the garden ID is null, default to -1 (title screen)
        if gid == None: gid = -1

        # TODO
        pass

    def putGarden(self, sid): 
        # prevent modification if on title screen or gid = None
        if gid == -1 or gid == None: return

        # TODO
        pass

    def getMeshList(self):
        # TODO
        pass

    def getDialogue(self, eventData):
        # TODO filter dialogues by the event data (time, weather, etc)
        # then pick from the filtered dialogues at random
        pass
        
