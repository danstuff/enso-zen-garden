const UPDATE_MS = 100;  //10 updates per second

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);

        this.babInterface = new BabylonInterface(this.canvas);

        this.environment = new Environment(this.babInterface);
        this.garden = new Garden(this.babInterface);
    }

    init() {
        const game = this;

        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(this.canvas,
            function() {
                //for the demo, add some sample objects
                const tiles = [
                    {tile1: "180", tile2: "0"  , tile3: "-3", tile4: "-3"},
                    {tile1: "270", tile2: "90" , tile3: "-3", tile4: "3" },
                    {tile1: "0"  , tile2: "180", tile3: "3" , tile4: "3" },
                    {tile1: "90" , tile2: "270", tile3: "3" , tile4: "-3"}
                ];

                function addTile(tile) {
                    game.garden.addTile("sand_big_curve", tile.tile1,
                                        "frame_corner", tile.tile2, 
                                        tile.tile3, tile.tile4);
                }
                tiles.map(addTile);

                game.garden.addEntity("fruit_core", 0, 0);
                game.garden.addEntity("fruit_leaves", 0, 0);
				game.garden.addEntity("rock_sml_0", 4, 2);
				game.garden.addEntity("rock_sml_1", -3, 4);
            }
        );

        //enable brownian noise (silent until wind speed is set)
        const audio = this.audio;
        const dialogue = this.dialogue;

        //get environmental data from various APIs
        this.environment.getWeatherData();

    }
}
