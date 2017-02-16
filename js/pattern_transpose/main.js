
window.addEventListener('load', () => {

	console.clear()
	console.log('doc loaded')

	var container = document.createElement('section')
		container.classList.add('boxthing')
	
	document.body.appendChild(container)
	let title = document.createElement('h1')
	title.innerHTML = 'Transpose Current Pattern'
	container.appendChild(title)

	for(var i = 12; i >= -12; i--) {
		
		if(i == 0)
			continue

		addBtn(container, i);
	}
})

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

// let spinal = new Spinal();

function fold(note) {
	
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
	spinal.getPattern().then(pattern => {
		pattern.tracks.forEach((track, tIndex) => {
			track.settings.trig.note = fold(track.settings.trig.note + note)
			track.steps.forEach((step, sIndex) => {
				if(step.note != null) {
					step.note = fold(step.note + note)
				}
			})
		})

		spinal.post(pattern).then(result => {
			console.log('done!')
		})
	})
}