
window.onload = () => {

	console.clear()
	console.log('doc loaded')
	for(var i = 12; i >= -12; i--) {
		
		if(i == 0)
			continue

		addBtn(i);
	}
}

function addBtn(note) {
	console.log('adding button for note: ' + note);
	var btn = document.createElement('button');
	btn.setAttribute('content', note);
	btn.className = 'button';
	btn.innerHTML = note;
	document.body.appendChild(btn); 

	btn.onclick = () => {
		transpose(btn, note);
	}
	
}

let s = new Spinal();

function foldNoteValue(note) {
	
	while(note < 60-24) {
		note += 12
	}
	while(note > 60+24) {
		note -= 12
	}

	return note
}

function transpose(btn, note) {

	console.log('transposing ' + note)
	s.getPattern().then(pattern => {

		console.log(pattern)


		pattern.tracks.forEach((track, tIndex) => {
			
			// console.log('trk ' + index)
			track.settings.trig.note = foldNoteValue(track.settings.trig.note + note)
			
			track.steps.forEach((step, sIndex) => {
				if(step.note != null) {
					
					step.note = foldNoteValue(step.note + note)
				}
			})
		})
		
		
		console.log(pattern)

		s.post(pattern).then(result => {
			console.log('done!')
		})
		
	})
}