'use strict';


function leftSide() {
    var left = [65, 69, 73, 77, 82, 87, 92, 97, 103, 110, 116, 123, 130, 138, 146, 155, 164, 174, 184, 195, 207, 220, 233, 246];
    var notes = document.getElementById("piano").childNodes;

    for (let i = 0; i < left.length; i++) {
        notes[2 * i + 1].setAttribute('data-freq', left[i]);
    }
}

function centerSide() {
    var center = [261, 277, 293, 311, 329, 349, 369, 391, 415, 440, 466, 493, 523, 554, 587, 622, 659, 698, 739, 783, 830, 880, 932, 987];
    var notes = document.getElementById("piano").childNodes;

    for (let i = 0; i < center.length; i++) {
        notes[2 * i + 1].setAttribute('data-freq', center[i]);

    }
}

function rightSide() {
    var right = [1046, 1108, 1174, 1244, 1318, 1396, 1479, 1567, 1661, 1760, 1864, 1975, 2093, 2217, 2349, 2489, 2637, 2793, 2959, 3135, 3322, 3520, 3729, 3951];
    var notes = document.getElementById("piano").childNodes;

    for (let i = 0; i < right.length; i++) {
        notes[2 * i + 1].setAttribute('data-freq', right[i]);
    }
}



document.addEventListener("DOMContentLoaded", function() {

    const audioContext = new(window.AudioContext || window.webkitAudioContext)();

    //Master Volume
    const volume = audioContext.createGain();

    const volumeControl = document.querySelector('#volume');
    const volumeValue = document.getElementById('volume-value');
    volumeValue.innerHTML = parseInt(volumeControl.value * 100) + "%";
    volumeControl.addEventListener('input', function() {
        volume.gain.value = this.value;
        volumeValue.innerHTML = parseInt(this.value * 100) + "%";
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
    const vcfValue = document.getElementById('vcf-value');
    vcf.gain.value = vcfVolume.value;
    vcfValue.innerHTML = vcfVolume.value + " dB";
    vcfVolume.addEventListener('input', function() {
        vcf.gain.value = this.value;
        vcfValue.innerHTML = this.value + " dB";
    }, false);

    //VCF Frequency
    const vcfFreq = document.querySelector('#vcf-freq');
    const vcfFreqValue = document.getElementById('vcf-freq-value');
    vcf.frequency.value = vcfFreq.value;
    vcfFreqValue.innerHTML = vcfFreq.value + "Hz";
    vcfFreq.addEventListener('input', function() {
        vcf.frequency.value = this.value;
        vcfFreqValue.innerHTML = this.value + " Hz";
    }, false);

    //VCF Q
    const vcfQ = document.querySelector('#vcf-q');
    const vcfQValue = document.getElementById("vcf-q-value");
    vcf.Q.value = vcfQ.value;
    vcfQValue.innerHTML = vcfQ.value;
    vcfQ.addEventListener('input', function() {
        vcf.Q.value = this.value;
        vcfQValue.innerHTML = this.value;
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
    const tremoloValue = document.getElementById("tremolo-value");
    tremolo.gain.value = tremoloElement.value;
    tremoloValue.innerHTML = tremoloElement.value + " %";
    tremoloElement.addEventListener('input', function() {
        tremolo.gain.value = this.value;
        tremoloValue.innerHTML = parseInt(this.value / 10) + " %";
    }, false);

    //Vibrato
    const vibrato = audioContext.createGain();
    const vibratoElement = document.querySelector('#vibrato');
    const vibratoValue = document.getElementById('vibrato-value');
    vibrato.gain.value = vibratoElement.value;
    vibratoValue.innerHTML = vibratoElement.value + " %";
    vibratoElement.addEventListener('input', function() {
        vibrato.gain.value = this.value;
        vibratoValue.innerHTML = parseInt(this.value / 10) + " %";
    }, false);

    //Waveforms of main Oscillator and LFO
    var waveform = ["sine", "sine"];
    var waveSelector = ['input[name="osc-radio"]', 'input[name="lfo-radio"]'];
    for (let i = 0; i < 2; i++) {
        document.querySelectorAll(waveSelector[i]).forEach((radioButton) => {
            radioButton.addEventListener("change", function(event) {
                waveform[i] = event.target.value;
            });
        });
    }

    //Detune of main Oscillator and Frequency of LFO
    var detune_lfoFreq_values = [100, 5];
    var detune_lfoFreq_selector = ['#det-freq', '#lfo-freq'];
    const detuneValue = document.getElementById('det-value');
    const lfoFreqValue = document.getElementById('lfo-freq-value');
    detuneValue.innerHTML = parseInt(document.querySelector(detune_lfoFreq_selector[0]).value / 10) + " %";
    lfoFreqValue.innerHTML = document.querySelector(detune_lfoFreq_selector[1]).value + " Hz";
    for (let i = 0; i < 2; i++) {
        document.querySelector(detune_lfoFreq_selector[i]).addEventListener("input", function(event) {
            detune_lfoFreq_values[i] = event.target.value;
            if (i === 0) {
                detuneValue.innerHTML = parseInt(event.target.value / 10) + " %";
            } else if (i === 1) {
                lfoFreqValue.innerHTML = parseInt(event.target.value) + " Hz";
            }
        });
    }

    //ADSR Envelope 
    const adsrCtx = audioContext.createGain();
    const envelopeADSR = document.getElementsByClassName("envelope");
    const displayValue = document.getElementsByClassName("display-value");

    for (let i = 0; i < envelopeADSR.length; i++) {
        if (i === 0 || i === 3 || i === 6) { //attack-decay-release
            displayValue[i].innerHTML = parseInt(envelopeADSR[i].value * 10) + " %";
        } else { //start-end time
            displayValue[i].innerHTML = envelopeADSR[i].value + " sec";
        }
        envelopeADSR[i].addEventListener("input", function(event) {
            if (i === 0 || i === 3 || i === 6) { //attack-decay-release
                displayValue[i].innerHTML = parseInt(event.target.value * 10) + " %";
            } else { //start-end time
                displayValue[i].innerHTML = event.target.value + " sec";
            }
        });
    }

    //Notes
    var notes = document.getElementById('piano').getElementsByClassName('piano-key');
    var noteKeys = new Array();

    for (let i in notes) {
        if (notes[i].innerHTML != null) {
            noteKeys.push('#' + notes[i].getAttribute('id'));
            hitKey(noteKeys[i]);
        }
    }

    const keys = document.querySelectorAll('.piano-key');
    var dataKey = new Array();
    keys.forEach(function(elem) {
        dataKey.push(elem.getAttribute('data-key'));
    });


    function hitKey(note_name) {
        const note = document.querySelector(note_name);

        //Things to do when user clicks at key
        note.addEventListener('mousedown', function() {
            var freq = note.getAttribute('data-freq');
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.detune.value = detune_lfoFreq_values[0];
            oscillator.type = waveform[0];

            //attack phase (ADSR)
            adsrCtx.gain.setTargetAtTime(parseInt(envelopeADSR[0].value), audioContext.currentTime + parseInt(envelopeADSR[1].value), parseInt(envelopeADSR[2].value));

            lfo.type = waveform[1];
            lfo.frequency.setValueAtTime(detune_lfoFreq_values[1], audioContext.currentTime);

        }, false);

        document.addEventListener('keydown', e => {
            var freq = note.getAttribute('data-freq');
            if (dataKey.includes(e.keyCode.toString()) && e.keyCode == note.getAttribute('data-key')) {
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.detune.value = detune_lfoFreq_values[0];
                oscillator.type = waveform[0];

                //attack phase (ADSR)
                adsrCtx.gain.setTargetAtTime(parseInt(envelopeADSR[0].value), audioContext.currentTime + parseInt(envelopeADSR[1].value), parseInt(envelopeADSR[2].value));

                lfo.type = waveform[1];
                lfo.frequency.setValueAtTime(detune_lfoFreq_values[1], audioContext.currentTime);
            }

        }, false);

        document.addEventListener('keyup', releaseKey, false);
        note.addEventListener('mouseup', releaseKey, false);
    }


    //Things to do when user stop clicking at key
    function releaseKey() {
        //decay phase (ADSR)
        adsrCtx.gain.setTargetAtTime(parseInt(envelopeADSR[3].value), audioContext.currentTime + parseInt(envelopeADSR[4].value), parseInt(envelopeADSR[5].value));
        //release phase (ADSR)
        adsrCtx.gain.setTargetAtTime(parseInt(envelopeADSR[6].value), audioContext.currentTime + parseInt(envelopeADSR[7].value), parseInt(envelopeADSR[8].value));
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