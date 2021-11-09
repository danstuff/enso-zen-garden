const TAP_COOLDOWN_MS = 250;

const UserMode = {
    MOVING : 0,
    ROTATING : 0,
    RAKING : 1,
    PLANTING : 2,
    PLACING : 3
};

const PlantTypes = [
    {
        name: "flowers",
        entity: "flower"
    },

    {
        name: "cacti",
        entity: "cactus"
    },

    {
        name: "trees",
        entity: "tree"
    },

    {
        name: "bushes",
        entity: "bush"
    }
];

const RockTypes = [
    {
        name: "pebbles",
        entities: ["rock_sml_0", "rock_sml_1", "rock_sml_2"]
    },
    {
        name: "stones",
        entities: ["rock_med_0", "rock_med_1", "rock_med_2"]
    },
    {
        name: "boulders",
        entities: ["rock_big_0", "rock_big_1", "rock_big_2"]
    },
];

const RakeTypes = [
    {
        name: "straight rake",
        entity: "rake_straight",
        sand: "sand_straight"
    },

    {
        name: "flat rake",
        entity: "rake_flat",
        sand: "sand_flat"
    },

    {
        name: "circle rake",
        entity: "rake_circle_big",
        sand: "sand_big_curve"
    },

    {
        name: "small circle rake",
        entity: "rake_circle_sml",
        sand: "sand_sml_curve"
    }
];

class UserInterface {

    constructor(babInt, garden) {
        this.babInt = babInt;
        this.garden = garden;

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
                    this.rake_type.entity, 0, 0, 
                    this.rake_direction);

                this.setHelpText("Currently using the " + this.rake_type.name + "." +
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
                this.setHelpText("Currently planting " + this.plant_type.name + "." +
                    "<br>Tap the button again to change what you are planting.");
                break;
            case UserMode.PLACING:
                this.babInt.disableCamera();
                this.rake_entity.destroy();
                this.setHelpText("Currently placing " + this.rock_type.name + "." +
                    "<br>Tap the button again to change what you are placing.");
                break;
        };
    }

    calculateButton(button, bx) {
        var shortside = (window.innerWidth < window.innerHeight) ? 
            window.innerWidth : window.innerHeight;
        var bsize = shortside/5;

        if(bsize > 256) bsize = 256;
        else if(bsize < 64) bsize = 64;

        button.width = bsize+"px";
        button.height = bsize+"px";
        button.cornerRadius = bsize;
        button.left = window.innerWidth/2 + bx*(bsize+10) - bsize/2;
    }

    createButton(name, bx, action) {
        var button = BABYLON.GUI.Button.CreateSimpleButton(name, name);

        button.margin = 20;
        button.thickness = 4;
        button.color = "white";
        
        button.horizontalAlignment = 0;
        button.verticalAlignment = 1;

        this.calculateButton(button, bx);

        if(name == "move") { 
            button.thickness = 8;
            this.selected_button = button;
        }

        const ui = this;
        button.onPointerUpObservable.add(function() {
            //make buttons thicker when selected
            if(ui.selected_button) {
                ui.selected_button.thickness = 4;
            }
            button.thickness = 8; 
            ui.selected_button = button;

            action();
        });

        this.babInt.engine.onResizeObservable.add(function() {
            ui.calculateButton(button, bx);
        });

        return button;
    }

    setHelpText(text) {
        //fade the help text out, replace it, and fade in
        $("#main_help_text").fadeOut(function() {
            $("#main_help_text").html(text);
            $("#main_help_text").fadeIn();
        });  
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

    onPointerDown() {
        var pickResult = 
            this.babInt.scene.pick(
                this.babInt.scene.pointerX,
                this.babInt.scene.pointerY);

        if(!pickResult.hit) return;

        var pickPt = pickResult.pickedPoint;

        switch(this.userMode) {
            case UserMode.MOVING:
                break;

            case UserMode.RAKING:
                this.rake_entity.setPos(pickPt.x, pickPt.z);

                const ui = this;
                this.processTap(
                    function() {
                        ui.rake_direction += 90;
                        ui.rake_entity.setDir(ui.rake_direction);
                    },
                    function() {
                        ui.garden.changeSandAt(
                            pickPt.x, pickPt.z,
                            ui.rake_type.sand, ui.rake_direction);
                    });
                break;

            case UserMode.PLANTING:
                var e = new Entity(this.babInt);
                e.create(this.plant_type.entity, pickPt.x, pickPt.z);
                break;

            case UserMode.PLACING:
                var index = Math.floor(
                    Math.random()*this.rock_type.entities.length);

                var e = new Entity(this.babInt);
                e.create(this.rock_type.entities[index], pickPt.x, pickPt.z);
                break;
        }
    }

    init() {
        var advancedTexture = 
            BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const ui = this;

        advancedTexture.addControl(this.createButton("Move", 0,
            function() {
                ui.setUserMode(UserMode.MOVING);
            }
        ));  

        advancedTexture.addControl(this.createButton("Rake", -1, 
            function() {
                //if already raking, change rake type
                if(ui.userMode == UserMode.RAKING) {
                    var i = RakeTypes.indexOf(ui.rake_type)+1;
                    if(i >= RakeTypes.length) i = 0;
                    ui.rake_type = RakeTypes[i];
                }

                ui.setUserMode(UserMode.RAKING);
            }
        ));  

        advancedTexture.addControl(this.createButton("Pets", -2, 
            function() {
                window.alert("Pets coming soon!");
            }
        ));  

        advancedTexture.addControl(this.createButton("Plants", 1,
            function() {
                //if already planting, change plant type
                if(ui.userMode == UserMode.PLANTING) {
                    var i = PlantTypes.indexOf(ui.plant_type)+1;
                    if(i >= PlantTypes.length) i = 0;
                    ui.plant_type = PlantTypes[i];
                }

                ui.setUserMode(UserMode.PLANTING);
            }
        ));  

        advancedTexture.addControl(this.createButton("Stones", 2,
            function() {
                //if already placing, change stone type
                if(ui.userMode == UserMode.PLACING) {
                    var i = RockTypes.indexOf(ui.rock_type)+1;
                    if(i >= RockTypes.length) i = 0;
                    ui.rock_type = RockTypes[i];
                }


                ui.setUserMode(UserMode.PLACING);
            }
        ));  

        //bind to pointer events
        this.babInt.scene.onPointerDown = 
            function() { ui.onPointerDown(); }
    }
}
