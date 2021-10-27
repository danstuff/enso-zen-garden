const ANIMATION_FRAMERATE = 60;

class BabylonInterface {

    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas, true);

        this.engine = engine;
        window.addEventListener("resize", function() {
            engine.resize();
        });
    }

    addTransition(property, y0, y1, easeFun) {
        const transition = new BABYLON.Animation(
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

        easeFun.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        transition.setEasingFunction(easeFun);

        return transition;
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

        //for the demo, add some rain
        this.startRain();
		
		//Oct 26: Method call for creating GUI
		this.loadGUI();
		
        //create easing animations for objects
        //drop in from above
        this.dropIn = this.addTransition(
            "position.y", 20, .6,
            new BABYLON.BounceEase(1, 5));
        
        //rise up from below
        this.riseUp = this.addTransition(
            "position.y", -20, 0,
            new BABYLON.CubicEase(1, 5));
        const babInt = this;

        BABYLON.SceneLoader.ImportMeshAsync("", 
            "static/assets/", "zen-garden.babylon").
            then(function(result) {

                //hide all meshes
                for(var i in result.meshes) {
                    result.meshes[i].isVisible = false;

                    //TODO fix backface culling
                    result.meshes[i].backFaceCulling = false;
                }

                babInt.meshes = result.meshes;

                meshCallback();

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
            console.log(this.meshes);
            return;
        }

        var inst = mesh.createInstance(name+"_instance");
        inst.isVisible = true;
        inst.position = pos;
        inst.rotation = rot;

        //animate the mesh into position
        this.scene.beginDirectAnimation(
            inst,
            [fromTop ? this.dropIn : this.riseUp],
            0, 1*ANIMATION_FRAMERATE);
    }

    startRendering() {
        const scene = this.scene;
        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }
	loadGUI() {
		//Oct. 25: Code for GUI. Will allow the player to manipulate the scene.
		this.var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

		var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Place item");//button instantiation
		/* button1.width = "150px"
		button1.height = "40px";
		button1.top = "450px";
		button1.left = "20px";
		button1.color = "white";
		button1.cornerRadius = 20;
		button1.background = "green";
		
		button1.onPointerUpObservable.add(function() {
        alert("you did it!");
		});//end function
		AdvancedTexture.addControl(button1); */
		this.var.
	}
	
    startRain() {
        this.rain = new BABYLON.ParticleSystem("rain", 5000);

        this.rain.particleTexture = 
            new BABYLON.Texture("/static/assets/rain.png");

        this.rain.minLifeTime = 1;
        this.rain.maxLifeTime = 1;

        this.rain.emitter = new BABYLON.Vector3(0, 35, 0);
        
        this.rain.minEmitBox = new BABYLON.Vector3(-10, 0, -10);
        this.rain.maxEmitBox = new BABYLON.Vector3(10, 0, 10);

        this.rain.direction1 = new BABYLON.Vector3(0, -50, 0);
        this.rain.direction2 = new BABYLON.Vector3(0, -60, 0);        

        this.rain.minSize = 0.1;
        this.rain.maxSize = 0.9;

        this.rain.start();

        /*BABYLON.ParticleHelper.CreateAsync("rain", this.scene, false).
            then(function(set) {
                set.start();
            });*/
    }
}
