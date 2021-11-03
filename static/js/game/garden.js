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
    "" : [],
    "flower" : [ "flower_core", "flower_leaves" ],
    "succulent" : [ "succulent" ]
};

const Cardinal = {
    NORTH : 0,
    SOUTH : 180,
    EAST : 90,
    WEST : 270
};

class Entity {
    constructor(babInt) {
        this.babInt = babInt;

        this.name = "";
        this.instances = [];
    }

    create(entity_name, x, z) {
        this.destroy();

        this.name = entity_name;

        var pos = new BABYLON.Vector3(x, 0, z);

        var rot = new BABYLON.Vector3(0, Math.random()*Math.PI*2, 0);   
        
        //add all sub-meshes for the entity
        var mesh_names = EntityNames[entity_name];
        for(var i in mesh_names) {
            var inst = this.babInt.createMeshInstance(
                mesh_names[i], pos, rot, true);

            this.instances.push(inst);
        }
    }

    destroy() {
        var mesh_names = EntityNames[this.name];
        for(var i in mesh_names) {
            this.babInt.removeMeshInstance(
                mesh_names[i], this.instances[i]);
        }

        this.name = "";
        this.instances = [];
    }

    copyTo(x, z) {
        var e = new Entity(this.babInt);
        e.create(this.name, x, z);
        return e;
    }

    wasCreated() {
        return this.name && this.instances.length > 0;
    }

    setPos(x, z) {
        var mesh_names = EntityNames[this.name];
        for(var i in mesh_names) {

            var inst = this.babInt.getMeshInstance(
                mesh_names[i], this.instances[i]);

            inst.position.x = x;
            inst.position.z = z;
        }
    }
}

class Garden {
    /**
     * @param {BabylonInterface} babInt
     */
    constructor(babInt) {
        // array to hold all current tile objects
        this.sand = [];
        
        /** @type {BabylonInterface} */
        this.babInt = babInt;
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
        this.babInt.removeAllMeshInstances("frame_edge");
        this.babInt.removeAllMeshInstances("frame_corner");
        
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
