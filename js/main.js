// a small hello world demo for spinal.
//
// creates a button in the html DOM.
// when you click the button, the following http GET request is sent:
// http://localhost:5000/ar/json/data?keys=kit.x
//
// if you have your analog rytm connected to your mac, and the spinal app running & listening on port 5000,
// the spinal app will reply with the current kit (kit.x) from your rytm as JSON object.
//
// here, the response is printed to the console. open your console, look at the kit data structure.
// this script just changes the 'name' field of the kit.
//
// Then it sends the kit back to http://localhost:5000/ar/json/data using a http POST request.
//
// Look at the kit name in yor Rytm - it's changed!
//
// experiment tweaking other values inside the kit.
//
//
//
// the Spinal object here is just a small wrapper for XMLHttpRequest.
//
// feel free to use this as a template for your own scripts!

function getSingleDemo(spinal) {
		spinal.getSingle('kit.x').then(kit => console.log('new name on rytm:', kit.name));
}

document.body.onload = () => {

	// create a button
	var btn = document.createElement("input")
	document.body.appendChild(btn)

	btn.type = "button"
	btn.value = "rename kit to hello world!"

	btn.onclick = () => {


		// get the current kit from your rytm.

		spinal.get('kit.x')
					.then(r => {

						console.log(r)

						// r is the response. it's an object which contains the kit at the key ('kit.x')
						// that's the same key you used to request the current kit!

						let kit = r['kit.x']

						// lets change the name of the kit.
						kit.name = "hello world"

						console.log('renamed kit')

						// and send it back to the spinal app!
						spinal.post(kit).then(r => {
							console.log('success!')
						}).then(() => getSingleDemo(s))

					}).then(() => console.log('sent kit back to rytm'))
	}
}
