class TriggerCircle {

	constructor() {
		this.start = 0
		this.vel = 0
		this.on = false
		this.dur = 0
		this.progress = 0
	}

	trigOn(vel, dur) {
		this.start = Tone.now()
		this.dur = dur
		this.vel = vel
		this.on = true
	}

	update() {
		if(this.on) {
			
			const now = Tone.now()
			const end = this.start + this.dur
			if(end <= now) {
				this.on = false
			}
			else {
				this.progress = map_number(now, this.start, end, 1, 0)
			}
		}
		else {
			this.progress = 0
		}
	}
}

var p5drawTrigger = p => {

	var canvasHeight = 200;
	var canvasWidth;
	var dias = []
	

	p.setup = () => {
		canvasWidth = p.windowWidth-20;
		p.createCanvas(canvasWidth, canvasHeight)
		p.frameRate(60)

		for(var i = 0; i < 13; i++) {
			dias.push(new TriggerCircle())
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
			var circ = dias[i]
			circ.update()

			var vel = p.map(circ.vel, 1, 127, 0.1, 1)

			var prog = circ.progress
			var d = p.map(prog, 1, 0, canvasHeight * 2/3 * vel, 0)

			p.ellipse(x, canvasHeight/2, d, d)
			
		}
	}

	p.trigger = (trk, vel, dur) => {
		dias[trk].trigOn(vel, dur)
	}
}