//create one of Tone's built-in synthesizers
var synth = new Tone.MonoSynth();

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
var key = keys["C Major"];
var note = "C4";
var currentKey = "C Major";
var rand = Math.random();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNote(notes, beat) {
  // determine note to play
  rand = Math.random();
  switch (beat) {
    case 1:
      note = notes[0];
      break;
    case 5:
      if (rand > 0.5) {
        note = notes[0];
      } else {
        note = notes[4];
      }
      break;
    case 7:
      if (rand > 0.5) {
        note = notes[1];
      } else {
        note = notes[3];
      }
      break;
    case 9:
      if (rand > 0.5) {
        note = notes[0];
      } else {
        note = notes[7];
      }
      break;
    case 16:
      if (rand > 0.25) {
        note = notes[4];
      } else {
        note = notes[6];
      }
      break;
    case 17:
      if (rand > 0.25) {
        note = notes[5];
      } else {
        note = notes[3];
      }
      break;
    case 25:
      if (rand > 0.25) {
        note = notes[4];
      } else {
        note = notes[3];
      }
      break;
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
      note = notes[getRandomInt(1,6)];
      break;
    case 32:
      if (rand < 0.25) {
        note = notes[6];
      } else if (rand < 0.50) {
        note = notes[3];
      } else {
        note = notes[4];
      }
      break;
    default:
      note = notes[Math.floor(Math.random() * notes.length)];
  }
  return note
}

//create a callback which is invoked every quarter note
var i = 1;
Tone.Transport.setInterval(function(time){

  var nextNote = getNote(key, i);

  // play note
  synth.triggerAttackRelease(nextNote, "8n", time);
  $("#notes-played").append(nextNote);

  if (i == 32) {
    i = 1;
    $("#notes-played").append("<b>|</b> ");
  } else {
    i++;
  }
}, "8n");

//start the transport
Tone.Transport.start();

$(document).ready(function() {

  // play/pause
  $("#play").click(function (event) {
    Tone.Transport.start();
  });

  $("#pause").click(function (event) {
    Tone.Transport.pause();
  });

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
     key = keys[currentKey];
     $("#key-val").text(currentKey);
     $("#notes-played").append("<br/><h4>Key changed to " + currentKey + "</h4>");
     i = 1;
  });
})
