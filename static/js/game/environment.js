const TEXTURE_FILE_RAIN = "/static/assets/rain.png";
const TEXTURE_FILE_SNOW = "/static/assets/snow.png";
const TEXTURE_FILE_STARS = "/static/assets/stars.png";

class Environment {
    constructor(babInt) {
        this.dialogue = new Dialogue();
        this.audio = new Audio();
        this.vfx = new VisualFX(babInt);
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

        var day_period = sunset_time - sunrise_time;
        var day_pct = (current_time - sunrise_time) / day_period;

        //set sun based on day percent
        this.vfx.setSunPercent(day_pct);
        this.vfx.setFog(data.visibility/2);

        //add clouds and rain/snow based on weather data
        if(data.clouds)
            this.vfx.addClouds(
                data.clouds.all*2000, data.wind.speed / 2);
        if(data.rain) 
            this.vfx.addPrecipitation(
                data.rain["1h"] / 10, TEXTURE_FILE_RAIN);
        if(data.snow)
            this.vfx.addPrecipitation(
                data.snow["1h"] / 10, TEXTURE_FILE_SNOW);

        //set audio strength based on rain amount
        if(data.rain) {
            this.audio.playNoise();
            this.audio.setNoiseStrength(data.rain["1h"] / 10);
        }

        var time_phase_str = "";
        if(day_pct > 0.00) time_phase_str = "dawn";
        if(day_pct > 0.10) time_phase_str = "morning";
        if(day_pct > 0.25) time_phase_str = "day";
        if(day_pct > 0.75) time_phase_str = "evening";
        if(day_pct > 0.90) time_phase_str = "night";

        //ask server for dialogue
        this.dialogue.request({ 
            "weather" : data.weather.main,
            "time" : time_phase_str
        });
    }
}
