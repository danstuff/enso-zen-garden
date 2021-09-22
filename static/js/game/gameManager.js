const UPDATE_MS = 100;  //10 updates per second
const DRAW_MS = 16;     //1000/16 = 60 draw cycles per second (60 FPS)
const PUT_MS = 10000;  //save the garden to the server every 10s

class GameManager {
    constructor(canvas_id, gid) {
        this.session = new Session(gid);
        this.canvas = document.getElementById(canvas_id);

        this.garden = null;
        this.dialogue = null;

        this.meshList = null;
        this.entityTypeList = null;
    }

    init() {
        //babylon setup: create a scene, camera, and sun
        const scene = new BABYLON.Scene(


        //connect and fetch the meshList, garden,
        //and first dialogue from the server
        this.session.connect(function() {
            this.session.getStaticData(function(m, e) {
                this.meshList = m;
                this.entityTypeList = e;
            });

            this.session.getGarden(function(g) {
                this.garden = g;
            });

            this.session.getDialogue(function(d) {
                this.dialogue = d;
            });            

            //after you're connected, update, save, and draw every X ms
            setInterval(this.update, UPDATE_MS);
            setInterval(this.draw, DRAW_MS);
            setInterval(this.put, PUT_MS);
        });
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

    draw() {
        //canvas must exist in order to draw
        if(canvas == null) { return; }

        //only draw if dialogue/garden are non-null
        if(this.garden != null && this.meshList != null) {
            this.garden.draw(this.canvas, 
                this.entityTypeList,
                this.meshList);
        }

        if(this.dialogue != null) {
            this.dialogue.draw(this.canvas);
        }
    }

    put() {
        //if a garden exists, save it to the server
        if(this.garden != null) {
            this.session.putGarden(this.garden);
        }
    }
}
