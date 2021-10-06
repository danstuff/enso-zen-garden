class Dialogue {
    constructor() {
        this.html = "";
        this.font_size = 10;
        this.time = 60000 //1 minute
    }

    get(env_str) {
        $.get("/dialogue/get/"+env_str)
            .done(function(data) {
                this.html = data.html;
                this.font_size = data.font_size;
                this.time = data.time;

                //get(env_str);
            });
    }
    
    update(update_ms) {
        this.time -= update_ms;
    }

    draw(canvas) {
        //TODO
    }
}
