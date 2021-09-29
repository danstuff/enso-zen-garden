class Session {
    constructor(gid) {
        this.gid = gid;
    }

    connect(callbackFun) {
        //TODO
    }

    getStaticData(callbackFun) {
        $.get("/static/data/"+gid, callbackFun);
    }

    getGarden(callbackFun) {
        $.get("/garden/data/"+gid, callbackFun); 
    }

    getDialogue(callbackFun) {
        $.get("/dialogue/data/"+gid, callbackFun);
    }

    putGarden(g) {
        $.put("/garden/data/"+gid, g);//Dan review this please
    }

    postDialogueResponse(r) {
        $.post("/dialogue/data/"+gid, r);
    }
}
