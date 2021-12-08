const dialogueID = "main_dialogue";

class Dialogue {

    constructor() {
        $("#"+dialogueID).fadeIn();
    }

    update(weatherData) {
        //filter the dialogues by the given weather tags
        var fDialogues = Dialogues.filter(function(d) {
            return d.tag == weatherData.main ||
                d.tag == weatherData.day_phase_str;
        });
        
        if(fDialogues.length <= 0) return;

        var d = fDialogues[
            Math.floor(Math.random()*fDialogues.length)
        ];

        //fade the dialogue out, replace it, and fade in
        $("#"+dialogueID).fadeOut(function() {
            $("#"+dialogueID).html(d.html);
            window.setTimeout(function() {
                $("#"+dialogueID).fadeIn();
            }, 1000);
        }); 
    }
}
