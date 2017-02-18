
var params;

var p5drawTrack = p => {

	var pattern;
	var canvasHeight = 200;
	var canvasWidth;
	
	var events;
	var timer;

	spinal.getParams().then(p => {
		params = p;
	});

	p.setup = () => {

		canvasWidth = p.windowWidth-20;
		canvas = p.createCanvas(canvasWidth, canvasHeight)
		p.rectMode(p.CORNERS)
	
		var chk = document.getElementById("autorefresh");
		chk.onclick = () => {
			if(chk.checked)
				timer = setInterval(p.fetch, 250);
			else
				clearInterval(timer);
		}
	}

	
	p.windowResized = () => {
		canvasWidth = p.windowWidth-20;
		p.resizeCanvas(canvasWidth, canvasHeight)
	}

	
	p.draw = () => {
		p.background(255)
		p.drawPattern()
		p.drawEvents()
		p.noLoop()
	}

	p.mousePressed = () => {
		p.fetch();
	}

	p.fetch = () => {
		p.loop()

		spinal.getPattern().then(pat => { 
			pattern = pat;
			events = SpinalPatternCreateEvents(pattern, 0)
			// console.log(events);
			p.loop()
		})
	}

	p.drawEvents = () => {
		
		if(events == null)
			return;

		var even = true;
	
		p.textSize(10);
		var i = 0;

		events.forEach(event => {

			var y = canvasHeight/2 + 32;
			if(even) y += 32;

			p.fill(200, 255, 150)
		
			var xStart = p.map(event.start, 0, events.patternLength, 40, canvasWidth-40);
			var xStop = p.map(event.stop, 0, events.patternLength, 40, canvasWidth-40);
			p.rect(
				xStart,
				y,
				xStop,
				y+16,
				2);

			p.noStroke();
			p.fill(255);
			p.text(`v${event.velocity} n${event.note}`, xStart+2, y+13)
		
			even = !even

			i++;
		})
	}


	p.drawPattern = () => {
		if(pattern == null)
			return;

		p.noStroke()
		p.fill(100)
		p.ellipse(8, 8, 3, 3)
		p.colorMode(p.HSB, 255);

		var len = pattern.tracks[0].settings.length;
		if(!pattern.settings.advanced)
			len = pattern.settings.length;

		var pattern_quantize = pattern.settings.quantize;
		var track_quantize = pattern.tracks[0].settings.quantize;
		var quantize = pattern_quantize;

		if(track_quantize > quantize)
			quantize = track_quantize;

		var microMax = p.map(quantize, 0, 127, 1, 0);
		var dia = 6;

		for(var stepIndex = 0; stepIndex < len; stepIndex++) {
			
			var x = p.map(stepIndex, 0, len, 40, canvasWidth-40)
			var y = canvasHeight/6

			p.strokeWeight(1);
			p.stroke(0, 0, 200)
			p.line(x, 20, x, canvasHeight/2+20);

			p.noStroke();
			p.fill(0,0,200)
			p.text(stepIndex+1, x-4, 13)

			var step = pattern.tracks[0].steps[stepIndex];
			if(step.on) {

				p.noStroke();
				var hue = p.map(stepIndex, 0, len, 0, 255 * 4)
				while(hue > 255)
					hue -= 255;

				p.fill(hue, 255, 255);
				p.ellipse(x, y, dia, dia);

				var pos = stepIndex;

				if(step.microtiming != null) {
					pos += p.map(step.microtiming, -24, 24, -1, 1) * microMax;
				}

				while(pos < 0)
					pos += len;
				while(pos > len)
					pos -= len;

				var shiftX = p.map(pos, 0, len, 40, canvasWidth-40);

				p.stroke(hue, 255, 255);
				p.strokeWeight(1);
				p.line(x, y, shiftX, y+32);

				p.noStroke();
				// fill(100);
				p.ellipse(shiftX, y+32, dia, dia);

				y+=32;

				var prevShiftX = shiftX;

				if(step.swing) {
					pos += p.map(pattern.settings.swing, 0, 50, 0, 1);
				}

				while(pos < 0)
					pos += len;
				while(pos > len)
					pos -= len;

				var shiftX = p.map(pos, 0, len, 40, canvasWidth-40);

				p.stroke(hue, 255, 255);
				p.strokeWeight(1);
				p.line(prevShiftX, y, shiftX, y+32);

				p.noStroke();
				p.fill(hue, 255, 255);
				p.ellipse(shiftX, y+32, dia, dia);

				y+=32;
			}
		}
	}
}


new p5(p5drawTrack);














