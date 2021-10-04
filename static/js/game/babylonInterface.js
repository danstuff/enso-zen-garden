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
            -Math.PI/2,                     // maximum horizontal rotation
            Math.PI/2.5,                    // maximum vertical rotation
            8,                              // radius
            new BABYLON.Vector3.Zero());    // camera point to look at

        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 100;

        this.camera.wheelPrecision = 20;

        this.camera.attachControl(canvas, true);

        this.sun = new BABYLON.HemisphericLight(
            "light", 
            new BABYLON.Vector3(0.5, 1, 0.5)); // light direction

        BABYLON.SceneLoader.ImportMeshAsync("", 
            "static/assets/garden/", "frame.babylon");

        return this.scene;
    }

    startRendering() {
        var scene = this.scene;
        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }
}
