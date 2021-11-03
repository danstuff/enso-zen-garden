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
        this.active_mesh_name = "";
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

        if(!pickResult.hit) return;
        var pickPt = pickResult.pickedPoint;

        switch(this.userMode) {
            case UserMode.PLACING:
                this.garden.addEntity(
                    this.active_mesh_name, pickPt.x, pickPt.z);
                break;

            case UserMode.RAKING:
                break;
        }
    }

    onPointerMove() {
        var pickResult = 
            this.babInt.scene.pick(
                this.babInt.scene.pointerX,
                this.babInt.scene.pointerY);

        if(!pickResult.hit || !this.active_mesh_name) return;

        //if there's an active mesh, move it to the mouse pointer
        var pickPt = pickResult.pickedPoint;
        
        //create if you don't have one already
        if(!this.mesh_insts) {
            this.mesh_insts = this.garden.addEntity(
                this.active_mesh_name, pickPt.x, pickPt.z);
        }

        for(var i in this.mesh_insts) {
            var inst = this.mesh_insts[i];
            inst.position.x = pickPt.x;
            inst.position.z = pickPt.z;
        }
    }

    changeActiveMesh(new_name) {
        for(var i in this.mesh_insts) {
            this.babInt.removeMeshInstance(
                this.active_mesh_name, this.mesh_insts[i]);
        }

        this.active_mesh_name = new_name;
        this.mesh_insts = null;
    }

    init() {
        var advancedTexture = 
            BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const ui = this;

        advancedTexture.addControl(this.createButton("move", 0, 0,
            function() {
                ui.userMode = UserMode.MOVING; 
                ui.changeActiveMesh(null);
            }
        ));  

        advancedTexture.addControl(this.createButton("rake", 0, 1,
            function() {
                ui.userMode = UserMode.RAKING; 
                ui.changeActiveMesh("rake");
            }
        ));  

        advancedTexture.addControl(this.createButton("pebbles", 0, 2,
            function() {
                ui.userMode = UserMode.PLACING; 
                ui.changeActiveMesh("rock_sml_0");
            }
        ));

        advancedTexture.addControl(this.createButton("flower", 0, 3,
            function() {
                ui.userMode = UserMode.PLACING; 
                ui.changeActiveMesh("flower");
            }
        ));  

        //bind to pointer events
        this.babInt.scene.onPointerDown = function() { ui.onPointerDown(); }
        this.babInt.scene.onPointerMove = function() { ui.onPointerMove(); }
    }
}
