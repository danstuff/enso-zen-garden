const ANIMATION_FRAMERATE = 60;

class BabylonInterface {

    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas, true);

        this.engine = engine;
        window.addEventListener("resize", function() {
            engine.resize();
        });
    }

    createScene(canvas, meshCallback) {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.4);
        
        this.camera = new BABYLON.ArcRotateCamera(
            "camera", 
            -Math.PI/2,                     // starting horizontal rotation
            Math.PI/2.5,                    // starting vertical rotation
            15,                              // radius
            new BABYLON.Vector3(0, 1.5, 0));    // camera point to look at

        //zoom settings
        this.camera.lowerRadiusLimit = 6;
        this.camera.upperRadiusLimit = 100;

        //rotation bounds
        this.camera.lowerBetaLimit = 0.5;
        this.camera.upperBetaLimit = 1.6;

        //panning settings
        this.camera.panningAxis = new BABYLON.Vector3(1, 0, 1);

        this.camera.wheelPrecision = 20;

        this.camera.attachControl(canvas, true);

        this.sun = new BABYLON.HemisphericLight(
            "light", 
            new BABYLON.Vector3(0.5, 1, 0.5)); // light direction

        //create easing animations for objects
        //drop in from above
        this.dropIn = new BABYLON.Animation(
            "dropIn",
            "position.y",
            ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const dropInKeys = []
        dropInKeys.push({
            frame: 0, 
            value: 20
        });

        dropInKeys.push({
            frame: 1*ANIMATION_FRAMERATE,
            value: .6
        });

        this.dropIn.setKeys(dropInKeys);

        var bounceEase = new BABYLON.BounceEase(1, 6);
        bounceEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this.dropIn.setEasingFunction(bounceEase);

        //rise up from below
        this.riseUp = new BABYLON.Animation(
            "riseUp",
            "position.y",
            ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const riseUpKeys = []
        riseUpKeys.push({
            frame: 0, 
            value: -20
        });

        riseUpKeys.push({
            frame: 1*ANIMATION_FRAMERATE,
            value: 0
        });

        this.riseUp.setKeys(riseUpKeys);

        var sineEase = new BABYLON.CubicEase();
        sineEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this.riseUp.setEasingFunction(sineEase);

        const babInt = this;

        BABYLON.SceneLoader.ImportMeshAsync("", 
            "static/assets/", "zen-garden.babylon").
            then(function(result) {

                //hide all meshes
                for(var i in result.meshes) {
                    result.meshes[i].isVisible = false;
                }

                babInt.meshes = result.meshes;
                
                babInt.createMeshInstance("succulent",
                    new BABYLON.Vector3(0, -100, 0), 
                    new BABYLON.Vector3(0, 0, 0));
                babInt.createMeshInstance("frame_corner",
                    new BABYLON.Vector3(0, -100, 0), 
                    new BABYLON.Vector3(0, 0, 0), false);
                babInt.createMeshInstance("sand_big_curve",
                    new BABYLON.Vector3(0, -100, 0), 
                    new BABYLON.Vector3(0, 0, 0), false);

                babInt.startRendering(); 
            });

        return this.scene;
    }

    getMesh(name) {
        for(var i in this.meshes) {
            if(this.meshes[i].name == name) {
                return this.meshes[i];
            }
        }
    }

    createMeshInstance(name, pos, rot, fromTop = true) {
        var mesh = this.getMesh(name);

        if(!mesh) {
            console.log(
                "WARNING - Ignored attempt to access undefined mesh " +
                name);
            return;
        }

        var inst = mesh.createInstance(name+"_instance");
        inst.isVisible = true;
        inst.position = pos;
        inst.rotation = rot;

        //animate the mesh into position
        this.scene.beginDirectAnimation(
            inst,
            [fromTop ? this.dropIn : this.riseUp ],
            0, 1*ANIMATION_FRAMERATE);
    }

    startRendering() {
        const scene = this.scene;
        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }
}
