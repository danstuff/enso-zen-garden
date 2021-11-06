const SKYBOX_SIZE = 2000;
const STARBOX_SIZE = 1990;

const CLOUD_AREA = 200;
const RAIN_AREA = 100;

const FOG_START = 100;
const FOG_STEP = 10;

class VisualFX {
    constructor(babInt) {
        this.babInt = babInt;
    }

    stopFX() {
        if(this.cloudSystems) {
            for(var i in this.cloudSystems) {
                this.cloudSystems[i].stop();
            }
        }
        
        this.cloudSystems = [];

        if(this.precipSystems) {
            for(var i in this.precipSystems) {
                this.precipSystems[i].stop();
            }
        }

        this.precipSystems = [];

        this.babInt.removeAllMeshes("fogSphere");
    }

    addClouds(amount, speed) {
        //ignore if no clouds
        if(amount == 0) { return; }

        for(var i = 0; i < amount; i++) {
            //create cloud emitter
            var cloud = new BABYLON.ParticleSystem("clouds", 1000);

            cloud.particleTexture = 
                new BABYLON.Texture("/static/assets/cloud.png");

            cloud.minLifeTime = 5;
            cloud.maxLifeTime = 10;

            cloud.emitter = new BABYLON.Vector3(0, 35, 0);

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

            cloud.preWarmCycles = 1000;

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

    addPrecipitation(row_length, precip_texture) { 
        //ignore if row length is less than 1
        if(row_length < 1) {
            return;
        }

        //keep row length above 1/30th of the area size
        if(row_length < RAIN_AREA / 30) {
            row_length = RAIN_AREA / 30;
        }

        //cap row length at 1/10th of the area size
        if(row_length > RAIN_AREA / 10) {
            row_length = RAIN_AREA / 10;
        }

        //add a grid of rain emitters
        for(var x = 0;
            x <= RAIN_AREA;
            x += RAIN_AREA / row_length) {

            for(var z = 0;
                z <= RAIN_AREA;
                z += RAIN_AREA / row_length) {
                
                var precip = new BABYLON.ParticleSystem("precip", 2);

                precip.particleTexture = 
                    new BABYLON.Texture(precip_texture);

                precip.minLifeTime = 0.75;
                precip.maxLifeTime = 0.75;

                precip.emitter = 
                    new BABYLON.Vector3(
                        x - RAIN_AREA/2,
                        30,
                        z - RAIN_AREA/2);
                
                precip.direction1 = new BABYLON.Vector3(0, -45, 0);
                precip.direction2 = new BABYLON.Vector3(0, -45, 0);        

                precip.emitRate = 2;

                precip.isBillboardBased = true;
                precip.billboardMode = 2;

                precip.minSize = 70;
                precip.maxSize = 75;
                
                precip.start();

                precip.addColorGradient(0.0, 
                    new BABYLON.Color4(0, 0, 0, 0));
                precip.addColorGradient(0.2, 
                    new BABYLON.Color4(0.5, 0.5, 0.5, 1));
                precip.addColorGradient(0.8, 
                    new BABYLON.Color4(0.5, 0.5, 0.5, 1));
                precip.addColorGradient(1.0,
                    new BABYLON.Color4(0, 0, 0, 0));

                this.precipSystems[this.precipSystems.length] = precip;
            }
        }
    }

    setFog(layers) {
        var fmat = new BABYLON.BackgroundMaterial("fmat", this.babInt.scene);
        fmat.backFaceCulling = false;
        fmat.alphaMode = 2;
        fmat.alpha = 0.05;

        for(var i = 0; i < layers; i++) {
            if(FOG_START + FOG_STEP*i < STARBOX_SIZE) {
                var fbox = 
                    BABYLON.Mesh.CreateSphere("fogSphere", 32,
                        FOG_START + FOG_STEP*i);
                fbox.material = fmat;
                
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
