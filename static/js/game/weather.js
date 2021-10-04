class Session {
    constructor(gid) {
        this.gid = gid;
    }

    connect(callbackFun) {
        //TODO
    }

    getStaticData(callbackFun) {
        //TODO
    }

    getGarden(callbackFun) {
        $.get("/garden/data/"+gid, callbackFun); 
    }

    getDialogue(callbackFun) {
        //TODO
    }

    putGarden(g) {
        //TODO
    }

    postDialogueResponse(r) {
        //TODO
    }
}
