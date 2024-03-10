const TAP_COOLDOWN_MS = 250;

const UserMode = {
    MOVING : 0,
    ROTATING : 0,
    RAKING : 1,
    PLANTING : 2,
    PLACING : 3
};

class UserInterface {
    constructor(babInt, garden, unlocks) {
        this.babInt = babInt;
        this.garden = garden;
        this.unlocks = unlocks;

        this.soundMan = new SoundManager();

        this.sounds = [];
        for(var i in SoundEffects) {
            var sound_file = SoundEffects[i];
            this.sounds[sound_file] = this.soundMan.addSound(sound_file);
        }

        this.userMode = UserMode.MOVING;

        this.rake_entity = new Entity(this.babInt);
        this.rake_direction = Cardinal.NORTH;

        this.rake_type = RakeTypes[0];
        this.plant_type = PlantTypes[0];
        this.rock_type = RockTypes[0];

        this.taps = 0;
    }

    setUserMode(new_mode) {
        this.userMode = new_mode;

        switch(this.userMode) {
            case UserMode.RAKING:
                this.babInt.disableCamera();

                this.rake_entity.create(
                    this.rake_type.entity, 0, 0, 0,
                    this.rake_direction);

                this.setHelpText(
                    "Currently using the " + this.rake_type.name + "." +
                    "<br>Tap the button again to change the current rake." + 
                    "<br>Double tap anywhere to rotate the rake.");
                break;

            case UserMode.MOVING:
                this.babInt.enableCamera();
                this.rake_entity.destroy();
                this.setHelpText("Tap and drag to move around.");
                break;

            case UserMode.PLANTING:
                this.babInt.disableCamera();
                this.rake_entity.destroy();
                this.setHelpText(
                    "Currently planting " + this.plant_type.name + "." +
                    "<br>Tap the button again to change what " + 
                    "you are planting.");
                break;

            case UserMode.PLACING:
                this.babInt.disableCamera();
                this.rake_entity.destroy();
                this.setHelpText(
                    "Currently placing " + this.rock_type.name + "." +
                    "<br>Tap the button again to change what " + 
                    "you are placing.");
                break;
        };
    }

    randomSound(str_list) {
        var pitch = Math.floor(Math.random()*str_list.length);
        this.soundMan.playSound(this.sounds[str_list[pitch]]);
    }

    createButton(id, action) {
        const ui = this;
        $("#"+id).click(function() {
            ui.randomSound(
                ["snap_a", "snap_b"]);
            action();
        });
    }

    setText(id, text) {
        //fade the help text out, replace it, and fade in
        $(id).fadeOut(function() {
            $(id).html(text);
            $(id).fadeIn();
        });  

        return $(id).html();
    }

    setHelpText(text) {
        this.setText("#main_help_text", text);
    }

    setLevelText(level) {
        //cap level titles
        var ti = (level < LevelTitles.length) ?
            level : LevelTitles.length-1;

        this.setText("#main_level_text", 
            "Level " + (level+1) +  " - " +
            LevelTitles[ti] + " Gardener");
    }

    processTap(onSingle, onDouble) {
        this.taps++;

        if(this.taps == 1) {
            const ui = this;
            window.setTimeout(function() {
                if(ui.taps >= 2) {
                    onDouble();
                } else {
                    onSingle();
                }

                ui.taps = 0;
            }, TAP_COOLDOWN_MS);
        }
    }

    getPickPoint() {
       var pickResult = 
            this.babInt.scene.pick(
                this.babInt.scene.pointerX,
                this.babInt.scene.pointerY);

        if(!pickResult.hit) return null;

        return pickResult.pickedPoint;
    }

    moveRake(x, z) {
        this.rake_entity.setPos(x, 0, z);

        //remove any instances that are in the area and change sand
        if(this.garden.changeSandAt(
            x, z, this.rake_type.sand, this.rake_direction) || 
           this.babInt.removeInstancesInside(
            x - 2, z - 2, x + 2, z + 2)) { 
            this.randomSound(["sand_a", "sand_b", "sand_c"]);
        }
    }

    placeEntity(entity_name, x, y, z) {
        var e = new Entity(this.babInt);
        e.create(entity_name, x, y, z);
        this.randomSound(["sand_a", "sand_b", "sand_c"]);
    }

    onPointerDown() {
        this.isPointerDown = true;
        
        var pickPt = this.getPickPoint();
        if(!pickPt) return;
     
        const ui = this;
        switch(this.userMode) {
            case UserMode.MOVING:
                //do nothing
                break;

            case UserMode.RAKING:
                this.processTap(
                    //single tap: move the rake
                    function() {
                        ui.moveRake(pickPt.x, pickPt.z);
                    },

                    //double tap: rotate rake
                    function() {
                        ui.rake_direction += 90;
                        ui.rake_entity.setPos(pickPt.x, 0, pickPt.z);
                        ui.rake_entity.setDir(ui.rake_direction);
                    });
                break;

            case UserMode.PLANTING:
                this.placeEntity(this.plant_type.entity,
                    pickPt.x, pickPt.y, pickPt.z);
                break;

            case UserMode.PLACING:
                var index = Math.floor(
                    Math.random()*this.rock_type.entities.length);
                this.placeEntity(this.rock_type.entities[index],
                    pickPt.x, pickPt.y, pickPt.z);
                break;
        }
    }

    onPointerUp() {
        this.isPointerDown = false;
    }

    onPointerMove() {
        if(this.userMode != UserMode.RAKING || !this.isPointerDown)
            return;

        var pickPt = this.getPickPoint();
        if(!pickPt) return;

        this.moveRake(pickPt.x, pickPt.z);
    }

    notifyUnlock(name) {
        this.randomSound(["riff", "strum"]);
        this.setHelpText("You unlocked " + name);
    }

    init() {
        const ui = this;

        this.createButton("btn_move",
            function() {
                ui.setUserMode(UserMode.MOVING);
            });  

        this.createButton("btn_rake",
            function() {
                //if already raking, change rake type
                if(ui.userMode == UserMode.RAKING) {
                    var i = RakeTypes.indexOf(ui.rake_type)+1;
                    if(i > ui.unlocks.rakes) i = 0;
                    ui.rake_type = RakeTypes[i];
                }

                ui.setUserMode(UserMode.RAKING);
            });  

        this.createButton("btn_plants",
            function() {
                //if already planting, change plant type
                if(ui.userMode == UserMode.PLANTING) {
                    var i = PlantTypes.indexOf(ui.plant_type)+1;
                    if(i > ui.unlocks.plants) i = 0;
                    ui.plant_type = PlantTypes[i];
                }

                ui.setUserMode(UserMode.PLANTING);
            });  

        this.createButton("btn_rocks",
            function() {
                //if already placing, change stone type
                if(ui.userMode == UserMode.PLACING) {
                    var i = RockTypes.indexOf(ui.rock_type)+1;
                    if(i > ui.unlocks.rocks) i = 0;
                    ui.rock_type = RockTypes[i];
                }

                ui.setUserMode(UserMode.PLACING);
            });  

        this.babInt.scene.onPointerDown = 
            function() { ui.onPointerDown(); }
        this.babInt.scene.onPointerUp = 
            function() { ui.onPointerUp(); }
        this.babInt.scene.onPointerMove = 
            function() { ui.onPointerMove(); }
    }
}
