const UPDATE_MS = 100;  //10 updates per second

class GameManager {
    constructor(canvas_id) {
        this.session = new Session();
        this.canvas = document.getElementById(canvas_id);

        this.garden = new Garden();
        this.dialogue = null;

        this.staticData = {};

        this.babInterface = new BabylonInterface(this.canvas);
    }

    init() {
        //babylon setup: create a scene, camera, and sun
        this.babScene = this.babInterface.createScene(this.canvas);
        this.babInterface.startRendering();

        //connect and fetch the meshList, garden,
        //and first dialogue from the server
        this.session.getStaticData(function(s) {
            this.staticData = s;
        });

        this.session.getDialogue(function(d) {
            this.dialogue = d;
        });            

        setInterval(this.update, UPDATE_MS);
    }

    update() {
        //only update if dialogue/garden are non-null
        if(this.garden != null) {
            this.garden.update(UPDATE_MS);
        }

        if(this.dialogue != null) {
            this.dialogue.update(UPDATE_MS);

            //destroy dialogue if it ran out of time
            if(this.dialogue.time <= 0) {
                this.dialogue = null;
            }
        }
    }
}
