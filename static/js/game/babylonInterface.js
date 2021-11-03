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
        this.scene.clearColor = new BABYLON.Color3(0, 0, 0);
        
        this.camera = new BABYLON.ArcRotateCamera(
            "camera", 
            -Math.PI/2,                     // starting horizontal rotation
            Math.PI/2.5,                    // starting vertical rotation
            15,                              // radius
            new BABYLON.Vector3(0, 2, 0));    // camera point to look at

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

        this.sun = new BABYLON.DirectionalLight(
            "sun", 
            new BABYLON.Vector3(0, 0, 0), this.scene); 

        this.passiveLight = new BABYLON.HemisphericLight(
            "passive", 
            new BABYLON.Vector3(10, 10, 10), this.scene);
        this.passiveLight.intensity = 0.25;

        //create easing animations for objects
        //drop in from above
        this.dropIn = this.addTransition("position.y", 20, .6);
        
        //rise up from below
        this.riseUp = this.addTransition("position.y", -20, 0);

        this.scaleUpX = this.addTransition("scaling.x", 0, 1);
        this.scaleUpY = this.addTransition("scaling.y", 0, 1);
        this.scaleUpZ = this.addTransition("scaling.z", 0, 1);

        const babInt = this;

        BABYLON.SceneLoader.ImportMeshAsync("", 
            "static/assets/", "zen-garden.babylon").
            then(function(result) {

                //hide all meshes
                for(var i in result.meshes) {
                    result.meshes[i].isVisible = false;
                }

                babInt.meshes = result.meshes;

                meshCallback();

                babInt.startRendering(); 
            });

        return this.scene;
    }

    startRendering() {
        const scene = this.scene;
        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }

    addTransition(property, y0, y1) {
        var transition = new BABYLON.Animation(
            "transition",
            property,
            ANIMATION_FRAMERATE,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const keys = []
        keys.push({
            frame: 0, 
            value: y0
        });

        keys.push({
            frame: 1*ANIMATION_FRAMERATE,
            value: y1
        });

        transition.setKeys(keys);

        var easeFun = new BABYLON.CubicEase(1, 5);
        easeFun.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        transition.setEasingFunction(easeFun);

        return transition;
    }

    getMesh(name) {
        for(var i in this.meshes) {
            if(this.meshes[i].name == name) {
                return this.meshes[i];
            }
        }

        console.log(
            "WARNING - Ignored attempt to access undefined mesh " +
            name);
        console.log(this.meshes);
        return null;
    }

    createMeshInstance(name, pos, rot, fromTop = true) {
        var mesh = this.getMesh(name);
        if(!mesh) return null;

        var inst = mesh.createInstance(name+"_instance");
        inst.isVisible = true;
        inst.position = pos;
        inst.rotation = rot;

        //animate the mesh into position
        this.scene.beginDirectAnimation(
            inst, 
            [ fromTop ? this.dropIn : this.riseUp, 
              this.scaleUpX, this.scaleUpY, this.scaleUpZ ],
            0, 1*ANIMATION_FRAMERATE, true);

        return mesh.instances.indexOf(inst);
    }

    getMeshInstance(mesh_name, index) {
        var mesh = this.getMesh(mesh_name);
        if(!mesh) return;

        return mesh.instances[index];
    }

    removeAllMeshInstances(mesh_name) {
        var mesh = this.getMesh(mesh_name);
        if(!mesh) return;

        while(mesh.instances.length > 0) {
            for(var i in mesh.instances) {
                mesh.instances[i].dispose();
            }
        }
    }

    removeMeshInstance(mesh_name, inst) {
        var mesh = this.getMesh(mesh_name);
        if(!mesh) return;

        var length0 = mesh.instances.length;

        while(mesh.instances.length >= length0) {
            inst.dispose();
        }
    }
}
