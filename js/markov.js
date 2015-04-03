/*
          C    C#     D    E-     E     F    F#     G    A-     A    B-     B
    |-------------------------------------------------------------------------
C   |  3282     1  2661    13  2303   180     8  1510     0   682   106  1537
C#  |     2     0    17     0     3     0     0     0     0     0     0     0
D   |  3892    17  2694    32  3172   682     5  1000     0   183     8   423
E-  |     9     0    35    15     0    27     0     6     0     0     0     0
E   |  1639     4  4585     0  3365  2494    30  2978     0   235     8    15
F   |    44     0  1176    18  3843  1526     0  1637     2   488    11   117
F#  |     1     0     7     0    11     2    19   107     0    12     0     0
G   |  2564     0   499    11  2766  3653    86  4854     4  1658    60   225
A-  |     0     0     0     0     0     3     0     6     0     2     0     0
A   |   227     0    97     0    36   250     9  3016     2   955    29   427
B-  |    51     0     7     3    36     6     0    67     3    55    72     6
B   |  1369     0   349     0    10    22     2   214     0   781     8   258
 */

var KEY_C      = 0;
var KEY_CSHARP = 1;
var KEY_D      = 2;
var KEY_DSHARP = 3;
var KEY_E      = 4;
var KEY_F      = 5;
var KEY_FSHARP = 6;
var KEY_G      = 7;
var KEY_GSHARP = 8;
var KEY_A      = 9;
var KEY_ASHARP = 10;
var KEY_B      = 11;

var keys_names = 
	{
		0: 'C4',
		1: 'C#4',
		2: 'D4',
		3: 'D#4',
		4: 'E4',
		5: 'F4',
		6: 'F#4',
		7: 'G4',
		8: 'G#4',
		9: 'A4',
		10: 'A#4',
		11: 'B4' 
	};

var keys_transition = 
	[
		[3282, 1, 2661, 13, 2303, 180, 8, 1510, 0, 682, 106, 1537],
		[2, 0, 17, 0, 3, 0, 0, 0, 0, 0, 0, 0],
		[3892, 17, 2694, 32, 3172, 682, 5, 1000, 0, 183, 8, 423],
		[9, 0, 35, 15, 0, 27, 0, 6, 0, 0, 0, 0],
		[1639, 4, 4585, 0, 3365, 2494, 30, 2978, 0, 235, 8, 15],
		[44, 0, 1176, 18, 3843, 1526, 0, 1637, 2, 488, 11, 117],
		[1, 0, 7, 0, 11, 2, 19, 107, 0, 12, 0, 0],
		[2564, 0, 499, 11, 2766, 3653, 86, 4854, 4, 1658, 60, 225],
		[0, 0, 0, 0, 0, 3, 0, 6, 0, 2, 0, 0],
		[227, 0, 97, 0, 36, 250, 9, 3016, 2, 955, 29, 427],
		[51, 0, 7, 3, 36, 6, 0, 67, 3, 55, 72, 6],
		[1369, 0, 349, 0, 10, 22, 2, 214, 0, 781, 8, 258]
	];

var keys_cdf = [];


//create one of Tone's built-in synthesizers
var synth = new Tone.MonoSynth();

//connect the synth to the master output channel
synth.toMaster();

// Set Scale
/*keys = {
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
*/

var note = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNextNote(note) 
{
 	rand = getRandomInt(1, keys_cdf[note]['sum']);
 	start = 0;
 	end = 0;
 	
 	for(i = 0; i < keys_cdf[note]['cdf'].length; i++)
 	{
 		start = end + 1;
 		end = keys_cdf[note]['cdf'][i];
 		if(rand >= start && rand <= end)
 		{
 			return i;
 		}
 	}
  	return -1;
}

//create a callback which is invoked every quarter note
var i = 1;
Tone.Transport.setInterval(function(time){

  note = getNextNote(note);
  key = keys_names[note];

  // play note
  synth.triggerAttackRelease(key, "8n", time);
  $("#notes-played").append(key);

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

	// compute the discrete cumulative density function (CDF) of the array
	for(i = 0; i < keys_transition.length; i++)
	{
		ks = keys_transition[i];
		csum = 0;
		keys_cdf[i] = {};
		keys_cdf[i]['cdf'] = [];
		
		for(j = 0; j < ks.length; j++)
		{
			csum += keys_transition[i][j];
			keys_cdf[i]['cdf'][j] = csum;
		}
		
		keys_cdf[i]['sum'] = csum;
	}

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

