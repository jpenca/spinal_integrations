function saveMidiFile(pattern, patternEvents, tempo, name) {

	var mpqn = Midi.Util.mpqnFromBpm(tempo)
	console.log(`saving midi file with tempo: ${tempo}bpm/${mpqn}mpqn`)
	const ticks = 1024*16

	var file = new Midi.File({ticks: ticks});
	file.addTrack().setTempo( tempo );

	var events = [];

	for(var trk = 0; trk < patternEvents.length; trk++) {

		const trackEvents = patternEvents[trk];

		for( var j = 0; j < trackEvents.length; j++) { 

			var event = trackEvents[j];

			console.log('pushing event:', event)
			if(event.start < 0)
				event.start = 0

			event.start *= 10;
			event.stop *= 10;

			// Note ON
			events.push({
				type: Midi.Event.NOTE_ON,
				channel: trk,
				param1: event.note,
				param2: event.velocity,
				time: event.start * ticks/40,
				trk: trk,
			});

			// Note OFF
			events.push({
				type: Midi.Event.NOTE_OFF,
				channel: trk,
				param1: event.note,
				param2: 0,
				time: event.stop * ticks/40,
				trk: trk
			});
		}
	}
			
	events.sort(function(a, b) {
		if(a.param1 == b.param1 && a.time == b.time) {
	  		return a.type - b.type;
	  	} else {
	  		return a.time - b.time;
	  	}
	});

	events = events.map( function(it, ind, arr) { 
		var prev = (arr[ind-1])? arr[ind-1].time : 0;
		return new Midi.Event({
			type: it.type,
			channel: it.channel,
			param1: it.param1,
			param2: it.param2,
			time: it.time - prev,
		});
	});

	var endTime = pattern.settings.length * ticks/40;
	var lastEventTime = events.slice(-1)[0].time;
	events.push(new Midi.MetaEvent({
		time: endTime - lastEventTime,
		type: Midi.MetaEvent.END_OF_TRACK
	}))

			//Add to Track
	file.addTrack( new Midi.Track({events: events}) );

	var bytes = file.toBytes()
	console.log(typeof bytes)
	var blob = new Blob([ new Uint8Array([].map.call(file.toBytes(), function(c) { return c.charCodeAt(0); })).buffer], {type: "audio/midi"})
	saveAs(blob, name + '.mid')
}