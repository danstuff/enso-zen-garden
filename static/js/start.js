$(document).ready(function() {
    $("#main_canvas").fadeIn();

    var game = new Game("main_canvas");
    game.init();
});
