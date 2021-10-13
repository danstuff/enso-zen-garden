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
}
