
var params;
var pattern;
var patternEvents;
var timer;

spinal.getParams().then(p => {
	params = p;
});

var trackSketch
var triggerSketch

window.addEventListener('load', () => {

	var div = document.getElementById('track');
	trackSketch = new p5(p5drawTrack, div);
	div = document.getElementById('trigg');
	triggerSketch = new p5(p5drawTrigger, div);

	var btn = document.getElementById('synthtoggle');
	btn.onclick = () => {
		if(btn.checked) {
			startPlayback();
		}
		else
			Tone.Transport.stop();
	}

	var chk = document.getElementById("autorefresh");
	chk.onclick = () => {
		if(chk.checked)
			timer = setInterval(main_fetch, 250);
		else
			clearInterval(timer);
	}
})

main_fetch = () => {

	spinal.getPattern().then(pat => { 
		pattern = pat
		patternEvents = []
		
		for(var i = 0; i < 13; i++) {
			patternEvents.push(SpinalPatternCreateEvents(pattern, i))
		}

		trackSketch.loop()
	})
}

var parts = [];
var synths = [];

for(var i = 0; i < 13; i++) {
	synths.push(new Tone.Synth().toMaster())	
}

function startPlayback() {

	Tone.Transport.stop();

	if(parts.length) {
		parts.forEach(part => {
			part.removeAll()
			part.dispose()
		})
	}

	parts = [];

	if(!patternEvents.length)
		return;

	for(var i = 0; i < 13; i++) {
		const part = new Tone.Part((time, event) => {
		
			synths[event.track].triggerAttackRelease(event.note, event.dur, time, map_number(event.velocity, 1, 127, .1, .5))
			triggerSketch.trigger(event.track, event.velocity)

		}, convertSpinalEventsToToneEvents(patternEvents[i], i))

		part.start(0)
		part.loop = 7
		part.loopEnd = '1m'

		parts.push(part)
	}
	// Tone.Transport.bpm.value = 120;
	Tone.Transport.start('+0.1');
}

function midiToPitch(midi) {
	const scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	const octave = Math.floor(midi / 12) - 1;
	const note = midi % 12;
	return scaleIndexToNote[note] + octave;
}


function convertSpinalEventsToToneEvents(events, trk) {

	if(!events.length)
		return []

	var out = []
	events.forEach(e => {
		out.push({

			time: 		map_number(e.start, 0, 16, 0, 2),
			note: 		midiToPitch(e.note),
			dur: 	  	map_number(e.stop - e.start, 0, 16, 0, 2),
			velocity: 	e.velocity,
			track: 		trk

		})
	})

	return out
}













