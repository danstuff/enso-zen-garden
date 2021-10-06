const AUDIO_FADE_IN_TIME = 100000;
const AUDIO_GAIN = 0.03;

const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var audio_time = 0;

var noise_strength = 0;
var noise_strength_target = 0;

class Audio {
    constructor() {
    }

    setWindSpeed(wind_speed) {
        // strength is a gently sloping negative power of wind speed
        noise_strength_target = 
            (1 - Math.pow(1.05, -(wind_speed + 0.1))) * AUDIO_GAIN;
    }

    tweenStrength() {
        if(Math.abs(noise_strength_target - noise_strength) < 0.000001) {
            return;
        }

        //gradually move audio strength towards the new value
        noise_strength += (noise_strength_target - noise_strength)*0.01;
    }

    playNoise() {
        // https://noisehack.com/generate-noise-web-audio-api/
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

                    output[i] *= (audio_time / AUDIO_FADE_IN_TIME);

                    if (audio_time < AUDIO_FADE_IN_TIME) {
                        audio_time++; 
                    }   
                }
            }
            return node;
        })();

        brownNoise.connect(audioContext.destination);
    }
}
