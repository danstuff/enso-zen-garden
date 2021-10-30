const Y_AXIS = -100;  // axis of y is -100 
const TILE_LEN = 6;  // length of one tile is 6
const TILE_NAME = "sand_big_curve";
const FRAME_NAME = "frame_corner";

class Garden {
    constructor(babInt) {
        this.tiles = [];
        this.frames = [];
        this.babInt = babInt;
    }

    // update garden according to plant_size update
    update(plant_size) {

        this.removeTilesAndFrames();

        // calculate how many tiles we need, add one more to hold decoration items
        var num_of_tiles = Math.ceil(plant_size / TILE_LEN) + 1;
        
        this.updateTilesAndFrames(num_of_tiles);

        // TODO: maybe also update decoration items to avoid overlap?
    }

    // add an object
    addObject(object_name, x, z, yrot) {
        var pos = new BABYLON.Vector3(x, Y_AXIS, z);

        // if do not care about rotation, use random rotation
        var fromTop = true;
        var rot = new BABYLON.Vector3(0, Math.random()*360, 0);
        if (yrot != undefined) {        
            fromTop = false;
            rot = new BABYLON.Vector3(0, yrot*Math.PI/180, 0);   
        }

        this.babInt.createMeshInstance(object_name, pos, rot, fromTop);
    }

    // remove an object
    removeObject(object_name, x, z, yrot) {
        var pos = new BABYLON.Vector3(x, Y_AXIS, z);
        // TODO: need add remove function in BabylonInterface
        // this.babInt.removeMeshInstance(object_name, pos, yrot);
    }
    
    // remove scene of all tiles and frames
    removeTilesAndFrames() {
        // remove all tiles
        for (const tile in this.tiles) {
            this.removeObject(tile.name, tile.x, tile.z, tile.yrot)
        }
        this.tiles = [];

        // remove all frames
        for (const frame in this.frames) {
            this.removeObject(frame.name, frame.x, frame.z, frame.yrot)
        }
        this.frames = [];
    }

    // update scene of tiles according to the num_of_tiles
    updateTilesAndFrames(num_of_tiles) {
        // calculate start position
        var start_pos = - (num_of_tiles - 1) * (TILE_LEN / 2);

        // add all tiles
        for (let i = 0; i < num_of_tiles; i++) {
            for (let j = 0; j < num_of_tiles; j++) {
                var tile_x = start_pos + i * TILE_LEN;
                var tile_z = start_pos + j * TILE_LEN;
                this.addObject(TILE_NAME, tile_x, tile_z, 0);
                this.tiles.push({name: TILE_NAME, x: tile_x, z: tile_z, yrot: 0});
            }
        }
        
        // add all frames
        for (let i = 0; i < num_of_tiles; i++) {
            var frame_x = start_pos + i * TILE_LEN;
            
            // add botside frames: with degree 0, same z, with diff x
            // Example: when num = 2, bot side frame (x, z) = (-3, -3), (3, -3)
            var frame_z_bot = start_pos;
            this.addObject(FRAME_NAME, frame_x, frame_z_bot, 0);
            this.tiles.push({name: FRAME_NAME, x: frame_x, z: frame_z_bot, yrot: 0});
            
            // add topside frames: with degree 180, same z, with diff x
            // Example: when num = 2, top side frame (x, z) = (-3, 3), (3, 3)
            var frame_z_top = start_pos + (num_of_tiles - 1) * TILE_LEN;
            this.addObject(FRAME_NAME, frame_x, frame_z_top, 180);
            this.tiles.push({name: FRAME_NAME, x: frame_x, z: frame_z_top, yrot: 180});

            var frame_z = start_pos + i * TILE_LEN;
            
            // add leftside frames: with degree 90, same x, with diff z
            // Example: when num = 2, top side frame (x, z) = (-3, -3), (-3, 3)
            var frame_x_left = start_pos;
            this.addObject(FRAME_NAME, frame_x_left, frame_z, 90);
            this.tiles.push({name: FRAME_NAME, x: frame_x_left, z: frame_z, yrot: 90});

            // add rightside frames: with degree 90, same x, with diff z
            // Example: when num = 2, top side frame (x, z) = (3, -3), (3, 3)
            var frame_x_right = start_pos + (num_of_tiles - 1) * TILE_LEN;
            this.addObject(FRAME_NAME, frame_x_right, frame_z, 270);
            this.tiles.push({name: FRAME_NAME, x: frame_x_right, z: frame_z, yrot: 270});
        }

    }
}
