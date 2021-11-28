const UPDATE_MS = 100;  //10 updates per second

const DEMO_MODE = false;

const FIVE_MINUTES = 5 * 60 * 1000;

const PHASE_COUNT = 3;

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.babInterface = new BabylonInterface(this.canvas);

        this.environment = new Environment(this.babInterface);
        this.garden = new Garden(this.babInterface);

        this.userInterface = new UserInterface(
            this.babInterface, this.garden);

        this.phaseCount = 0;
    }

    nextPhase() {
        var gsize = (1 + this.phaseCount) * 2;
        this.garden.addSandAndFrames(gsize, gsize);

        this.phaseCount++; 
        if(this.phaseCount >= PHASE_COUNT) return;

        const game = this;
        window.setTimeout(function() {
            game.nextPhase();
            game.userInterface.nextUnlockLevel();
        }, (1 + this.phaseCount) * 5000);
    }

    init(callback) {
        const game = this;

        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(
            function() {
                game.userInterface.init();
                game.userInterface.setHelpText(
                    "Welcome to Enso! Tap and drag to move around.");
                game.userInterface.randomRing();

                game.garden.addSandAndFrames(0, 0);

                //get environmental data from various APIs
                if(DEMO_MODE) {
                    game.nextPhase();
                    game.babInterface.startFPSLogging();

                    //for demo, gradually increase size
                    window.setInterval(function() {
                        game.environment.nextDemo();
                    }, 20 * 1000);
                } else {
                    game.nextPhase();
                    game.environment.getWeatherData();
                }

                callback();        
            }
        );


    }
}
