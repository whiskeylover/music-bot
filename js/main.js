// Main Application JS
//create one of Tone's built-in synthesizers
var synth = new Tone.MonoSynth();

//connect the synth to the master output channel
synth.toMaster();

// Set Scale
var notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
var position = 0;

//create a callback which is invoked every quarter note
Tone.Transport.setInterval(function(time){
    var note = notes[position++];
    position = position % notes.length;
    synth.triggerAttackRelease(note, "8n", time);
}, "4n");

//start the transport
Tone.Transport.start();

$(document).ready(function() {
  $("#tempo-slider").slider({
    min: 40,
    max: 240,
    value: 120,
    slide: function(event, ui) {
      $("#tempo-val").text(ui.value);
      Tone.Transport.bpm.value = ui.value;
    }
  });
})
