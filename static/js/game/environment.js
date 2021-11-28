const TEXTURE_FILE_RAIN = "/static/assets/textures/rain.png";
const TEXTURE_FILE_SNOW = "/static/assets/textures/snow.png";
const TEXTURE_FILE_STARS = "/static/assets/textures/stars.png";

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
                                var data_fmt = 
                                    env.formatWeatherData(data);
                                var dialogue=JSON.stringify(data_fmt)
                                console.log(dialogue)
                                localStorage.setItem("dialogue",dialogue);
                                console.log("Got weather data:");
                                console.log(data_fmt);
                                env.processWeatherData(data_fmt);
                            });
                    });
            });
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
            if(day_pct > 0.90) day_phase_str = "night";

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
                switch(data.description) {
                    case "few clouds: 11-25%":
                        cloud_amount = 1;
                        break;
                    case "scattered clouds: 25-50%":
                        cloud_amount = 3;
                        break;
                    case "broken clouds: 51-84%":
                        cloud_amount = 4;
                        break;
                    case "overcast clouds: 85-100%":
                        cloud_amount = 6;
                        break;
                }
                break;

            case "drizzle":
                this.soundMan.playSound(this.rain_sound);
                this.vfx.addPrecipitation(15, TEXTURE_FILE_RAIN);
                cloud_amount = 2;
                break;

            case "rain":
                this.soundMan.playSound(this.rain_sound);
                this.vfx.addPrecipitation(20, TEXTURE_FILE_RAIN);
                cloud_amount = 4;
                break;

            case "thunderstorm":
                this.soundMan.playSound(this.rain_sound);
                this.soundMan.playSound(this.thunder_sound);
                this.vfx.addPrecipitation(25, TEXTURE_FILE_RAIN);
                cloud_amount = 6;
                break;

            case "snow":
                this.vfx.addPrecipitation(25, TEXTURE_FILE_SNOW);
                cloud_amount = 4;
                break;
        }

        this.soundMan.setNoiseStrength(data.wind_speed/10);
        this.soundMan.playNoise();

        this.vfx.addClouds(cloud_amount, data.wind_speed / 2);
        this.vfx.setFog(cloud_amount);

        //ask server for dialogue
        this.dialogue.request(data);
    }

    nextDemo() {
        var take_next = false;
        for(var i in DEMO_CONDITIONS) {
            if(i == this.currentDemo) {
                take_next = true;
            } else if(take_next) {
                this.currentDemo = i;
                take_next = false;
                break;
            }
        }

        if(take_next || !this.currentDemo) {
            this.currentDemo = "rainy-morning";
        }

        this.processWeatherData(DEMO_CONDITIONS[this.currentDemo]);

        console.log("Changed demo to " + this.currentDemo);
    }
}
