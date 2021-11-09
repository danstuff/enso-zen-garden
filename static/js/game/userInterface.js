const TAP_COOLDOWN_MS = 250;

const UserMode = {
    MOVING : 0,
    ROTATING : 0,
    RAKING : 1,
    PLANTING : 2
};

const PlantNames = [
    "flower",
    "succulent"
];

const RockNames = [
    "small"
];

const RakeNames = [
    "rake_straight",
    "rake_flat",
    "rake_circle_big",
    "rake_circle_sml"
];

class UserInterface {

    constructor(babInt, garden) {
        this.babInt = babInt;
        this.garden = garden;

        this.userMode = UserMode.MOVING;

        this.rake_entity = new Entity(this.babInt);
        this.rake_sand_name = "";
        this.rake_direction = Cardinal.NORTH;

        this.place_entity_names = [];

        this.taps = 0;
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

            case UserMode.PLACING:
                var index = Math.floor(
                    Math.random()*this.place_entity_names.length);

                var e = new Entity(this.babInt);
                e.create(this.place_entity_names[index],
                    pickPt.x, pickPt.z)
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
                            ui.rake_sand_name, ui.rake_direction);
                    });
                break;
            default:
                break;
        }
    }

    init() {
        var advancedTexture = 
            BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const ui = this;

        advancedTexture.addControl(this.createButton("move", 0,
            function() {
                ui.userMode = UserMode.MOVING; 
                ui.babInt.camera.panningAxis = PANNING_HOR;
                ui.babInt.enableCamera();

                ui.rake_entity.destroy();
                ui.place_entity_names = [];
            }
        ));  

        advancedTexture.addControl(this.createButton("rake", -1, 
            function() {
                ui.userMode = UserMode.RAKING; 
                ui.babInt.disableCamera();

                ui.rake_entity.create(
                    "rake_straight", 0, 0, ui.rake_direction);
                ui.rake_sand_name = "sand_straight";
                ui.place_entity_names = [];
            }
        ));  

        advancedTexture.addControl(this.createButton("flower", 1,
            function() {
                ui.userMode = UserMode.PLACING; 
                ui.babInt.camera.panningAxis = PANNING_OFF;
                ui.babInt.disableCamera();

                ui.rake_entity.destroy();
                ui.place_entity_names = [ "flower" ];
            }
        ));  

        //bind to pointer events
        this.babInt.scene.onPointerDown = 
            function() { ui.onPointerDown(); }
    }
}
