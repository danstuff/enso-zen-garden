const ANIMATION_FRAMERATE = 60;

const PANNING_OFF = new BABYLON.Vector3(0,0,0);
const PANNING_HOR = new BABYLON.Vector3(1,0,1);

class BabylonInterface {

    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas, true);

        this.canvas = canvas;
        this.engine = engine;
        window.addEventListener("resize", function() {
            engine.resize();
        });
    }

    createScene(meshCallback) {
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

        //start in movement mode
        this.camera.panningAxis = PANNING_HOR;
        this.camera.panningSensibility = 500;

        this.camera.wheelPrecision = 20;

        this.camera.attachControl(this.canvas, true);

        this.sun = new BABYLON.DirectionalLight(
            "sun", 
            new BABYLON.Vector3(0, 0, 0), this.scene); 

        this.passiveLight = new BABYLON.HemisphericLight(
            "passive", 
            new BABYLON.Vector3(10, 10, 10), this.scene);
        this.passiveLight.intensity = 0.25;

        //create easing animations for objects
        //drop in from above
        this.dropIn = this.makeTransition("position.y", 20, .6);
        
        //scale up from 0
        this.scaleUpX = this.makeTransition("scaling.x", 0, 1);
        this.scaleUpY = this.makeTransition("scaling.y", 0, 1);
        this.scaleUpZ = this.makeTransition("scaling.z", 0, 1);

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

    makeTransition(property, y0, y1, secs = 1) {
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
            frame: secs*ANIMATION_FRAMERATE,
            value: y1
        });

        transition.setKeys(keys);

        transition.stored_duration = secs * ANIMATION_FRAMERATE;

        var easeFun = new BABYLON.CubicEase(1, 5);
        easeFun.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        transition.setEasingFunction(easeFun);

        return transition;
    }

    runTransitions(instance, transitions) {
        this.scene.beginDirectAnimation(
            instance, transitions,
            0, transitions[0].stored_duration, true);
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

    createMeshInstance(name, pos, rot, fromTop = true, pickable = false) {
        var mesh = this.getMesh(name);
        if(!mesh) return null;

        var inst = mesh.createInstance(name+"_instance");
        inst.isVisible = true;
        inst.position = pos;
        inst.rotation = rot;
        inst.isPickable = pickable;

        //animate the mesh into position
        this.runTransitions(inst, 
            fromTop ? 
            [ this.dropIn, this.scaleUpX, this.scaleUpY, this.scaleUpZ ] : 
            [ this.scaleUpX, this.scaleUpZ ]);

        return mesh.instances.indexOf(inst);
    }

    getMeshInstance(mesh_name, index) {
        var mesh = this.getMesh(mesh_name);
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
            mesh.instances[inst].dispose();
        }
    }

    enableCamera() {
        this.camera.attachControl(this.canvas, true);
    }

    disableCamera() {
        this.camera.detachControl();
    }
}
