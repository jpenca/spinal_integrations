
var pattern;
var canvasHeight = 200;
var canvasWidth;
var params;
var events;
var autorefresh;
var timer;

var p = localStorage.getItem('params');
spinal.getParams().then(p => {
	params = p;
	localStorage.setItem('params', params)
});


function setup() {

	canvasWidth = windowWidth-20;
	canvas = createCanvas(canvasWidth, canvasHeight)
	rectMode(CORNERS)
	
	var chk = document.getElementById("autorefresh");
	chk.onclick = () => {
		if(chk.checked)
			timer = setInterval(fetch, 250);
		else
			clearInterval(timer);		
	}
}

function windowResized() {
	canvasWidth = windowWidth-20;
	resizeCanvas(canvasWidth, canvasHeight)
}

function draw() {
	background(255)
	drawPattern()
	drawEvents()
	noLoop()
}

function drawEvents() {
	if(events == null)
		return;

	var even = true;
	
	textSize(10);
	var i = 0;

	events.forEach(event => {

		var y = canvasHeight/2 + 32;
		if(even) y += 32;

		fill(200, 255, 150)
		
		var xStart = map(event.start, 0, events.patternLength-1, 40, canvasWidth-40);
		var xStop = map(event.stop, 0, events.patternLength-1, 40, canvasWidth-40);
		rect(
			xStart,
			y,
			xStop,
			y+16,
			2);

		noStroke();
		fill(255);
		text(`v${event.velocity} n${event.note}`, xStart+2, y+13)
		
		even = !even

		i++;
	})
}

function drawPattern() {
	if(pattern == null)
		return;

	noStroke()
	fill(100)
	ellipse(8, 8, 3, 3)
	colorMode(HSB, 255);

	var len = pattern.tracks[0].settings.length;
	if(!pattern.settings.advanced)
		len = pattern.settings.length;

	var pattern_quantize = pattern.settings.quantize;
	var track_quantize = pattern.tracks[0].settings.quantize;
	var quantize = pattern_quantize;

	if(track_quantize > quantize)
		quantize = track_quantize;

	var microMax = map(quantize, 0, 127, 1, 0);
	var dia = 6;

	for(var stepIndex = 0; stepIndex < len; stepIndex++) {
		
		var x = map(stepIndex, 0, len-1, 40, canvasWidth-40)
		var y = canvasHeight/6

		strokeWeight(1);
		stroke(0, 0, 200)
		line(x, 10, x, canvasHeight/2+20);

		var step = pattern.tracks[0].steps[stepIndex];
		if(step.on) {

			noStroke();
			var hue = map(stepIndex, 0, len, 0, 255 * 4)
			while(hue > 255)
				hue -= 255;

			fill(hue, 255, 255);
			ellipse(x, y, dia, dia);

			var pos = stepIndex;

			if(step.microtiming != null) {
				pos += map(step.microtiming, -24, 24, -1, 1) * microMax;
			}

			while(pos < 0)
				pos += len;
			while(pos > len)
				pos -= len;

			var shiftX = map(pos, 0, len-1, 40, canvasWidth-40);

			stroke(hue, 255, 255);
			strokeWeight(1);
			line(x, y, shiftX, y+32);

			noStroke();
			// fill(100);
			ellipse(shiftX, y+32, dia, dia);

			y+=32;

			var prevShiftX = shiftX;

			if(step.swing) {
				pos += map(pattern.settings.swing, 0, 50, 0, 1);
			}

			while(pos < 0)
				pos += len;
			while(pos > len)
				pos -= len;

			var shiftX = map(pos, 0, len-1, 40, canvasWidth-40);

			stroke(hue, 255, 255);
			strokeWeight(1);
			line(prevShiftX, y, shiftX, y+32);

			noStroke();
			fill(hue, 255, 255);
			ellipse(shiftX, y+32, dia, dia);

			y+=32;
		}
	}
}

function mousePressed () {
	fetch();
}

function fetch() {
	loop()

	spinal.getPattern().then(p => { 
		pattern = p;
		events = SpinalPatternCreateEvents(pattern, 0)
		console.log(events);
		loop()
	})
}


































