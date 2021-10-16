class BabylonInterface {
    constructor(canvas) {
        const engine = new BABYLON.Engine(canvas, true);

        this.engine = engine;
        window.addEventListener("resize", function() {
            engine.resize();
        });
    }

    createScene(canvas) {
        this.scene = new BABYLON.Scene(this.engine);
        
        this.camera = new BABYLON.ArcRotateCamera(
            "camera", 
            -Math.PI/2,                     // starting horizontal rotation
            Math.PI/2.5,                    // starting vertical rotation
            8,                              // radius
            new BABYLON.Vector3.Zero());    // camera point to look at

        this.camera.lowerRadiusLimit = 6;
        this.camera.upperRadiusLimit = 100;

        this.camera.lowerBetaLimit = 0.5;
        this.camera.upperBetaLimit = 1.4;

        this.camera.panningDistanceLimit = 6;
        this.camera.panningAxis = new BABYLON.Vector3(1, 0, 1);

        this.camera.wheelPrecision = 20;

        this.camera.attachControl(canvas, true);

        this.sun = new BABYLON.HemisphericLight(
            "light", 
            new BABYLON.Vector3(0.5, 1, 0.5)); // light direction

        BABYLON.SceneLoader.ImportMeshAsync("", 
            "static/assets/", "zen-garden.babylon");

        return this.scene;
    }

    startRendering() {
        var scene = this.scene;
        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }
}
