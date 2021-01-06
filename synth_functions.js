'use strict';


function leftSide() {
    var left = [
        [65, "2C"],
        [69, "2Cs"],
        [73, "2D"],
        [77, "2Ds"],
        [82, "2E"],
        [87, "2F"],
        [92, "2Fs"],
        [97, "2G"],
        [103, "2Gs"],
        [110, "2A"],
        [116, "2As"],
        [123, "2B"],
        [130, "3C"],
        [138, "3Cs"],
        [146, "3D"],
        [155, "3Ds"],
        [164, "3E"],
        [174, "3F"],
        [184, "3Fs"],
        [195, "3G"],
        [207, "3Gs"],
        [220, "3A"],
        [233, "3As"],
        [246, "3B"]
    ];

    var notes = document.getElementById("piano").childNodes;
    // console.log(notes[1].getAttribute('data-freq'));
    for (let i = 0; i < left.length; i++) {
        notes[2 * i + 1].setAttribute('data-freq', left[i][0]);
        notes[2 * i + 1].innerHTML = left[i][1];
    }
}

function centerSide() {
    var center = [
        [261, "4C"],
        [277, "4Cs"],
        [293, "4D"],
        [311, "4Ds"],
        [329, "4E"],
        [349, "4F"],
        [369, "4Fs"],
        [391, "4G"],
        [415, "4Gs"],
        [440, "4A"],
        [466, "4As"],
        [493, "4B"],
        [523, "5C"],
        [554, "5Cs"],
        [587, "5D"],
        [622, "5Ds"],
        [659, "5E"],
        [698, "5F"],
        [739, "5Fs"],
        [783, "5G"],
        [830, "5Gs"],
        [880, "5A"],
        [932, "5As"],
        [987, "5B"]
    ];

    var notes = document.getElementById("piano").childNodes;

    for (let i = 0; i < center.length; i++) {
        notes[2 * i + 1].setAttribute('data-freq', center[i][0]);
        notes[2 * i + 1].innerHTML = center[i][1];
    }
}

function rightSide() {
    var right = [
        [1046, "6C"],
        [1108, "6Cs"],
        [1174, "6D"],
        [1244, "6Ds"],
        [1318, "6E"],
        [1396, "6F"],
        [1479, "6Fs"],
        [1567, "6G"],
        [1661, "6Gs"],
        [1760, "6A"],
        [1864, "6As"],
        [1975, "6B"],
        [2093, "7C"],
        [2217, "7Cs"],
        [2349, "7D"],
        [2489, "7Ds"],
        [2637, "7E"],
        [2793, "7F"],
        [2959, "7Fs"],
        [3135, "7G"],
        [3322, "7Gs"],
        [3520, "7A"],
        [3729, "7As"],
        [3951, "7B"]
    ];

    var notes = document.getElementById("piano").childNodes;

    for (let i = 0; i < right.length; i++) {
        notes[2 * i + 1].setAttribute('data-freq', right[i][0]);
        notes[2 * i + 1].innerHTML = right[i][1];
    }
}

document.addEventListener("DOMContentLoaded", function() {

    const audioContext = new(window.AudioContext || window.webkitAudioContext)();

    //Master Volume
    const volume = audioContext.createGain();

    const volumeControl = document.querySelector('#volume');
    volumeControl.addEventListener('input', function() {
        volume.gain.value = this.value;
    }, false);

    //Panner
    const panner = audioContext.createStereoPanner();

    const pannerControl = document.querySelector('#panner');
    pannerControl.addEventListener('input', function() {
        panner.pan.value = this.value;
    }, false);


    //VCF Volume
    const vcf = audioContext.createBiquadFilter();
    vcf.type = "highpass";
    const vcfVolume = document.querySelector('#vcf');
    vcf.gain.value = 0;
    vcfVolume.addEventListener('input', function() {
        vcf.gain.value = this.value;
    }, false);

    //VCF Frequency
    const vcfFreq = document.querySelector('#vcf-freq');
    vcf.frequency.value = 60;
    vcfFreq.addEventListener('input', function() {
        vcf.frequency.value = this.value;
    }, false);

    //VCF Q
    const vcfQ = document.querySelector('#vcf-q');
    vcf.Q.value = 10;
    vcfQ.addEventListener('input', function() {
        vcf.Q.value = this.value;
    }, false);

    //Oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(0, audioContext.currentTime);
    oscillator.start(0);

    //LFO
    const lfo = audioContext.createOscillator();
    lfo.frequency.setValueAtTime(0, audioContext.currentTime);
    lfo.start(0);

    //Tremolo
    const tremolo = audioContext.createGain();
    const tremoloElement = document.querySelector('#tremolo');
    tremolo.gain.value = 0;
    tremoloElement.addEventListener('input', function() {
        tremolo.gain.value = this.value;
    }, false);

    //Vibrato
    const vibrato = audioContext.createGain();
    const vibratoElement = document.querySelector('#vibrato');
    vibrato.gain.value = 0;
    vibratoElement.addEventListener('input', function() {       
        vibrato.gain.value = this.value;
    }, false);

    //Waveforms of main Oscillator and LFO
    var waveform = ["sine", "sine"];
    var waveSelector = ['input[name="osc-radio"]', 'input[name="lfo-radio"]'];
    for (let i = 0; i < 2; i++) {
        document.querySelectorAll(waveSelector[i]).forEach((radioButton) => {
            radioButton.addEventListener("change", function(event) {
                waveform[i] = event.target.value;
                console.log(waveform[i]);
            });
        });
    }

    //Detune of main Oscillator and Frequency of LFO
    var detune_lfoFreq_values = [100, 5];
    var detune_lfoFreq_selector = ['#det-freq', '#lfo-freq'];
    for (let i = 0; i < 2; i++) {
        document.querySelector(detune_lfoFreq_selector[i]).addEventListener("input", function(event) {
            detune_lfoFreq_values[i] = event.target.value;
            console.log(detune_lfoFreq_values[i]);
        });
    }

    //ADSR Envelope    
    var adsr_values = [
        [1.5, 0, 0.5],  // [[attackValue, attackStartTime, attackEndTime],
        [0.5, 0.3, 1],  // [decayValue, decayStartTime, decayEndTime], 
        [0, 1, 1.5]     // [releaseValue, releaseStartTime, releaseEndTime]]
    ];
    var adsrSelector = [
        ['#attack', '#attack-start', '#attack-end'],
        ['#decay', '#decay-start', '#decay-end'],
        ['#release', '#release-start', '#release-end']
    ];
    const adsrCtx = audioContext.createGain();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.querySelector(adsrSelector[i][j]).addEventListener("input", function(event) {
                adsr_values[i][j] = event.target.value;
            });
        }
    }

    //Notes
    hitKey('#n4C');
    hitKey('#n4Cs');
    hitKey('#n4D');
    hitKey('#n4Ds');
    hitKey('#n4E');
    hitKey('#n4F');
    hitKey('#n4Fs');
    hitKey('#n4G');
    hitKey('#n4Gs');
    hitKey('#n4A');
    hitKey('#n4As');
    hitKey('#n4B');
    hitKey('#n5C');
    hitKey('#n5Cs');
    hitKey('#n5D');
    hitKey('#n5Ds');
    hitKey('#n5E');
    hitKey('#n5F');
    hitKey('#n5Fs');
    hitKey('#n5G');
    hitKey('#n5Gs');
    hitKey('#n5A');
    hitKey('#n5As');
    hitKey('#n5B');

    function hitKey(note_name) {
        const note = document.querySelector(note_name);
        //Things to do when user clicks at key
        note.addEventListener('mousedown', function() {
            var freq = note.getAttribute('data-freq');
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.detune.value = detune_lfoFreq_values[0];
            oscillator.type = waveform[0];

            //attack phase (ADSR)
            adsrCtx.gain.setTargetAtTime(parseInt(adsr_values[0][0]), audioContext.currentTime + parseInt(adsr_values[0][1]), parseInt(adsr_values[0][2]));

            lfo.type = waveform[1];
            lfo.frequency.setValueAtTime(detune_lfoFreq_values[1], audioContext.currentTime);
        }, false);

        //Things to do when user stop clicking at key
        note.addEventListener('mouseup', function() {
            //decay phase (ADSR)
            adsrCtx.gain.setTargetAtTime(parseInt(adsr_values[1][0]), audioContext.currentTime + parseInt(adsr_values[1][1]), parseInt(adsr_values[1][2]));
            //release phase (ADSR)
            adsrCtx.gain.setTargetAtTime(parseInt(adsr_values[2][0]), audioContext.currentTime + parseInt(adsr_values[2][1]), parseInt(adsr_values[2][2]));

        }, false);
    }

    /* Cheatsheet of Web Audio Inspector (Firefox plugin) component numbering
    oscillator = Oscillator 12
    lfo= oscillator 15
    adsr= gain 22
    volume = gain 3
    tremolo = gain 18
    vibrato = gain 20
    */

    var shaper = audioContext.createWaveShaper();
    shaper.curve = new Float32Array([0, 1]);

    //Connect all components
    lfo.connect(vibrato);
    lfo.connect(shaper);
    shaper.connect(tremolo.gain);
    tremolo.connect(vcf);
    oscillator.connect(tremolo);
    vibrato.connect(oscillator.detune);
    oscillator.connect(vcf);
    vcf.connect(adsrCtx);
    adsrCtx.connect(volume).connect(panner).connect(audioContext.destination);
});