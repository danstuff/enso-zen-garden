class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class MeshRef {
    constructor(id, pos, time) {
        this.id = id;
        this.pos = pos;
        this.time = time;
    }
}

class EntityType {
    constructor() {
        this.meshRefs = [];
    }
}

class Entity {
    constructor(pos, type_id) {
        this.pos = pos;
        this.type_id = type_id;
        this.exist_time = 0;
    }

    update(update_ms) {
        this.exist_time += update_ms;
    }

    draw(canvas, entityTypeList, meshList) {
        var type = entityTypeList[this.type_id];

        for(i in type.meshRefs) {
            var mr = type.meshRefs[i];

            if(this.exist_time >= mr.time) {
                //TODO draw meshList[mr.id] at pos+mr.pos
            }
        }
    }
}


class Garden {
    constructor() {
        this.water_level = 0;
        this.exist_time = 0;

        this.terrain = [];

        this.entities = [];
    }

    update(update_ms) {
        this.exist_time += update_ms;

        //update every entity
        for(i in this.entities) {
            this.entities[i].update(update_ms);
        }
    }

    draw(canvas, entityTypeList, meshList) {
        //TODO draw terrain and water
       
        //draw every entity
        for(i in this.entities) {
            this.entities[i].draw(canvas, entityTypeList, meshList); 
        }
    }

    addEntity(entity) {
        //push an entity to the garden's entity list
        var l = this.entities.length;
        this.entities[l] = entity;
    }
}
