const UPDATE_MS = 100; //10 updates per second
const DRAW_MS = 17; //60 draw cycles per second (60 FPS)

class GameManager {
    constructor(canvas_id, sid) {
        this.session = Session(sid);
        this.garden = Garden();
        this.dialogue = null;
        this.canvas = $("#"+canvas_id);
    }

    function init() {
        //fetch the first entity and dialogue from the server
        this.session.getEntity(function(Entity e) {
            this.garden.put(e);
        });

        this.session.getDialogue(function(Dialogue d) {
            this.dialogue = d;
        });
            
        //update and draw every X ms
        setInterval(this.update, UPDATE_MS);
        setInterval(this.draw, DRAW_MS);
    }

    function update() {
        this.garden.update(UPDATE_MS);

        //only update/draw if dialogue is non-null
        if(this.dialogue != null) {
            this.dialogue.update(UPDATE_MS);
            this.dialogue.draw(this.canvas);

            //destroy dialogue if it ran out of time
            if(this.dialogue.time <= 0) {
                this.dialogue = null;
            }
        }
    }

    function draw() {
        this.garden.draw(this.canvas);

        //only update/draw if dialogue is non-null
        if(this.dialogue != null) {
            this.dialogue.draw(this.canvas);
        }
    }
}
