
var params;
var pattern;
var settings;
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

	btn = document.getElementById("savemidi")
	btn.onclick = () => {
		saveMidiFile(pattern, patternEvents, settings.playback.tempo, "hello");
	}

	main_fetch()
})

main_fetch = () => {

	spinal.get('pat.x,set.x').then(res => { 
		pattern = res['pat.x']
		settings = res['set.x']
		console.log('pattern: ', pattern)
		patternEvents = SpinalCreatePatternEvents(pattern, params)
		trackSketch.loop()
	})
}

var parts = [];
var synths = [];

for(var i = 0; i < 13; i++) {
	var synth = new Tone.FMSynth().toMaster()
	synths.push(synth)
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

		if(!settings.muted[i])
			continue

		const part = new Tone.Part((time, event) => {
			
			synths[event.track].triggerAttackRelease(event.note, event.dur, time, map_number(event.velocity, 1, 127, .1, .5))
			var future = time - Tone.now()
			setTimeout(() => triggerSketch.trigger(event.track, event.velocity, event.dur), future * 1000)

		}, convertSpinalEventsToToneEvents(patternEvents[i], i))

		part.start(0)
		part.loop = 100000
		part.loopEnd = pattern.settings.length / 8
		parts.push(part)
	}

	Tone.Transport.bpm.value = settings.playback.tempo;
	console.log('tempo: ' + settings.playback.tempo)
	Tone.Transport.start('+0.0');
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
			track: 		trk,

		})
	})

	return out
}






