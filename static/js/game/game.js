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
                game.garden.addTile(
                    "sand_big_curve", 180, 
                    "frame_corner", 0,
                    -3, -3
                );

                game.garden.addTile(
                    "sand_big_curve", 270, 
                    "frame_corner", 90,
                    -3, 3
                );

                game.garden.addTile(
                    "sand_big_curve", 0, 
                    "frame_corner", 180,
                    3, 3
                );

                game.garden.addTile(
                    "sand_big_curve", 90, 
                    "frame_corner", 270,
                    3, -3
                );

                game.garden.addEntity("succulent", 0, 0);
            }
        );

        //enable brownian noise (silent until wind speed is set)
        this.audio.playNoise();

        //get environmental data from various APIs
        this.environment.getWeatherData(function(data) {
            //TODO add day time brightness

            //apply wind speed to noise and particle system
            game.audio.setWindSpeed(data.wind.speed);
            game.particle.setWindSpeed(data.wind.speed);

            //apply weather condition to particle system
            game.particle.setCondition(data);

            //ask server for dialogue based on condition string
            game.dialogue.request(data);
        });

        setInterval(function() {
            game.audio.tweenStrength();

        }, UPDATE_MS);
    }
}
