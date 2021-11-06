const UPDATE_MS = 100;  //10 updates per second

const DEMO_MODE = true;

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
                var gsize = 0;
                game.garden.addSandAndFrames(gsize, gsize);

                //for demo, gradually increase size
                window.setInterval(function() {
                    game.environment.nextDemo();

                    if(gsize > 10) return;

                    gsize+=2;
                    game.garden.addSandAndFrames(gsize, gsize);
                }, 20000);

                game.userInterface.init();

                //get environmental data from various APIs
                if(DEMO_MODE) {
                    game.environment.nextDemo();
                } else {
                    game.environment.getWeatherData();
                }

                callback();        
            }
        );


    }
}
