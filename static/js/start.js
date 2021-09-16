document.addEventListener("DOMContentLoaded", function(e) {
    var pathArray = window.location.pathname.split("/");
    
    //-1 indicates that there is no session ID.
    //this will make the gameManager display the title page
    var sid = -1;

    //grab the 3rd term from the url path, should be the session ID
    //(unless you're on the index page)
    if(pathArray.length >= 3) {
        sid = pathArray[2];
    }

    var gmanager = new GameManager("main_canvas", sid);
    gmanager.init();
});
