const UPDATE_MS = 100;  //10 updates per second

const DEMO_MODE = false;
const DEBUG_MODE = false;

const FIVE_MINUTES = 5 * 60 * 1000;
const THREE_MINUTES = 3 * 60 * 1000;

const MS_PER_TICK = 1000;

const PHASE_COUNT = 3;
const UNLOCK_COUNT = 11;

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.babInterface = new BabylonInterface(this.canvas);

        this.environment = new Environment(this.babInterface);
        this.garden = new Garden(this.babInterface);

        this.unlocks = new Unlocks();

        this.userInterface = new UserInterface(
            this.babInterface, this.garden, this.unlocks);

        this.phaseCount = 0;
    }

    nextPhase() {
        this.userInterface.randomSound(["ring"]);

        var gsize = (1 + this.phaseCount) * 2;
        this.garden.addSandAndFrames(gsize, gsize);

        this.phaseCount++; 
        if(this.phaseCount >= PHASE_COUNT) return;

        const game = this;
        window.setTimeout(function() {
            game.nextPhase();
        }, (this.phaseCount) * FIVE_MINUTES);
    }

    displayUnlock(ul) {
        this.userInterface.setLevelText(ul.level);
        if(ul.name) this.userInterface.notifyUnlock(ul.name);
    }

    tickUnlocks() {
        var ul = this.unlocks.incrementUnlockTicks();
        if(ul.n) this.displayUnlock(ul);

        const game = this;
        window.setTimeout(function() {
            game.tickUnlocks();
        }, MS_PER_TICK);
    }

    init(callback) {
        const game = this;

        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(
            function() {
                game.userInterface.init();
                game.userInterface.setHelpText(
                    "Welcome to Enso! Tap and drag to move around.");

                //load and display the unlock level
                var ul = game.unlocks.init();
                game.displayUnlock(ul);

                game.garden.addSandAndFrames(0, 0);

                //initialize game loop(s)
                game.nextPhase();
                game.tickUnlocks();

                if(DEMO_MODE) {
                    game.environment.randomDemo();

                } else {
                    //get environmental data from openWeatherMap
                    game.environment.getWeatherData(function(success) {

                        //if it failed, run a demo
                        if(!success) game.environment.randomDemo();
                    });
                }

                if(DEBUG_MODE) {
                    game.babInterface.startFPSLogging();
                } 

                callback();        
            }
        );
    }
}
