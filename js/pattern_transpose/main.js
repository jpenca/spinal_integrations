
window.onload = () => {

	console.clear()
	console.log('doc loaded')

	var trasnposeContainer = document.createElement('section')
		trasnposeContainer.classList.add('transpose')
	
	document.body.appendChild(trasnposeContainer)
	let title = document.createElement('h1')
	title.innerHTML = 'Transpose Current Pattern'
	trasnposeContainer.appendChild(title)


	for(var i = 12; i >= -12; i--) {
		
		if(i == 0)
			continue

		addBtn(trasnposeContainer, i);
	}
}

function addBtn(parent, note) {
	console.log('adding button for note: ' + note);
	var btn = document.createElement('button');
	btn.setAttribute('content', note);
	btn.className = 'button';
	btn.innerHTML = note;
	parent.appendChild(btn); 

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
		pattern.tracks.forEach((track, tIndex) => {
			track.settings.trig.note = foldNoteValue(track.settings.trig.note + note)
			track.steps.forEach((step, sIndex) => {
				if(step.note != null) {
					step.note = foldNoteValue(step.note + note)
				}
			})
		})

		s.post(pattern).then(result => {
			console.log('done!')
		})
	})
}