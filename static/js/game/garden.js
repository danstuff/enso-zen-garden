const TILE_LEN = 6;  // size of one tile is 6

const SandNames = [
    "sand_big_curve",
    "sand_sml_curve",
    "sand_straight",
];

const FrameNames = [
    "frame_inside",
    "frame_corner",
    "frame_edge" 
];

const EntityNames = {
    "fruit" : [ "fruit_core", "fruit_leaves" ],
    "succulent" : [ "succulent" ]
};

const Cardinal = {
    NORTH : 0,
    SOUTH : 180,
    EAST : 90,
    WEST : 270
};

class Garden {
    /**
     * @param {BabylonInterface} babInt
     */
    constructor(babInt) {
        // array to hold all current tile objects
        this.sand = [];
        this.entities = [];
        
        /** @type {BabylonInterface} */
        this.babInt = babInt;
    }

    addEntity(entity_name, x, z, yrot) {
        var pos = new BABYLON.Vector3(x, 0, z);
        var rot = new BABYLON.Vector3(0, Math.random()*Math.PI*2, 0);   
        
        //add all sub-meshes for the entity
        for(var i in EntityNames[entity_name]) {
            var mesh_name = EntityNames[entity_name][i];

            var inst = this.babInt.createMeshInstance(
                mesh_name, pos, rot, true);
            
            this.entities.push(inst);
        }
    }

    addFrame(mesh_name, tx, tz, direction) {
        var pos = new BABYLON.Vector3(tx * TILE_LEN, 0, tz * TILE_LEN);
        var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
        
        this.babInt.createMeshInstance(
            mesh_name, pos, rot, false);
    }

    addSand(mesh_name, tx, tz, direction) {
        var pos = new BABYLON.Vector3(tx * TILE_LEN, 0, tz * TILE_LEN);
        var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
        
        var inst = this.babInt.createMeshInstance(
            mesh_name, pos, rot, false);
        this.sand.push(inst);
    }

    /**
     * add scene of tiles and frames according to the number of tiles
     */
    addTilesAndFrames(min_row, max_row) {
        var half_max = Math.floor(max_row/2);
        var half_min = Math.floor(min_row/2);

        // add new flat tiles within the specified rows
        for (var tx = -half_max; tx <= half_max; tx++) {
            for (var tz = -half_max; tz <= half_max; tz++) {
                
                //skip anything inside the minimum
                if((tx <= -half_min || half_min <= tx) ||
                   (tz <= -half_min || half_min <= tz)) {
                    this.addSand("sand_flat", tx, tz, Cardinal.NORTH);
                }
            }
        }

        // remove any prev existing frames
        this.babInt.removeMeshInstances("frame_edge");
        this.babInt.removeMeshInstances("frame_corner");
        
        // add 4 corner frames
        this.addFrame("frame_corner", -half_max, -half_max, Cardinal.NORTH);
        this.addFrame("frame_corner",  half_max, -half_max, Cardinal.WEST);
        this.addFrame("frame_corner", -half_max,  half_max, Cardinal.EAST);
        this.addFrame("frame_corner",  half_max,  half_max, Cardinal.SOUTH);

        // add all edge frames
        for (var toff = -half_max+1; toff < half_max; toff++) {
             this.addFrame("frame_edge", toff, -half_max, Cardinal.NORTH);
             this.addFrame("frame_edge", -half_max, toff, Cardinal.EAST);
             this.addFrame("frame_edge", toff,  half_max, Cardinal.SOUTH);
             this.addFrame("frame_edge",  half_max, toff, Cardinal.WEST);
        }
    }
}
