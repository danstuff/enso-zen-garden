const UPDATE_MS = 100;  //10 updates per second

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.babInterface = new BabylonInterface(this.canvas);

        this.environment = new Environment(this.babInterface);
        this.garden = new Garden(this.babInterface);
    }

    init(callback) {
        const game = this;

        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(this.canvas,
            function() {
                game.environment.setSunPercent(1);

                var gsize = 0;
                game.garden.addTilesAndFrames(gsize, gsize);

                window.setInterval(function() {
                    gsize+=2;
                    game.garden.addTilesAndFrames(gsize, gsize);
                }, 5000);

                game.garden.addEntity("fruit", 0, 0);

				game.garden.addEntity("rock_sml_0", 4, 2);
				game.garden.addEntity("rock_sml_1", -3, 4);

                callback();
            }
        );

        //enable brownian noise (silent until wind speed is set)
        const audio = this.audio;
        const dialogue = this.dialogue;

        //get environmental data from various APIs
        this.environment.getWeatherData();

    }
}
