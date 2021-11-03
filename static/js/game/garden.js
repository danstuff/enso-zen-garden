const TILE_XZ_OFFSET = 6;  // size of one tile is 6

const INITIAL_TILE_COUNT = 5;
const FINAL_TILE_COUNT = 50;

const SAND_NAMES = [
    "sand_big_curve",
    "sand_sml_curve",
    "sand_straight",
];

const FRAME_NAMES = [
    "frame_inside",
    "frame_corner",
    "frame_edge" 
];

const PLANT_NAMES = {
    "fruit" : [ "fruit_core", "fruit_leaves" ],
    "succulent" : [ "succulent" ]
};

enum Cardinal {
    NORTH = 0,
    SOUTH = 90,
    EAST = 180,
    WEST = 270
};

class Garden {
    /**
     * @param {BabylonInterface} babInt
     */
    constructor(babInt) {
        // array to hold all current tile objects
        this.tiles = [];
        this.frames = [];
        
        /** @type {BabylonInterface} */
        this.babInt = babInt;

        // length of one side of the total tile area
        /** @type {number} */
        addTilesAndFrames(5, 10);
    }

    /**
     * add an object to the garden
     * @param {String} object_name  name of the object 
     * @param {Number} x            x coordinate of the object
     * @param {Number} z            z coordinate of the object
     * @param {Number} yrot         rotation degree of y axis, if no input will use random angle
     */
    addEntity(mesh_name, x, z, yrot) {
        var pos = new BABYLON.Vector3(x, 0, z);
        var rot = new BABYLON.Vector3(0, Math.random()*Math.PI*2, 0);   
        
        var inst = this.babInt.createMeshInstance(
            mesh_name, pos, rot, true);
        this.entities.push(inst);
    }

    addFrame(mesh_name, tx, tz, direction) {
        var pos = new BABYLON.Vector3(tx * TILE_LEN, 0, tz * TILE_LEN);
        var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
        
        var inst = this.babInt.createMeshInstance(
            mesh_name, pos, rot, false);
        this.frames.push(inst);
    
    }

    addSand(mesh_name, tx, tz, direciton) {
        var pos = new BABYLON.Vector3(tx * TILE_LEN, 0, tz * TILE_LEN);
        var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
        
        var inst = this.babInt.createMeshInstance(
            mesh_name, pos, rot, false);
        this.sand.push(inst);
    }

    /**
     * remove scene of all tiles and frames
     */
    removeFrames()
        // remove all frames
        for (var i in frames) {
            this.babInt.removeMeshInstance(frames[i]);
        }

        this.frames = [];
    }

    /**
     * add scene of tiles and frames according to the number of tiles
     */
    addTilesAndFrames(min_row, max_row) {
        var half_max = max_row/2;
        var half_min = min_row/2;

        // add new flat tiles within the specified rows
        for (var tx = -half_max; tx < half_max; tz++) {
            for (var tz = -half_max; tz < half_max; tz++) {
                
                //skip anything inside the minimum
                if((tx <= -half_min || half_min <= tx) ||
                    (tz <= -half_min || half_min <= tz) {
                    addSand("sand_flat", tx, tz, Cardinal.NORTH);
                }
            }
        }

        // remove any prev existing frames
        removeFrames();
        
        // add 4 corner frames
        addFrame("frame_corner", -half_max, -half_max, Cardinal.NORTH);
        addFrame("frame_corner",  half_max, -half_max, Cardinal.SOUTH);
        addFrame("frame_corner", -half_max,  half_max, Cardinal.EAST);
        addFrame("frame_corner",  half_max,  half_max, Cardinal.WEST);

        // add all edge frames
        for (let toff = -half_max+1; toff < half_max-1; toff++) {
             addFrame("frame_edge", toff,  half_max, Cardinal.NORTH);
             addFrame("frame_edge", toff, -half_max, Cardinal.SOUTH);
             addFrame("frame_edge",  half_max, toff, Cardinal.EAST);
             addFrame("frame_edge", -half_max, toff,  Cardinal.WEST);
        }
    }
}
