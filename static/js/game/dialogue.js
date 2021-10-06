const DIALOGUE_ID = "main_dialogue";

class Dialogue {
    constructor() {
        $("#"+DIALOGUE_ID).fadeIn();
    }

    request(env_data) {
        //fetch dialogue from the server
        $.post("/environment/post/", env_data)
            .done(function(dialogue_str) {

                //fade the dialogue out, replace it, and fade in
                $("#"+DIALOGUE_ID).fadeOut(function() {
                    $("#"+DIALOGUE_ID).html(dialogue_str);
                    $("#"+DIALOGUE_ID).fadeIn();
                }); 
            });
    }
}
