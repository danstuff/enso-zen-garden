const UserMode = {
    MOVING : 0,
    RAKING : 1,
    PLACING : 2
}

class UserInterface {
    constructor(babInt, garden) {
        this.babInt = babInt;
        this.garden = garden;

        this.userMode = UserMode.MOVING;
        this.active_entity = new Entity(this.babInt);
        this.rake_sand_name = "";
        this.rake_direction = Cardinal.NORTH;
    }

    createButton(name, bx, by, action) {
        var button = BABYLON.GUI.Button.CreateSimpleButton(name, name);
        button.width = "128px";
        button.height = "64px";
        button.margin = 20;
        button.thickness = 4;
        button.cornerRadius = 32;
        button.color = "white";
        
        button.horizontalAlignment = 1;
        button.verticalAlignment = 0;
        button.right = bx*134 + 10;
        button.top = by*74 + 10;

        button.onPointerUpObservable.add(action);

        return button;
    }

    onPointerDown() {
        var pickResult = 
            this.babInt.scene.pick(
                this.babInt.scene.pointerX,
                this.babInt.scene.pointerY);

        if(!pickResult.hit || !this.active_entity.wasCreated()) return;

        var pickPt = pickResult.pickedPoint;

        switch(this.userMode) {
            case UserMode.PLACING:
                this.active_entity.copyTo(pickPt.x, pickPt.z);
                break;

            case UserMode.RAKING:
                this.garden.changeSandAt(
                    pickPt.x, pickPt.z,
                    this.rake_sand_name, this.rake_direction);
                break;
        }
    }

    onPointerMove() {
        var pickResult = 
            this.babInt.scene.pick(
                this.babInt.scene.pointerX,
                this.babInt.scene.pointerY);

        if(!pickResult.hit || !this.active_entity.wasCreated()) return;

        //if there's an active mesh, move it to the mouse pointer
        var pickPt = pickResult.pickedPoint;
        this.active_entity.setPos(pickPt.x, pickPt.z);
    }

    init() {
        var advancedTexture = 
            BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const ui = this;

        advancedTexture.addControl(this.createButton("move", 0, 0,
            function() {
                ui.userMode = UserMode.MOVING; 
                ui.active_entity.destroy();
            }
        ));  

        advancedTexture.addControl(this.createButton("rake", 0, 1,
            function() {
                ui.userMode = UserMode.RAKING; 
                ui.active_entity.create("rake_straight", 0, 0);
                ui.rake_sand_name = "sand_straight";
            }
        ));  

        advancedTexture.addControl(this.createButton("pebbles", 0, 2,
            function() {
                ui.userMode = UserMode.PLACING; 
                ui.active_entity.create("rock_sml_0", 0, 0);
            }
        ));

        advancedTexture.addControl(this.createButton("flower", 0, 3,
            function() {
                ui.userMode = UserMode.PLACING; 
                ui.active_entity.create("flower", 0, 0);
            }
        ));  

        //bind to pointer events
        this.babInt.scene.onPointerDown = function() { ui.onPointerDown(); }
        this.babInt.scene.onPointerMove = function() { ui.onPointerMove(); }
    }
}
