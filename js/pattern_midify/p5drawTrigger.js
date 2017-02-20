var p5drawTrigger = p => {

	var canvasHeight = 200;
	var canvasWidth;
	var dias = []

	p.setup = () => {
		canvasWidth = p.windowWidth-20;
		p.createCanvas(canvasWidth, canvasHeight)
		p.frameRate(60)

		for(var i = 0; i < 13; i++) {
			dias.push(canvasHeight)
		}
	}

	p.windowResized = () => {
		canvasWidth = p.windowWidth-20;
		p.resizeCanvas(canvasWidth, canvasHeight)
	}

	p.draw = () => {
		p.background(50)

		p.noStroke()
		p.fill(255)
		for (var i = 0; i < dias.length; i++) {
			const x = p.map(i, 0, dias.length-1, 200, canvasWidth-200)
			p.ellipse(x, canvasHeight/2, dias[i], dias[i])
			dias[i] -= 16
			if(dias[i] < 0)
			dias[i] = 0
		}
	}

	p.trigger = (trk, vel) => {
		dias[trk] = p.map(vel, 1, 127, 1, canvasHeight/2)
	}
}