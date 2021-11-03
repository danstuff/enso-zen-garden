const UserMode = {
    MOVING : 0,
    RAKING : 1,
    PLACING : 2
}

class UserInterface {
    constructor(babInt) {
        this.babInt = babInt;

        this.userMode = UserMode.VIEWING;
    }

    createButton(name, bx, by) {
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


        button.onPointerUpObservable.add(function() {
            alert("you did it!");
        });

        return button;
    }

    init() {
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        advancedTexture.addControl(this.createButton("move", 0, 0));  
        advancedTexture.addControl(this.createButton("rake", 0, 1));  
        advancedTexture.addControl(this.createButton("pebbles", 0, 2));  
        advancedTexture.addControl(this.createButton("flower", 0, 3));  
    }
}
