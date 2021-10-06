const AUDIO_FADE_IN_TIME = 100000;

const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

var audio_time = 0;

class Audio {
    constructor() {
    }

    playNoise(wind_speed) {
        // https://noisehack.com/generate-noise-web-audio-api/
        var bufferSize = 4096;
        var brownNoise = (function() {
            var strength = (wind_speed+0.1)*0.05;
            var lastOut = 0.0;

            var node = audioContext.createScriptProcessor(bufferSize, 1, 1);

            node.onaudioprocess = function(e) {
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    var white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (strength * white)) / 1.02;
                    lastOut = output[i];

                    output[i] *= 0.1 * (audio_time / AUDIO_FADE_IN_TIME);

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
