class Environment {
    constructor() {}

    getWeatherData(callbackFun, game) {
        //start by fetching an approximate location
        $.getJSON("https://geolocation-db.com/json/")
            .done(function(location) {
                console.log("Found aproximate location: " + location.city);

                //fetch semi-secure data from the server
                $.getJSON("/secure/get/")
                    .done(function(secure) {
                        $.getJSON("https://api.openweathermap.org/" + 
                            "data/2.5/weather?q=" + location.city +
                            "&appid=" + secure.openWeather)
                            .done(function(data) {

                                console.log("Got weather data:");
                                console.log(data);

                                callbackFun(data, game);
                            });
                    });

                
            });
    }

    addClouds(area_size, amount, speed) {
        this.clouds = new BABYLON.ParticleSystem("clouds", amount);

        this.clouds.particleTexture = 
            new BABYLON.Texture("/static/assets/cloud.png");

        this.clouds.minLifeTime = 5;
        this.clouds.maxLifeTime = 10;

        this.clouds.emitter = new BABYLON.Vector3(0, 35, 0);

        this.clouds.minEmitBox =
            new BABYLON.Vector3(-area_size/2, -5, -area_size/2);
        this.clouds.maxEmitBox =
            new BABYLON.Vector3(area_size/2, 5, area_size/2);

        this.clouds.direction1 = 
            new BABYLON.Vector3(-speed, -0.1, -speed);
        this.clouds.direction2 = 
            new BABYLON.Vector3(speed, 0.1, speed);

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

    addRain(area_size, row_length) { 
        this.rainSystems = [];
        for(var x = 0; x <= area_size; x += area_size / row_length) {
            for(var z = 0; z <= area_size; z += area_size / row_length) {
                var rain = new BABYLON.ParticleSystem("rain", 2);

                rain.particleTexture = 
                    new BABYLON.Texture("/static/assets/rain.png");

                rain.minLifeTime = 0.75;
                rain.maxLifeTime = 0.75;

                rain.emitter = 
                    new BABYLON.Vector3(
                        x - area_size/2,
                        30,
                        z - area_size/2);
                
                rain.direction1 = new BABYLON.Vector3(0, -45, 0);
                rain.direction2 = new BABYLON.Vector3(0, -45, 0);        

                rain.emitRate = 2;

                rain.isBillboardBased = true;
                rain.billboardMode = 2;

                rain.minSize = 70;
                rain.maxSize = 75;
                
                rain.start();

                rain.addColorGradient(0.0, 
                    new BABYLON.Color4(0, 0, 0, 0));
                rain.addColorGradient(0.2, 
                    new BABYLON.Color4(0.5, 0.5, 0.5, 1));
                rain.addColorGradient(0.8, 
                    new BABYLON.Color4(0.5, 0.5, 0.5, 1));
                rain.addColorGradient(1.0,
                    new BABYLON.Color4(0, 0, 0, 0));

                this.rainSystems[this.rainSystems.length] = rain;
            }
        }
    }

    setFog(amount) {

    }
}
