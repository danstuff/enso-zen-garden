const UPDATE_MS = 100;  //10 updates per second

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.babInterface = new BabylonInterface(this.canvas);

        this.environment = new Environment(this.babInterface);
        this.garden = new Garden(this.babInterface);

        this.userInterface = new UserInterface(
            this.babInterface, this.garden);
    }

    init(callback) {
        const game = this;

        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(
            function() {
                game.environment.vfx.setSunPercent(1);

                var gsize = 0;
                game.garden.addSandAndFrames(gsize, gsize);

                //for demo, gradually increase size
                window.setInterval(function() {
                    if(gsize > 10) return;

                    gsize+=2;
                    game.garden.addSandAndFrames(gsize, gsize);
                }, 10000);

                game.userInterface.init();

                callback();
            }
        );
        
        //get environmental data from various APIs
        this.environment.getWeatherData();
    }
}
