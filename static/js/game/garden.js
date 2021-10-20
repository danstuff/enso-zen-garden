class Garden {
    constructor(babInt) {
        this.tiles = [];
        this.babInt = babInt;
    }

    addTile(sand_name, sand_yrot, frame_name, frame_yrot, x, z) {
        var pos = new BABYLON.Vector3(x, -100, z);

        var rots = new BABYLON.Vector3(0, sand_yrot*Math.PI/180, 0);
        var rotf = new BABYLON.Vector3(0, frame_yrot*Math.PI/180, 0);
        
        this.babInt.createMeshInstance(sand_name, pos, rots, false);
        this.babInt.createMeshInstance(frame_name, pos, rotf, false);
    }

    changeTile(new_sand_name, x, z, yrot) {
        //TODO
    }

    addEntity(entity_name, x, z) {
        var pos = new BABYLON.Vector3(x, -100, z);
        var rot = new BABYLON.Vector3(0, Math.random()*360, 0);
        
        this.babInt.createMeshInstance(entity_name, pos, rot);
    }

    removeEntity(x, z) {
        //TODO
    }
}
