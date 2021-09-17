# TODO we need to nail down what it is the AI actually does
# Dan's thoughts: we should have it classify dialogue for us.
from sklearn.neural_network import MLPClassifier

class AiManager:
    def __init__(self):
        self.model = MLPClassifier()
        # TODO load from file

    def predict(self, dataIn):
        return self.model.predict(dataIn)

    def learn(self, dataIn, dataOut):
        self.model.fit(dataIn, dataOut)
        # TODO save to file
