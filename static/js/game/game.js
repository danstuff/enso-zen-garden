const UPDATE_MS = 100;  //10 updates per second

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.garden = new Garden();
        this.dialogue = new Dialogue();

        this.environment = new Environment();

        this.audio = new Audio();
        this.particle = new Particle();
		this.SPS = new BABYLON.SolidParticleSystem();
        this.babInterface = new BabylonInterface(this.canvas);
    }

    init() {
        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(this.canvas);
        this.babInterface.startRendering(); 

        //enable brownian noise (silent until wind speed is set)
        this.audio.playNoise();

        //get environmental data from various APIs
        this.environment.getWeatherData(function(data, game) {

            //apply wind speed to noise and particle system
            game.audio.setWindSpeed(data.wind.speed);
            game.particle.setWindSpeed(data.wind.speed);

            //apply weather condition to particle system
            game.particle.setCondition(data);

            //ask server for dialogue based on condition string
            game.dialogue.request(data);
        }, this);


        setInterval(function(game) {
            game.garden.update(UPDATE_MS);
            game.audio.tweenStrength();

        }, UPDATE_MS, this);
    }
}
