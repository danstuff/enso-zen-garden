const TAP_COOLDOWN_MS = 250;

const UserMode = {
    MOVING : 0,
    ROTATING : 0,
    RAKING : 1,
    PLANTING : 2,
    PLACING : 3
};

class UserInterface {
    constructor(babInt, garden) {
        this.babInt = babInt;
        this.garden = garden;

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

        // TODO unlockLevel should be loaded from storage here,
        // or default to 1
        this.unlockLevel = 1; 
        this.setUnlockLevel(this.unlockLevel);
    }

    setUserMode(new_mode) {
        this.userMode = new_mode;

        switch(this.userMode) {
            case UserMode.RAKING:
                this.babInt.disableCamera();

                this.rake_entity.create(
                    this.rake_type.entity, 0, 0, 
                    this.rake_direction);

                this.setHelpText(
                    "Currently using the " + this.rake_type.name + "." +
                    "<br>Tap the button again to change the current rake.");
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

    randomPluck() {
        this.randomSound(["one_pluck_low", "one_pluck", "one_pluck_high"]);
    }

    randomSand() {
        this.randomSound(["sand_a", "sand_b", "sand_c"]);
    }

    randomRing() {
        this.randomSound(["ring_low", "ring", "ring_high"]);
    }

    randomUnlockSound() {
        this.randomSound(["riff", "strum"]);
    }

    createButton(id, action) {
        const ui = this;
        $("#"+id).click(function() {
            ui.randomPluck();
            action();
        });
    }

    setHelpText(text) {
        //fade the help text out, replace it, and fade in
        $("#main_help_text").fadeOut(function() {
            $("#main_help_text").html(text);
            $("#main_help_text").fadeIn();
        });  

        return $("#main_help_text").html();
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

    //TODO Also process pointer move events for rake dragging

    onPointerDown() {
        var pickResult = 
            this.babInt.scene.pick(
                this.babInt.scene.pointerX,
                this.babInt.scene.pointerY);

        if(!pickResult.hit) return;

        var pickPt = pickResult.pickedPoint;

        const ui = this;
        switch(this.userMode) {
            case UserMode.MOVING:
                //do nothing
                break;

            case UserMode.RAKING:
                this.rake_entity.setPos(pickPt.x, pickPt.z);

                this.processTap(
                    //single tap: place sand
                    function() {
                        //TODO this is the code we should move to
                        //the pointer move / drag function
                        ui.randomSand();

                        ui.garden.changeSandAt(
                            pickPt.x, pickPt.z,
                            ui.rake_type.sand, ui.rake_direction);
                    },

                    //double tap: rotate rake
                    function() {
                        ui.randomSand();
                        
                        ui.rake_direction += 90;
                        ui.rake_entity.setDir(ui.rake_direction);
                    });
                break;

            case UserMode.PLANTING:
                var e = new Entity(this.babInt);
                e.create(this.plant_type.entity, pickPt.x, pickPt.z);
                ui.randomSand();
                break;

            case UserMode.PLACING:
                var index = Math.floor(
                    Math.random()*this.rock_type.entities.length);

                var e = new Entity(this.babInt);
                e.create(this.rock_type.entities[index], pickPt.x, pickPt.z);
                ui.randomSand();
                break;
        }
    }

    setUnlockLevel(level, notify) {
        var prevRocks = this.unlockedRocks || 0;
        var prevPlants = this.unlockedPlants || 0;
        var prevRakes = this.unlockedRakes || 0;

        var cap = function(v, c) { return (v < c) ? v : c; } 

        // on odd levels, you unlock plants and rocks
        var count = Math.floor((level + 1)/2);
        this.unlockedRocks = cap(count, RockTypes.length);
        this.unlockedPlants = cap(count, PlantTypes.length);

        // on even levels, you unlock rakes
        this.unlockedRakes = 
            cap(Math.floor(level/2) + 1, RakeTypes.length);

        if(notify) {
            this.randomRing();
            
            //if you reached a new unlock level, notify of new plants
            if(this.unlockedRocks != prevRocks &&
               this.unlockedPlants != prevPlants) {
                this.setHelpText("You unlocked " +
                    PlantTypes[this.unlockedPlants-1].name + " and " + 
                    RockTypes[this.unlockedRocks-1].name + ".");

            //otherwise, if the rake is new, notify of it
            } else if(this.unlockedRakes != prevRakes) {
                this.setHelpText("You unlocked " + 
                    RakeTypes[this.unlockedRakes-1].name + ".");
            }
        }
    }

    nextUnlockLevel() {
        this.setUnlockLevel(++this.unlockLevel, true);

        //TODO unlock level should be saved here
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
                    if(i >= ui.unlockedRakes) i = 0;
                    ui.rake_type = RakeTypes[i];
                }

                ui.setUserMode(UserMode.RAKING);
            });  

        this.createButton("btn_plants",
            function() {
                //if already planting, change plant type
                if(ui.userMode == UserMode.PLANTING) {
                    var i = PlantTypes.indexOf(ui.plant_type)+1;
                    if(i >= ui.unlockedPlants) i = 0;
                    ui.plant_type = PlantTypes[i];
                }

                ui.setUserMode(UserMode.PLANTING);
            });  

        this.createButton("btn_rocks",
            function() {
                //if already placing, change stone type
                if(ui.userMode == UserMode.PLACING) {
                    var i = RockTypes.indexOf(ui.rock_type)+1;
                    if(i >= ui.unlockedRocks) i = 0;
                    ui.rock_type = RockTypes[i];
                }

                ui.setUserMode(UserMode.PLACING);
            });  

        this.babInt.scene.onPointerDown = 
            function() { ui.onPointerDown(); }
    }
}
