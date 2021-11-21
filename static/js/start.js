const CANVAS_ID = "main_canvas";

$(document).ready(function() {
    var game = new Game(CANVAS_ID);
    game.init(function() {
        window.setTimeout(function() {
            $(".fadeIn").animate({
                opacity: 1
            }, 1000);
        }, 1500);
    });
});
