const TILE_LEN = 6;  // size of one tile is 6

const GARDEN_MAX_SIZE = 200;

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

    create(entity_name, x, y, z, direction = -1) {
        this.destroy();            

        if(Math.abs(x) > GARDEN_MAX_SIZE/2 ||
           Math.abs(z) > GARDEN_MAX_SIZE/2) {
            return;
        }

        this.name = entity_name;

        var pos = new BABYLON.Vector3(x, y, z);

        var rotx = 0;
        var rotz = 0;
        var size = 1;
        if(direction == -1) {
            direction = Math.random()*360;
            rotx = Math.random()*0.25 - 0.125;
            rotz = Math.random()*0.25 - 0.125;
            size = 0.5 + Math.random()*0.5;
        }

        var rot = 
            new BABYLON.Vector3(rotx, direction*Math.PI/180, rotz);   
        
        //add all sub-meshes for the entity
        var mesh_names = EntityNames[entity_name];
        for(var i in mesh_names) {
            var inst = this.babInt.createMeshInstance(
                mesh_names[i], pos, rot, size, true);

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

    copyTo(x, y, z) {
        var e = new Entity(this.babInt);
        e.create(this.name, x, y, z);
        return e;
    }

    wasCreated() {
        return this.name && this.instances.length > 0;
    }

    setPos(x, y, z) {
        var mesh_names = EntityNames[this.name];
        for(var i in mesh_names) {

            var inst = this.instances[i];
            inst.position.x = x;
            inst.position.y = y;
            inst.position.z = z;
        }
    }

    setDir(direction) {
        var mesh_names = EntityNames[this.name];
        for(var i in mesh_names) {

            var inst = this.instances[i];

            var y = direction * Math.PI/180;

            var easeY = this.babInt.makeTransition(
                "rotation.y", inst.rotation.y, y, 0.25);

            this.babInt.runTransitions(inst, [ easeY ]);
        }
    }
}

class Garden {
    /**
     * @param {BabylonInterface} babInt
     */
    constructor(babInt) {
        // array to hold all current tile objects
        this.sands = [];
        
        /** @type {BabylonInterface} */
        this.babInt = babInt;
    }

    addFrame(mesh_name, tx, tz, direction) {
        var pos = new BABYLON.Vector3(tx * TILE_LEN, 0, tz * TILE_LEN);
        var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
        
        this.babInt.createMeshInstance(
            mesh_name, pos, rot, 1, false);
    }

    addSand(mesh_name, tx, tz, direction) {
        var pos = new BABYLON.Vector3(tx * TILE_LEN, 0, tz * TILE_LEN);
        var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
        
        var inst = this.babInt.createMeshInstance(
            mesh_name, pos, rot, 1, false, true);
        this.sands.push({ name : mesh_name, instance : inst });
    }

    changeSandAt(x, z, new_mesh_name, direction) {
        for(var i in this.sands) {
            var sand = this.sands[i];

            var pos = sand.instance.position;
            var rot = new BABYLON.Vector3(0, direction*Math.PI/180, 0);   
            
            //if coordinates are within the tile's bounds
            var half_tile = TILE_LEN/2;
            if(pos.x - half_tile <= x && x < pos.x + half_tile &&
               pos.z - half_tile <= z && z < pos.z + half_tile) {

                //ignore if you'd be changing it to the same thing
                if(sand.name == new_mesh_name && 
                    sand.instance.rotation.y == rot.y) return false;

                //swap the tile instance for a new one
                this.babInt.removeMeshInstance(sand.name, sand.instance);
                sand = [];

                var inst = this.babInt.createMeshInstance(
                    new_mesh_name, pos, rot, 1, false, true);

                this.sands[i] = { name : new_mesh_name, instance : inst };
                return true;
            }
        }

        return false;
    }

    /**
     * add scene of tiles and frames according to the number of tiles
     */
    addSandAndFrames(min_row, max_row) {
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
