const UPDATE_MS = 100;  //10 updates per second

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.garden = new Garden();
        this.dialogue = new Dialogue();

        this.environment = new Environment();

        this.audio = new Audio();
        this.particle = new Particle();

        this.babInterface = new BabylonInterface(this.canvas);
    }

    init() {
        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(this.canvas);
        this.babInterface.startRendering();

        //get environmental data from various APIs
        this.environment.connect(function(data, game) {

            //apply wind speed to noise and particle system
            game.audio.setWindSpeed(data.wind.speed);
            game.particle.setWindSpeed(data.wind.speed);

            //apply weather condition to particle system
            game.particle.setCondition(data.weather[0].description);

            //enable brownian noise
            game.audio.playNoise();

            setTimeout(function() {
                game.audio.setWindSpeed(10);
            }, 5000);
 
            //ask server for dialogue forever
            game.dialogue.get(
                data.weather[0].description.replace(" ", "_") +
                data.wind.speed);       
        }, this);


        setInterval(function(game) {
            game.garden.update(UPDATE_MS);
            game.dialogue.update(UPDATE_MS);

            game.audio.tweenStrength();
        }, UPDATE_MS, this);
    }
}
