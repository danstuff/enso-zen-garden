const NOISE_GAIN = 0.03;    //how loud the noise is at maximum
const NOISE_TWEEN = 0.01;   //how quickly noise strength transitions
const NOISE_FLOOR = 0.5;    //minimum volume for noise
const NOISE_CURVE = 1.05;   //closer to 1 = flatter curve

//create an audio context
const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

//define noise strength
var noise_strength = 0;
var noise_strength_target = 0;

class Audio {
    constructor() {
    }

    setNoiseStrength(amount) {
        // strength is a gently sloping negative power of wind speed
        var exp = -(amount + NOISE_FLOOR);
        noise_strength_target = 
            (1 - Math.pow(NOISE_CURVE, exp)) * NOISE_GAIN;
    }

    tweenStrength() {
        //gradually move audio strength towards the new value
        noise_strength += 
            (noise_strength_target - noise_strength)*NOISE_TWEEN;
    }

    playNoise() {
        //this is a slightly modified version of:
        //https://noisehack.com/generate-noise-web-audio-api/
        var bufferSize = 4096;
        var brownNoise = (function() {
            var lastOut = 0.0;
            var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    var white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (noise_strength * white)) / 1.02;
                    lastOut = output[i];
                }
            }
            return node;
        })();

        brownNoise.connect(audioContext.destination);

        const audio = this;
        window.setInterval(function() {
            audio.tweenStrength();
        }, UPDATE_MS);
    }

    stopNoise() {
        audioContext.close();
    }
}
