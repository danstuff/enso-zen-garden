const TAP_COOLDOWN_MS = 250;

const UserMode = {
    MOVING : 0,
    ROTATING : 0,
    RAKING : 1,
    PLANTING : 2,
    PLACING : 3
};

const PlantTypes = [
    "flower",
    "cactus",
    "tree",
    "bush"
];

const RockTypes = {
    "sml" : ["rock_sml_0", "rock_sml_1", "rock_sml_2"],
    "med" : ["rock_med_0", "rock_med_1", "rock_med_2"],
    "big" : ["rock_big_0", "rock_big_1", "rock_big_2"]
};

const RakeTypes = {
    "straight" : {
        name: "Straight Rake",
        entity: "rake_straight",
        sand: "sand_straight"
    },

    "flat" : {
        name: "Flat Rake",
        entity: "rake_flat",
        sand: "sand_flat"
    },

    "circle_big" : {
        name: "Circle Rake",
        entity: "rake_circle_big",
        sand: "sand_circle_big"
    },

    "circle_sml" : {
        name: "Small Circle Rake",
        entity: "rake_circle_sml",
        sand: "sand_circle_sml"
    }
};

class UserInterface {

    constructor(babInt, garden) {
        this.babInt = babInt;
        this.garden = garden;

        this.userMode = UserMode.MOVING;

        this.rake_entity = new Entity(this.babInt);
        this.rake_direction = Cardinal.NORTH;

        this.rake_type = RakeTypes["straight"];
        this.plant_type = PlantTypes[0];
        this.rock_type = RockTypes["sml"];

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
                break;

            case UserMode.MOVING:
                this.babInt.enableCamera();
                this.rake_entity.destroy();
                break;

            case UserMode.PLANTING:
            case UserMode.PLACING:
                this.babInt.disableCamera();
                this.rake_entity.destroy();
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
                e.create(this.plant_type, pickPt.x, pickPt.z);
                break;

            case UserMode.PLACING:
                var index = Math.floor(
                    Math.random()*this.rock_type.length);

                var e = new Entity(this.babInt);
                e.create(this.rock_type[index], pickPt.x, pickPt.z);
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
                ui.setUserMode(UserMode.RAKING);
            }
        ));  

        advancedTexture.addControl(this.createButton("Plants", 1,
            function() {
                ui.setUserMode(UserMode.PLANTING);
            }
        ));  

        advancedTexture.addControl(this.createButton("Pebbles", 2,
            function() {
                ui.setUserMode(UserMode.PLACING);
            }
        ));  

        //bind to pointer events
        this.babInt.scene.onPointerDown = 
            function() { ui.onPointerDown(); }
    }
}
