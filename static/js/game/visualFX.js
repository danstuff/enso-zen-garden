const SKYBOX_SIZE = 2000;
const STARBOX_SIZE = 1990;

const CLOUD_AREA = 200;
const RAIN_AREA = 100;

const FOG_START = 300;
const FOG_STEP = 10;

class VisualFX {
    constructor(babInt) {
        this.babInt = babInt;
        this.cloudSystems = [];
    }

    stopFX() {
        if(this.cloudSystems) {
            for(var i in this.cloudSystems) {
                this.cloudSystems[i].stop();
            }
        }
        
        if(this.precipitation) {
            for(var i in this.precipitation) {
                this.precipitation[i].stop();
            }
        }

        this.babInt.removeAllMeshes("fogSphere");
    }

    addClouds(amount, speed) {
        //ignore if no clouds
        if(amount == 0) { return; }

        for(var i = 0; i < amount; i++) {
            //create cloud emitter
            var cloud = new BABYLON.ParticleSystem("clouds", 1000);

            cloud.particleTexture = 
                new BABYLON.Texture("/static/assets/textures/cloud.png");

            cloud.minLifeTime = 5;
            cloud.maxLifeTime = 10;

            cloud.emitter = new BABYLON.Vector3(0, 40, 0);

            cloud.minEmitBox =
                new BABYLON.Vector3(-CLOUD_AREA/2, -5, -CLOUD_AREA/2);
            cloud.maxEmitBox =
                new BABYLON.Vector3(CLOUD_AREA/2, 5, CLOUD_AREA/2);

            cloud.direction1 = 
                new BABYLON.Vector3(-speed/2, -0.1, -speed/2);
            cloud.direction2 = 
                new BABYLON.Vector3(speed/2, 0.1, speed/2);

            cloud.minSize = 15;
            cloud.maxSize = 30;

            cloud.start();

            cloud.addColorGradient(0.0, 
                new BABYLON.Color4(0, 0, 0, 0));
            cloud.addColorGradient(0.5, 
                new BABYLON.Color4(0.1, 0.1, 0.1, 1));
            cloud.addColorGradient(1.0,
                new BABYLON.Color4(0, 0, 0, 0));

            this.cloudSystems[this.cloudSystems.length] = cloud;
        }
    }

    addPrecipitation(amount, precip_texture) { 
        //ignore if row length is less than 1
        if(amount == 0) return;

        this.precipitation = [];
        for(var i = 0; i < 4; i++) {
            var precip = new BABYLON.ParticleSystem("precip", amount);

            precip.particleTexture = 
                new BABYLON.Texture(precip_texture);

            precip.minLifeTime = 1.6;
            precip.maxLifeTime = 1.6;

            precip.emitter = new BABYLON.Vector3(0, 45, 0);

            precip.direction1 = new BABYLON.Vector3(0, -25, 0);
            precip.direction2 = new BABYLON.Vector3(0, -25, 0);        

            precip.isBillboardBased = true;
            precip.billboardMode = 2;

            precip.minSize = 10;
            precip.maxSize = 20;
            
            precip.start();

            precip.addColorGradient(0.0, 
                new BABYLON.Color4(0, 0, 0, 0));
            precip.addColorGradient(0.2, 
                new BABYLON.Color4(0.5, 0.5, 0.5, 1));
            precip.addColorGradient(0.8, 
                new BABYLON.Color4(1, 1, 1, 1));
            precip.addColorGradient(1.0,
                new BABYLON.Color4(0, 0, 0, 0));
            this.precipitation[i] = precip;
        }

        const camera = this.babInt.camera;
        const p = this.precipitation;
        this.babInt.scene.registerBeforeRender(function() {
            p[0].worldOffset.x = camera.position.x + 5;
            p[0].worldOffset.z = camera.position.z + 5;
            p[1].worldOffset.x = camera.position.x - 5;
            p[1].worldOffset.z = camera.position.z + 5;
            p[2].worldOffset.x = camera.position.x - 5;
            p[2].worldOffset.z = camera.position.z - 5;
            p[3].worldOffset.x = camera.position.x + 5;
            p[3].worldOffset.z = camera.position.z - 5;
        });
        
    }

    setFog(layers) {
        var fmat = new BABYLON.BackgroundMaterial("fmat", this.babInt.scene);
        fmat.backFaceCulling = false;
        fmat.alphaMode = 2;
        fmat.alpha = 0.05;

        for(var i = 0; i < layers; i++) {
            if(FOG_START - FOG_STEP*i < STARBOX_SIZE) {
                var fbox = 
                    BABYLON.Mesh.CreateSphere("fogSphere", 32,
                        FOG_START - FOG_STEP*i);
                fbox.material = fmat;
                fbox.isPickable = false;
                
                const cfbox = fbox;
                const camera = this.babInt.camera;

                this.babInt.scene.registerBeforeRender(function() {
                    cfbox.position = camera.position;
                });
            } else {
                break;
            }
        }
    }

    setSunPercent(pct) {
        if(!this.skyMaterial) {
            this.skyMaterial = 
                new BABYLON.SkyMaterial("sky", this.babInt.scene); 
            this.skyMaterial.backFaceCulling = false;
            this.skyMaterial.azimuth = 0.25;
            this.skyMaterial.turbidity = 1;

            this.skyBox = 
                BABYLON.Mesh.CreateBox("skyBox", SKYBOX_SIZE, 
                    this.babInt.scene);
            this.skyBox.material = this.skyMaterial;
            this.skyBox.isPickable = false;


            this.starMaterial =
                new BABYLON.BackgroundMaterial("stars", this.babInt.scene);
            this.starMaterial.diffuseTexture =
                new BABYLON.Texture(TEXTURE_FILE_STARS);
            this.starMaterial.backFaceCulling = false;
            this.starMaterial.alphaMode = 10;
            this.starMaterial.alpha = 0.1;

            this.starBox = 
                BABYLON.Mesh.CreateBox("starBox", STARBOX_SIZE,
                    this.babInt.scene);
            this.starBox.material = this.starMaterial;
            this.starBox.isPickable = false;

            const skyBox = this.skyBox;
            const starBox = this.starBox;
            const camera = this.babInt.camera;

            this.babInt.scene.registerBeforeRender(function() {
                skyBox.position = camera.position;
                starBox.position = camera.position;
            });
        }

        this.skyMaterial.luminance = Math.sin(Math.PI*pct)/2+.5;

        this.skyMaterial.inclination = pct-0.5;
        
        this.babInt.sun.direction.x = -this.skyMaterial.sunPosition.x;
        this.babInt.sun.direction.y = -this.skyMaterial.sunPosition.y;
        this.babInt.sun.direction.z = -this.skyMaterial.sunPosition.z;
        this.babInt.sun.intensity = this.skyMaterial.luminance*1.5;
    }
}
