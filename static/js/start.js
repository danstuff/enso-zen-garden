const CANVAS_ID = "main_canvas";

$(document).ready(function() {
    $("#"+CANVAS_ID).fadeIn();

    var game = new Game(CANVAS_ID);
    game.init();
});
