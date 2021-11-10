const NOISE_GAIN = 0.03;    //how loud the noise is at maximum
const NOISE_TWEEN = 0.05;   //how quickly noise strength transitions
const NOISE_FLOOR = 0.5;    //minimum volume for noise
const NOISE_CURVE = 1.05;   //closer to 1 = flatter curve

//create an audio context
const AudioContext = window.AudioContext || window.webkitAudioContext;

//flag for if audio should be played
var input_done = false;

class SoundManager {
    constructor() {
        this.noise_strength = 0;
        this.noise_strength_target = 0;

        $("#"+CANVAS_ID).mousemove(function() {
            input_done = true;
        });
    }

    awaitInput(callback) {
        //wait for user to put in some input before playing
        if(!input_done) {
            setTimeout(callback, 100);
            return true;
        };

        return false;
    }

    setNoiseStrength(amount) {
        // strength is a gently sloping negative power of wind speed
        var exp = -(amount + NOISE_FLOOR);
        this.noise_strength = 
            (1 - Math.pow(NOISE_CURVE, exp)) * NOISE_GAIN;
    }

    playNoise() {
        this.stopNoise();
        this.audioContext = new AudioContext();

        //wait for user to put in some input before playing
        const audio = this;
        if(this.awaitInput(function() { audio.playNoise(); })) 
            return;

        //this is a slightly modified version of:
        //https://noisehack.com/generate-noise-web-audio-api/
        var bufferSize = 4096;
        var brownNoise = (function() {
            var lastOut = 0.0;
            var node = 
                audio.audioContext.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    var white = Math.random() * 2 - 1;
                    output[i] = 
                        (lastOut + (audio.noise_strength * white)) / 1.02;
                    lastOut = output[i];
                }
            }
            return node;
        })();

        brownNoise.connect(this.audioContext.destination);
    }

    stopNoise() {
        if(this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    addSound(sound_file, loop) {
        var sound = new Audio("/static/assets/sounds/"+sound_file+".ogg");
        sound.loop = loop;

        return sound;
    }

    playSound(sound) {
        //wait for user to put in some input before playing
        const audio = this;
        if(this.awaitInput(function() { audio.playSound(sound); }))
            return;

        sound.currentTime = 0;
        sound.play();
    }  

    stopSound(sound) {
        if(sound.paused) return;
        sound.pause();
        sound.currentTime = 0;
    }
}
