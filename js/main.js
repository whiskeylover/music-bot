//create one of Tone's built-in synthesizers
var synth = new Tone.DuoSynth();

//connect the synth to the master output channel
synth.toMaster();

// Set Scale
keys = {
  "C Major": ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  "G Major": ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"],
  "D Major": ["D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5"],
  "A Major": ["A4", "B4", "C#5", "D5", "E5", "F#5", "G#5", "A5"],
  "E Major": ["E4", "F#4", "G#4", "A4", "B4", "C#5", "D#5", "E5"]
}
var notes = keys["C Major"];
var currentKey = "C Major";

//create a callback which is invoked every quarter note
Tone.Transport.setInterval(function(time){
    var note = notes[Math.floor(Math.random() * notes.length)];
    synth.triggerAttackRelease(note, "8n", time);
}, "4n");

//start the transport
Tone.Transport.start();

$(document).ready(function() {

  // tempo handler
  $("#tempo-slider").slider({
    min: 40,
    max: 240,
    value: 120,
    slide: function(event, ui) {
      $("#tempo-val").text(ui.value);
      Tone.Transport.bpm.value = ui.value;
    }
  });

  // key handler
  $("#key-buttons button").on("click", function(event) {
     currentKey = $(event.currentTarget).text();
     notes = keys[currentKey];
     $("#key-val").text(currentKey);
  });
})
