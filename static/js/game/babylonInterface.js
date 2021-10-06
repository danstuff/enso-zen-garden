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

        this.sandMesh = BABYLON.MeshBuilder.CreatePolyhedron(
            "sandMesh", {type: 1, size: 0.1}, this.scene);

        this.sandParticles = new BABYLON.SolidParticleSystem(
            "sandParticles", this.scene, {});

        this.sandParticles.addShape(this.sandMesh, 2000);
        this.sandModel = this.sandParticles.buildMesh();

        this.sandMesh.dispose();

        for(var i in this.sandParticles.particles) {
            var p = this.sandParticles.particles[i];

            p.position.x = (Math.random() - 0.5) * 5.4;
            p.position.y = (Math.random() - 0.5) * 0.25 + 0.8;
            p.position.z = (Math.random() - 0.5) * 5.4;

            p.rotation.x = Math.random() * 3.15;
            p.rotation.y = Math.random() * 3.15;
            p.rotation.z = Math.random() * 1.5;

            var randWhite = function() {
                return Math.random() * 0.1 + 0.9; 
            }

            p.color = new BABYLON.Color4(
                randWhite(), randWhite(), randWhite(), 1.0);
        }

        this.sandParticles.setParticles();

        return this.scene;
    }

    startRendering() {
        var scene = this.scene;
        this.engine.runRenderLoop(function() {
            scene.render();
        });
    }
}
