const dialogueID = "main_dialogue";

class Dialogue {

    constructor() {
        $("#"+dialogueID).fadeIn();
    }

    update(weatherData) {
        //filter the dialogues by the given weather tags
        var fDialogues = Dialogues.filter(function(d) {
            
            if(typeof(d.tags) !== "string") {
                console.log(
                    "[WARN] Tags are invalid or undefined. Ignoring: ");
                console.log(d);
                return false;
            }

            var terms = d.tags.split(" ");
            var total_state;
            var current_state;
            var orMode = false;

            for(var i in terms) {
                var t = terms[i].trim().toLowerCase();

                var current_state =
                    (weatherData.main === t ||
                     weatherData.day_phase_str === t);

                if(t === "or")
                    orMode = true;
                else if(t === "and")
                    orMode = false;
                else if(typeof(total_state) != "boolean")
                    total_state = current_state;
                else if(orMode)
                    total_state = total_state || current_state;
                else
                    total_state = total_state && current_state;
            }

            return total_state;
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
