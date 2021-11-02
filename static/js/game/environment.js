const TEXTURE_FILE_RAIN = "/static/assets/rain.png";
const TEXTURE_FILE_SNOW = "/static/assets/snow.png";

class Environment {
    constructor(babInt, area_size) {
        this.babInt = babInt;
        this.area_size = area_size;

        this.dialogue = new Dialogue();
        this.audio = new Audio();
    }

    getWeatherData() {
        const env = this;

        //start by fetching an approximate location
        $.getJSON("https://geolocation-db.com/json/")
            .done(function(location) {
                console.log("Found aproximate location: " + location.city);

                //fetch semi-secure data from the server
                $.getJSON("/secure/get/")
                    .done(function(secure) {

                        //fetch openweathermap data for location
                        $.getJSON("https://api.openweathermap.org/" + 
                            "data/2.5/weather?q=" + location.city +
                            "&appid=" + secure.openWeather)
                            .done(function(data) {

                                console.log("Got weather data:");
                                console.log(data);

                                env.processWeatherData(data);
                            });
                    });
            });
    }

    processWeatherData(data) {
        //calculate % of time passed since sunrise
        var current_time = new Date().getTime() / 1000;
        var sunrise_time = data.sys.sunrise;
        var sunset_time = data.sys.sunset;

        current_time = sunrise_time;

        var day_period = sunset_time - sunrise_time;
        var day_pct = (current_time - sunrise_time) / day_period;

        //set sun based on day percent
        this.setSunPercent(day_pct);

        const env = this;
        window.setInterval(function() {
            day_pct += 0.01;

            env.setSunPercent(day_pct);
            console.log(day_pct);
        }, 100);

        this.setFog(800);

        //add clouds and rain/snow based on weather data
        if(data.clouds) this.addClouds(data.clouds.all*2000, data.wind.speed / 2);
        if(data.rain) this.addPrecipitation(data.rain["1h"] / 10, TEXTURE_FILE_RAIN);
        if(data.snow) this.addPrecipitation(data.snow["1h"] / 10, TEXTURE_FILE_SNOW);

        //set audio strength based on rain amount
        if(data.rain) {
            this.audio.playNoise();
            this.audio.setNoiseStrength(data.rain["1h"] / 10);
        }

        //ask server for dialogue
        this.dialogue.request(data.weather.main);
    }

    addClouds(amount, speed) {
        //ignore if no clouds
        if(amount == 0) { return; }

        //create cloud emitter
        this.clouds = new BABYLON.ParticleSystem("clouds", amount);

        this.clouds.particleTexture = 
            new BABYLON.Texture("/static/assets/cloud.png");

        this.clouds.minLifeTime = 5;
        this.clouds.maxLifeTime = 10;

        this.clouds.emitter = new BABYLON.Vector3(0, 35, 0);

        this.clouds.minEmitBox =
            new BABYLON.Vector3(-this.area_size/2, -5, -this.area_size/2);
        this.clouds.maxEmitBox =
            new BABYLON.Vector3(this.area_size/2, 5, this.area_size/2);

        this.clouds.direction1 = 
            new BABYLON.Vector3(-speed/2, -0.1, -speed/2);
        this.clouds.direction2 = 
            new BABYLON.Vector3(speed/2, 0.1, speed/2);

        this.clouds.minSize = 15;
        this.clouds.maxSize = 30;

        this.clouds.start();

        this.clouds.addColorGradient(0.0, 
            new BABYLON.Color4(0, 0, 0, 0));
        this.clouds.addColorGradient(0.5, 
            new BABYLON.Color4(0.5, 0.5, 0.5, 1));
        this.clouds.addColorGradient(1.0,
            new BABYLON.Color4(0, 0, 0, 0));
    }

    addPrecipitation(row_length, precip_texture) { 
        //ignore if row length is less than 1
        if(row_length < 1) {
            return;
        }

        //keep row length above 1/30th of the area size
        if(row_length < this.area_size / 30) {
            row_length = this.area_size / 30;
        }

        //cap row length at 1/10th of the area size
        if(row_length > this.area_size / 10) {
            row_length = this.area_size / 10;
        }

        //add a grid of rain emitters
        this.precipSystems = [];
        for(var x = 0;
            x <= this.area_size;
            x += this.area_size / row_length) {

            for(var z = 0;
                z <= this.area_size;
                z += this.area_size / row_length) {
                
                var precip = new BABYLON.ParticleSystem("precip", 2);

                precip.particleTexture = 
                    new BABYLON.Texture(precip_texture);

                precip.minLifeTime = 0.75;
                precip.maxLifeTime = 0.75;

                precip.emitter = 
                    new BABYLON.Vector3(
                        x - this.area_size/2,
                        30,
                        z - this.area_size/2);
                
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

    setFog(visibility) {
        var fmat = new BABYLON.StandardMaterial("fmat", this.babInt.scene);
        fmat.alpha = 0.20;

        for(var i = 0; i < 4; i++) {
            var fbox = 
                BABYLON.Mesh.CreateSphere("fogSphere", 32,
                    visibility + i*10);
            fbox.material = fmat;
        }
    }

    setSunPercent(pct) {
        if(!this.skyMaterial) {
            this.skyMaterial = 
                new BABYLON.SkyMaterial("sky", this.babInt.scene); 
            this.skyMaterial.backFaceCulling = false;
            this.skyMaterial.azimuth = 0.25;

            this.skyBox = 
                BABYLON.Mesh.CreateBox("skyBox", 1000.0, this.babInt.scene);
            this.skyBox.material = this.skyMaterial;
        }


        this.skyMaterial.turbidity = Math.pow(pct, 1/3); 
        this.skyMaterial.luminance = Math.sin(Math.PI*pct);

        this.skyMaterial.inclination = pct-0.5;
        
        this.babInt.sun.direction.x = -this.skyMaterial.sunPosition.x;
        this.babInt.sun.direction.y = -this.skyMaterial.sunPosition.y;
        this.babInt.sun.direction.z = -this.skyMaterial.sunPosition.z;
        this.babInt.sun.intensity = this.skyMaterial.luminance/2;
    }
}
