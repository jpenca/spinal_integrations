function map_number(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

function SpinalPatternMapTime(pattern, trk) {
	
	var len = pattern.tracks[0].settings.length;
	if(!pattern.settings.advanced)
		len = pattern.settings.length;

	var pattern_quantize = pattern.settings.quantize;
	var track_quantize = pattern.tracks[0].settings.quantize;

	var quantize = pattern_quantize;
	if(track_quantize > quantize)
		quantize = track_quantize;
	var microMax = map_number(quantize, 0, 127, 1, 0);
	var timemap = [];

	for(var stepIndex = 0; stepIndex < len; stepIndex++) {
		var step = pattern.tracks[0].steps[stepIndex];
		if(step.on) {
			var pos = stepIndex;
			if(step.microtiming != null) {
				pos += map_number(step.microtiming, -24, 24, -1, 1) * microMax;
			}
			if(step.swing) {
				pos += map_number(pattern.settings.swing, 0, 50, 0, 1);
			}

			while(pos < 0)
				pos += len;
			while(pos > len)
				pos -= len;

			timemap.push({
				step: step,
				seqpos: stepIndex,
				warped: pos
			});
		}
	}
	return timemap;
}

function SpinalPatternCreateEvents(pattern, trk) {

	// console.log('creating events')
	var tmap = SpinalPatternMapTime(pattern, trk);
	// console.log('timemap: ', tmap);
	var sorted_map = tmap.sort((a, b) => {
		if(a.warped < b.warped)
			return -1
		if(a.warped > b.warped)
			return 1
		if(a.seqpos < b.seqpos)
			return -1
		if(a.seqpos > b.seqpos)
			return 1
		return 0
	});

	var events = [];
	var len = pattern.tracks[0].settings.length;
	if(!pattern.settings.advanced)
		len = pattern.settings.length;

	var trackTrigLen = pattern.tracks[0].settings.trig.length;
	var trackVelo = pattern.tracks[0].settings.trig.velocity;
	var trackNote = pattern.tracks[0].settings.trig.note;

	var lastEventStart = len;

	for(var i = sorted_map.length-1; i >= 0; i--) {

		var obj = sorted_map[i];
		var trigless = false;
		if(obj.step.synth == false && obj.step.sample == false)
			trigless = true;
		
		var velo = trackVelo;
		if(obj.step.velocity != null)
			velo = obj.step.velocity;

		var note = trackNote;
		if(obj.step.note != null)
			note = obj.step.note;

		var trigLen = trackTrigLen;
		if(obj.step.length != null)
			trigLen = obj.step.length
			
		var normalizedLen = params.trig.triglengths[trigLen];
		if(normalizedLen < 0.12) // INF!!
			normalizedLen = 128;

		var stop = obj.warped + normalizedLen;
		if(stop > lastEventStart)
			stop = lastEventStart;

		if(obj.step.retrig && !trigless) {

			var retrate = obj.step.retrig.rate;
			var retlen = obj.step.retrig.length;
			var normalizedRetRate = params.trig.retrigrates[retrate];
			var normalizedRetLen = params.trig.triglengths[retlen];
			if(normalizedRetLen < 0.12) // INF!!
				normalizedRetLen = 128;

			// console.log('retlen: ' + normalizedRetLen);

			var retStart = obj.warped;
			var retStop = retStart + normalizedRetLen;

			// console.log('retStop: ' + retStop)
			if(retStop > lastEventStart)
				retStop = lastEventStart;

			// console.log('lastEventStart: ' + lastEventStart);

			var interval = 1/normalizedRetRate*16;
			var tail = retStart;

			while(tail + interval < retStop)
				tail += interval;

			while(tail >= retStart-interval/8) {

				var rstop = tail + normalizedLen;
				if(rstop > lastEventStart)
					rstop = lastEventStart;

				var rvelo = map_number(
					tail, 
					retStart, 
					retStop-interval, 
					velo, 
					velo + obj.step.retrig.velocity)
				if(rvelo > 127)
					rvelo = 127;
				if(rvelo < 1)
					rvelo = 1;

				rvelo = Math.round(rvelo);

				if(rvelo > 0) {
					if(rstop - tail > 0.0001) {
						events.push({
							seqpos: 	obj.seqpos,
							step:  		obj.step,
							start: 		tail,
							stop:  		rstop,
							velocity: 	rvelo,
							note: 		note
						});	
					}
				}
				
				lastEventStart = tail;
				tail -= interval;
			}

		}
		else if (!trigless) {

			if(stop - obj.warped > 0.0001) {
				events.push({
					seqpos: 	obj.seqpos,
					step:  		obj,
					start: 		obj.warped,
					stop:  		stop,
					velocity: 	velo,
					note: 		note,
				});	
			}
			
			lastEventStart = obj.warped;
		}
	}			

	var sorted = events.sort((a, b) => {
		if(a.start < b.start)
			return -1;
		if(a.start > b.start)
			return 1;
		return 0
	});

	sorted.patternLength = len;
	return sorted;
}