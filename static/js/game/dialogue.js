class Dialogue {
    constructor() {
        text = "";
        options = [];
        font_size = 10;
        time = 60000 //1 minute
    }

    update(update_ms) {
        time -= update_ms;
    }

    draw(canvas) {
        //TODO
    }
}
