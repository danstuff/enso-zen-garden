const dialogueID = "main_dialogue";

class Dialogue {

    constructor() {
        $("#"+dialogueID).fadeIn();
    }

    request(env_data) {
        $("#"+dialogueID).fadeOut(function() {
                    
                    $("#"+dialogueID).html(localStorage.getItem("dialogue"));
                    window.setTimeout(function() {
                        $("#"+dialogueID).fadeIn();
                    }, 1000);
                }); 
    }
}
