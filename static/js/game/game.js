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
                //for the demo, add some sample objects
                const tiles = [{tile1: "180", tile2: "0"  , tile3: "-3", tile4: "-3"},
                               {tile1: "270", tile2: "90" , tile3: "-3", tile4: "3" },
                               {tile1: "0"  , tile2: "180", tile3: "3" , tile4: "3" },
                               {tile1: "90" , tile2: "270", tile3: "3" , tile4: "-3"}
                            ];

                function addTile(tile) {
                    game.garden.addTile("sand_big_curve", tile.tile1,
                                        "frame_corner", tile.tile2, 
                                        tile.tile3, tile.tile4)
                }
                tiles.map(addTile)

                game.garden.addEntity("succulent", 0, 0);
				game.garden.addEntity("rock_sml_0", 4, 2);
				game.garden.addEntity("rock_sml_1", -3, 4);
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
