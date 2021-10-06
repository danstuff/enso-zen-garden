class Environment {
    constructor(_city) {
        this.city = _city;
    }

    connect() {
        //start by fetching an approximate location
        $.getJSON("https://geolocation-db.com/json/")
            .done(function(location) {
                console.log("Found aprox. location: " + location.city);

                //fetch semi-secure data from the server
                $.getJSON("/data/secure/")
                    .done(function(secure) {
                        $.getJSON("api.openweathermap.org/" + 
                            "data/2.5/weather?q=" + location.city +
                            "&appid=" + secure.openWeather)
                            .done(function(data) {
                                console.log(data)
                            });
                    });

                
            });
    }
}
