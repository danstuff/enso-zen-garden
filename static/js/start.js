$(document).ready(function() {
    var pathArray = window.location.pathname.split("/");
    
    //-1 indicates that there is no session ID.
    //this will make the gameManager display the title page
    var gid = -1;

    //grab the 3rd term from the url path, should be the session ID
    //(unless you're on the index page)
    if(pathArray.length >= 3) {
        gid = pathArray[2];
    }

    var gmanager = new GameManager("main_canvas", gid);
    gmanager.init();
});
