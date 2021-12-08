const UNLOCK_FALLOFF = 0.75;
const UNLOCK_SCALE = 0.012;

class Unlocks {
    constructor() {
        this.rocks = 0;
        this.plants = 0;
        this.rakes = 0;
    }

    init() {
        // load unlockTicks from storage or default to 0
        return this.setUnlockTicks(Number(localStorage.unlockTicks) || 0, false);
    }

    setUnlockCircle(level, ticks) {
        var tck = function(l) {
            return Math.pow(l/UNLOCK_SCALE,
                1/UNLOCK_FALLOFF);
        }

        //calculate # of ticks until next level
        var ticks_in_level = tck(level+1) - tck(level); 
        var tick_delta = ticks - tck(level);

        //calculate % of progress into level
        var progress_pct = tick_delta / ticks_in_level;

        //calculate circumference and offset
        var circ = 20 * Math.PI;
        var circ_str = circ.toString();
        var ofs_str = circ - progress_pct*circ;
        
        $("#main_level_progress").css("strokeDasharray",
            circ_str + " " + circ_str);
        $("#main_level_progress").css("strokeDashoffset", ofs_str);
    }

    setUnlockTicks(ticks, notify = true) {

        //some utility functions
        var lvl = function(t) {
            return UNLOCK_SCALE*
                Math.pow(t, UNLOCK_FALLOFF);
        };

        var inc = function(c, t) {
            return (c < t.length-1) ? c+1 : t.length-1;
        };

        var flr = Math.floor;

        //calculate current and old level
        var level = lvl(ticks);
        var old_level = lvl(this.unlockTicks);

        //update the unlock circle
        this.setUnlockCircle(flr(level), ticks);

        //actually update unlock ticks
        this.unlockTicks = ticks;
        
        var ul = { level : flr(level), name : null, 
            n : flr(old_level) != flr(level) };

        if(!ul.n) return ul;

        //recount the unlocks
        var newRocks = 0;
        var newPlants = 0;
        var newRakes = 0;

        for(var i = 1; i <= level; i++) {
            switch(i % 3) {
                case 0: newRocks = inc(newRocks, RockTypes); break;
                case 1: newPlants = inc(newPlants, PlantTypes); break;
                case 2: newRakes = inc(newRakes, RakeTypes); break;
            }
        }
       
        if(newRocks > this.rocks) {
            this.rocks = newRocks;
            ul.name = RockTypes[this.rocks].name;
        } 

        if(newPlants > this.plants) {
            this.plants = newPlants;
            ul.name = PlantTypes[this.plants].name;

        }

        if(newRakes > this.rakes) {
            this.rakes = newRakes;
            ul.name = "the " + RakeTypes[this.rakes].name;
        }

        return ul;
    }

    incrementUnlockTicks() {
        //increment and save unlock ticks
        localStorage.unlockTicks = this.unlockTicks+1;
        return this.setUnlockTicks(this.unlockTicks+1, true);
    }
}
