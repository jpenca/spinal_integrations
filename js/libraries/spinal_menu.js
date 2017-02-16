var spinal = new Spinal()

window.addEventListener('load', () => {

	var container = document.createElement('section')
	container.classList.add('boxthing')

	document.body.appendChild(container)
	let title = document.createElement('h1')
	title.innerHTML = 'Connect'
	container.appendChild(title)

	var hostTextfield = document.createElement('input');
	hostTextfield.classList.add('textinput')

	container.appendChild(hostTextfield);

	var host = localStorage.getItem('host');
	if(host != null)
		hostTextfield.value = host;
	else
		hostTextfield.value = spinal.baseURL;

	hostTextfield.onchange = () => {
		console.log(hostTextfield.value)
		spinal.baseURL = hostTextfield.value;
		localStorage.setItem('host', hostTextfield.value)
	}

	var button = document.createElement('button')

	button.setAttribute('content', 'Test');
	button.className = 'button';
	button.innerHTML = 'test';
	container.appendChild(button)

	button.onclick = () => {
		console.log('testing!')
		spinal.getPattern()
		.then(	pattern => {
			console.log('OK!')
		}, 		err => {
			console.log('FAIL!')
		})
	}
})


