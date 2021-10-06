const DIALOGUE_ALIVE_TIME = 60000; // 1 minute
const DIALOGUE_ID = "main_dialogue";

class Dialogue {
    constructor() {
        $("#"+DIALOGUE_ID).fadeIn();
    }

    get(env_str) {
        //fetch dialogue from the server
        $.get("/dialogue/get/"+env_str)
            .done(function(data) {

                //fade the dialogue out, replace it, and fade in
                $("#"+DIALOGUE_ID).fadeOut(function() {
                    $("#"+DIALOGUE_ID).html(data);
                    $("#"+DIALOGUE_ID).fadeIn();
                }); 
            });
    }
}
