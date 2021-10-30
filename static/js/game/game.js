const UPDATE_MS = 100;  //10 updates per second

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.dialogue = new Dialogue();
        this.environment = new Environment();
        this.audio = new Audio();
        this.particle = new Particle();

        this.babInterface = new BabylonInterface(this.canvas);
        this.garden = new Garden(this.babInterface);
    }

    init() {
        const game = this;

        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(this.canvas,
            function() {
                game.garden.update(10);

                game.garden.addObject("succulent", 0, 0);
				game.garden.addObject("rock_sml_0", 4, 2);
				game.garden.addObject("rock_sml_1", -3, 4);
            }
        );

        //enable brownian noise (silent until wind speed is set)
        this.audio.playNoise();
        this.audio.setWindSpeed(10);
        this.dialogue.request(null);

        //get environmental data from various APIs
        this.environment.getWeatherData(function(data) {
            //TODO add day time brightness

            //apply wind speed to noise and particle system
            game.particle.setWindSpeed(data.wind.speed);

            //apply weather condition to particle system
            game.particle.setCondition(data);

            //ask server for dialogue based on condition string
        });

        setInterval(function() {
            game.audio.tweenStrength();

        }, UPDATE_MS);
    }
}
