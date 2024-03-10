const TEXTURE_FILE_RAIN = AssetPath("textures/rain.png");
const TEXTURE_FILE_SNOW = AssetPath("textures/snow.png");
const TEXTURE_FILE_STARS = AssetPath("textures/stars.png");

const DEMO_CONDITIONS = {
    "rainy-morning" : {
        main : "drizzle",
        description : "",
        wind_speed : 10,
        day_pct : 0.05,
        day_phase_str : "morning"
    },

    "clear-sunset" : {
        main : "clear",
        description : "",
        wind_speed : 10,
        day_pct : 0.99,
        day_phase_str : "evening"
    },

    "snowy-day" : {
        main : "snow",
        description : "",
        wind_speed : 10,
        day_pct : 0.5,
        day_phase_str : "day"

    },

    "cloudy-night" : {
        main : "clouds",
        description : "overcast clouds: 85-100%",
        wind_speed : 10,
        day_pct : 1.5,
        day_phase_str : "night"

    },

    "stormy-night" : {
        main : "thunderstorm",
        description : "",
        wind_speed : 20,
        day_pct : 1.5,
        day_phase_str : "night"

    }
}

class Environment {
    constructor(babInt) {
        this.dialogue = new Dialogue();
        this.soundMan = new SoundManager();
        this.vfx = new VisualFX(babInt);

        this.thunder_sound = this.soundMan.addSound("thunder");
        this.rain_sound = this.soundMan.addSound("rain");
    }

    getWeatherData(cbFun) {
        if (DISABLE_REALTIME_WEATHER) {
            this.processWeatherData(this.approximateWeatherData());
            cbFun(true);
        } else {
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
                                    var data_fmt = 
                                        env.formatWeatherData(data);

                                    console.log("Got weather data:");
                                    console.log(data_fmt);

                                    env.processWeatherData(data_fmt);

                                    cbFun(true);
                                })
                                .fail(function() {
                                    console.log("Failed to get weather data, defaulting to demo.");
                                    cbFun(false);
                                });
                        })
                        .fail(function() {
                            console.log("Failed to get API key, defaulting to demo.");
                            cbFun(false);
                        });
                })
                .fail(function() {
                    console.log("Failed to get location data, defaulting to demo.");
                    cbFun(false);
                });
        }
    }

    formatWeatherData(data) {
        var data_fmt = {
            main : "",
            description : "",
            wind_speed : 0,
            day_pct : 0,
            day_phase_str : ""
        }

        if(data.weather.length > 0) {
            data_fmt.main = data.weather[0].main.toLowerCase();
            data_fmt.description = data.weather[0].description.toLowerCase();
        }

        if(data.wind) {
            data_fmt.wind_speed = data.wind.speed;
        }

        if(data.sys) {
            var day_period = data.sys.sunset - data.sys.sunrise;
            var day_pct = (data.dt - data.sys.sunrise) / day_period;

            data_fmt.day_pct = day_pct;
            
            var day_phase_str = "";
            if(day_pct > 0.00) day_phase_str = "dawn";
            if(day_pct > 0.10) day_phase_str = "morning";
            if(day_pct > 0.25) day_phase_str = "day";
            if(day_pct > 0.75) day_phase_str = "evening";
            if(day_pct > 0.99) day_phase_str = "night";

            data_fmt.day_phase_str = day_phase_str;
        }

        return data_fmt;
    }

    processWeatherData(data) {
        //disable any previous conditions
        this.vfx.stopFX();

        this.soundMan.stopSound(this.thunder_sound);
        this.soundMan.stopSound(this.rain_sound);

        //set sun based on day percent
        this.vfx.setSunPercent(data.day_pct);

        var cloud_amount = 0;

        //add clouds and rain/snow based on weather data
        switch(data.main) {
            case "clouds":
                var worda = data.description.split(" ")[0];
                switch(worda) {
                    case "few":
                        cloud_amount = 1;
                        break;
                    case "scattered":
                        cloud_amount = 3;
                        break;
                    case "broken":
                        cloud_amount = 4;
                        break;
                    case "overcast":
                        cloud_amount = 6;
                        break;
                }
                break;

            case "drizzle":
                this.soundMan.playSound(this.rain_sound);
                this.vfx.addPrecipitation(15, 20, TEXTURE_FILE_RAIN);
                cloud_amount = 2;
                break;

            case "rain":
                this.soundMan.playSound(this.rain_sound);
                this.vfx.addPrecipitation(20, 20, TEXTURE_FILE_RAIN);
                cloud_amount = 4;
                break;

            case "thunderstorm":
                this.soundMan.playSound(this.rain_sound);
                this.soundMan.playSound(this.thunder_sound);
                this.vfx.addPrecipitation(25, 25, TEXTURE_FILE_RAIN);
                cloud_amount = 6;
                break;

            case "snow":
                this.vfx.addPrecipitation(25, 10, TEXTURE_FILE_SNOW);
                cloud_amount = 4;
                break;
        }

        this.soundMan.setNoiseStrength(data.wind_speed/100);
        this.soundMan.playNoise();

        this.vfx.addClouds(cloud_amount, data.wind_speed / 2);
        this.vfx.setFog(cloud_amount);

        //ask server for dialogue
        this.dialogue.update(data);
    }

    randomFrom(array, seed)
    {
        return array[Math.floor(Math.random()*array.length)];
    }

    randomDemo() {
        var c = DEMO_CONDITIONS[Math.floor(Math.random()*DEMO_CONDITIONS.length)];
        console.log(c);
        this.processWeatherData(c);

        console.log("Changed demo to " + c);
    }

    approximateWeatherData() {
        var data = {
            main : "",
            description : "",
            wind_speed : 0,
            day_pct : 0,
            day_phase_str : ""
        }

        const SUNRISE = 7;
        const SUNSET = 19;

        var today = new Date();
        data.day_pct = (today.getHours() - SUNRISE) / (SUNSET-SUNRISE);

        if(data.day_pct < 0.00)  data.day_phase_str = "night";
        if(data.day_pct > 0.00) data.day_phase_str = "dawn";
        if(data.day_pct > 0.10) data.day_phase_str = "morning";
        if(data.day_pct > 0.25) data.day_phase_str = "day";
        if(data.day_pct > 0.75) data.day_phase_str = "evening";
        if(data.day_pct > 0.99) data.day_phase_str = "night";
    
        const warm_weathers = [ "clear", "clear", "clouds", "drizzle", "rain", "thunderstorm" ];
        const cold_weathers = [ "clear", "clear", "clouds", "clouds", "drizzle", "snow" ];
        const cloud_options = [ "few", "scattered", "broken", "overcast" ];

        var is_warm = today.getMonth() > 2 && today.getMonth() < 9;
        data.main = is_warm ? this.randomFrom(warm_weathers) : this.randomFrom(cold_weathers);
        if (data.main == "clouds")
        {
            data.description = this.randomFrom(cloud_options);
        }
        data.wind_speed = Math.round(Math.random()*20);

        console.log("Approximated weather data:");
        console.log(data);

        return data;
    }
}
