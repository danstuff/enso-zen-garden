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
        this.camera.upperBetaLimit = Math.PI/2;

        //start in movement mode
        this.camera.panningAxis = PANNING_HOR;
        this.camera.panningSensibility = 500;

        this.camera.attachControl(this.canvas, true);

        this.sun = new BABYLON.DirectionalLight(
            "sun", 
            new BABYLON.Vector3(0, 0, 0), this.scene); 

        this.passiveLight = new BABYLON.HemisphericLight(
            "passive", 
            new BABYLON.Vector3(10, 10, 10), this.scene);
        this.passiveLight.intensity = 0.25;

        //create easing animations for objects
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
                    var mesh = result.meshes[i];
                    mesh.isVisible = false;
                     
                    //give a cartoony outline if not a frame or sand
                    if(mesh.name.search("frame") == -1 &&
                       mesh.name.search("sand") == -1) {
                        mesh.renderOutline = true;
                        mesh.outlineColor = BABYLON.Color3.Black;
                    }
                }

                babInt.scene.meshes = result.meshes;

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
        for(var i in this.scene.meshes) {
            if(this.scene.meshes[i].name == name) {
                return this.scene.meshes[i];
            }
        }
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
            [ this.scaleUpX, this.scaleUpY, this.scaleUpZ ] : 
            [ this.scaleUpX, this.scaleUpZ ]);

        return inst;
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

    removeInstancesInside(x0, z0, x1, z1) {
        for(var i in this.scene.meshes) {
            var mesh = this.scene.meshes[i];

            if(mesh.instances &&
               mesh.name.search("frame") == -1 &&
               mesh.name.search("sand") == -1 &&
               mesh.name.search("rake") == -1)  {
                for(var j in mesh.instances) {
                    var inx = mesh.instances[j].position.x;
                    var iny = mesh.instances[j].position.y;
                    var inz = mesh.instances[j].position.z;

                    if(x0 < inx && inx <= x1 &&
                       z0 < inz && inz <= z1 &&
                       -1 < iny && iny <=  1) {
                        this.removeMeshInstance(
                            mesh.name, mesh.instances[j]);
                    }
                }
            }
        }
    }

    removeMeshInstance(mesh_name, inst) {
        var mesh = this.getMesh(mesh_name);
        var length0 = mesh.instances.length;

        while(mesh.instances.length >= length0) {
            inst.dispose();
        }
    }

    removeAllMeshes(mesh_name) {
        var mesh = this.getMesh(mesh_name);
        while(mesh != null) {
            mesh.dispose();
            mesh = this.getMesh(mesh_name);
        }
    }

    enableCamera() {
        this.camera.attachControl(this.canvas, true);
    }

    disableCamera() {
        this.camera.detachControl();
    }

    startFPSLogging() {
        const babInt = this;
        window.setInterval(function() {
            console.log("FPS - " + babInt.engine.getFps().toFixed());
        }, 1000);
    }
}
