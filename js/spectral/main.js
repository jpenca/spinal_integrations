var params;
var checkbox;

window.addEventListener('load', () => {
	console.log('load!')
	var btn = document.getElementById('doit')
	btn.onclick = () => {
		spinal.getParams().then(p => {
			params = p
			console.log('params', params)
			speccctral()
		})		
	}

	checkbox = document.getElementById('usekit')
})

function map_number(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}
function r() {
	return Math.random()
}

function rm(a, b) {
	return map_number(r(), 0, 1, a, b)
}

function speccctral() {
	spinal.get('pat.x').then(response => {
		var pattern = response['pat.x'];
		var kit = JSON.parse(kitString)

		pattern.settings.length = 64
		pattern.tracks[0].settings.length = 64
		var cond = params.trig.conditions.indexOf('prb.75');
		console.log('condition: ', cond)

		for(var stp = 0; stp < 64; stp++) {

			if(Math.random() > .9) {

				var lfo = 	{
								dep: r() > .95 ? rm(-10, 10) : 0,
								spd: rm(63, 90),
								mul: rm(8, 11),
								wav: rm(0, 6)
							}

				var sli = Math.random() > .8

				for(var trk = 0; trk < 12; trk ++) {

					var frq = rm(0, 127)
					var pan = rm(0, 127)
					
					pattern.tracks[trk].steps[stp] = {

						microtiming: r() > .5 ? rm(-20, 20) : 0,
						on: true,
						slide: sli,
						lfo: true,
						condition: cond,

						locks: {
							fil: {
								frq: frq
							},
							amp: {
								pan: pan,
								vol: rm(0, 127)
							},

							lfo: lfo,

						}
					}
				}
			}
			else {
				for(var trk = 0; trk < 12; trk ++) {
					pattern.tracks[trk].steps[stp] = {}
				}
			}
		}

		for(var trk = 0; trk < 12; trk++) {
			// copy bd sound to all others
			kit.sounds[trk] = kit.sounds[0]
			kit.sounds[trk].params.fil.frq = rm(0,127)
		}

		var out = [pattern]
		if(checkbox.value == true)
			out.push(kit)

		spinal.post(out).then(res => {
			console.log('done!')
		})
	})
}


var kitString = `{"levels":[127,127,127,127,127,127,127,127,127,127,127,127,0],"\
sounds":[{"modulations":{"aftertouch":[{"param":20,"depth":16},{"param":41,"dept\
h":0},{"param":41,"depth":0},{"param":41,"depth":0}],"velocity":[{"param":41,"de\
pth":0},{"param":20,"depth":0},{"param":21,"depth":0},{"param":41,"depth":0}]},"\
sample":"FFFFFFFF000000000000000000000000","position":0,"params":{"lfo":{"dep":0\
,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0,"sph":0,"mul":4},"smp":{"end":120,"\
lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun":64,"lop":0},"fil":{"frq":70,"res":\
105,"sus":0,"rel":64,"atk":0,"env":64,"dec":64,"typ":2},"amp":{"del":0,"rev":96,\
"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,"dec":127,"hld":0},"syn":{"0":127,"1\
":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64}},"type":"sound","settings":{"chrom\
atic":3,"legacyfx":0,"envreset":2,"machine":"nois","velocity":1},"tags":[],"name\
":"NEW SOUND"},{"modulations":{"aftertouch":[{"param":20,"depth":16},{"param":41\
,"depth":0},{"param":41,"depth":0},{"param":41,"depth":0}],"velocity":[{"param":\
41,"depth":0},{"param":20,"depth":0},{"param":21,"depth":0},{"param":41,"depth":\
0}]},"sample":"FFFFFFFF000000000000000000000000","position":0,"params":{"lfo":{"\
dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0,"sph":0,"mul":4},"smp":{"end"\
:120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun":64,"lop":0},"fil":{"frq":70,\
"res":105,"sus":0,"rel":64,"atk":0,"env":64,"dec":64,"typ":2},"amp":{"del":0,"re\
v":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,"dec":127,"hld":0},"syn":{"0":\
127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64}},"type":"sound","settings":{\
"chromatic":3,"legacyfx":0,"envreset":2,"machine":"nois","velocity":1},"tags":[]\
,"name":"NEW SOUND"},{"modulations":{"aftertouch":[{"param":20,"depth":16},{"par\
am":41,"depth":0},{"param":41,"depth":0},{"param":41,"depth":0}],"velocity":[{"p\
aram":41,"depth":0},{"param":20,"depth":0},{"param":21,"depth":0},{"param":41,"d\
epth":0}]},"sample":"FFFFFFFF000000000000000000000000","position":0,"params":{"l\
fo":{"dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0,"sph":0,"mul":4},"smp":\
{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun":64,"lop":0},"fil":{"fr\
q":70,"res":105,"sus":0,"rel":64,"atk":0,"env":64,"dec":64,"typ":2},"amp":{"del"\
:0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,"dec":127,"hld":0},"syn"\
:{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64}},"type":"sound","setti\
ngs":{"chromatic":3,"legacyfx":0,"envreset":2,"machine":"nois","velocity":1},"ta\
gs":[],"name":"NEW SOUND"},{"modulations":{"aftertouch":[{"param":20,"depth":16}\
,{"param":41,"depth":0},{"param":41,"depth":0},{"param":41,"depth":0}],"velocity\
":[{"param":41,"depth":0},{"param":20,"depth":0},{"param":21,"depth":0},{"param"\
:41,"depth":0}]},"sample":"FFFFFFFF000000000000000000000000","position":0,"param\
s":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0,"sph":0,"mul":4},\
"smp":{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun":64,"lop":0},"fil\
":{"frq":70,"res":105,"sus":0,"rel":64,"atk":0,"env":64,"dec":64,"typ":2},"amp":\
{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,"dec":127,"hld":0}\
,"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64}},"type":"sound",\
"settings":{"chromatic":3,"legacyfx":0,"envreset":2,"machine":"nois","velocity":\
1},"tags":[],"name":"NEW SOUND"},{"modulations":{"aftertouch":[{"param":20,"dept\
h":16},{"param":41,"depth":0},{"param":41,"depth":0},{"param":41,"depth":0}],"ve\
locity":[{"param":41,"depth":0},{"param":20,"depth":0},{"param":21,"depth":0},{"\
param":41,"depth":0}]},"sample":"FFFFFFFF000000000000000000000000","position":0,\
"params":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0,"sph":0,"mu\
l":4},"smp":{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun":64,"lop":0\
},"fil":{"frq":70,"res":105,"sus":0,"rel":64,"atk":0,"env":64,"dec":64,"typ":2},\
"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,"dec":127,"h\
ld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64}},"type":"s\
ound","settings":{"chromatic":3,"legacyfx":0,"envreset":2,"machine":"nois","velo\
city":1},"tags":[],"name":"NEW SOUND"},{"modulations":{"aftertouch":[{"param":20\
,"depth":16},{"param":41,"depth":0},{"param":41,"depth":0},{"param":41,"depth":0\
}],"velocity":[{"param":41,"depth":0},{"param":20,"depth":0},{"param":21,"depth"\
:0},{"param":41,"depth":0}]},"sample":"FFFFFFFF000000000000000000000000","positi\
on":0,"params":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0,"sph"\
:0,"mul":4},"smp":{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun":64,"\
lop":0},"fil":{"frq":70,"res":105,"sus":0,"rel":64,"atk":0,"env":64,"dec":64,"ty\
p":2},"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,"dec":\
127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64}},"ty\
pe":"sound","settings":{"chromatic":3,"legacyfx":0,"envreset":2,"machine":"nois"\
,"velocity":1},"tags":[],"name":"NEW SOUND"},{"modulations":{"aftertouch":[{"par\
am":20,"depth":16},{"param":41,"depth":0},{"param":41,"depth":0},{"param":41,"de\
pth":0}],"velocity":[{"param":41,"depth":0},{"param":20,"depth":0},{"param":21,"\
depth":0},{"param":41,"depth":0}]},"sample":"FFFFFFFF000000000000000000000000","\
position":0,"params":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"mod":0\
,"sph":0,"mul":4},"smp":{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":0,"tun\
":64,"lop":0},"fil":{"frq":70,"res":105,"sus":0,"rel":64,"atk":0,"env":64,"dec":\
64,"typ":2},"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol":110,\
"dec":127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,"7":64\
}},"type":"sound","settings":{"chromatic":3,"legacyfx":0,"envreset":2,"machine":\
"nois","velocity":1},"tags":[],"name":"NEW SOUND"},{"modulations":{"aftertouch":\
[{"param":20,"depth":16},{"param":41,"depth":0},{"param":41,"depth":0},{"param":\
41,"depth":0}],"velocity":[{"param":41,"depth":0},{"param":20,"depth":0},{"param\
":21,"depth":0},{"param":41,"depth":0}]},"sample":"FFFFFFFF000000000000000000000\
000","position":0,"params":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":20,"wav":6,"\
mod":0,"sph":0,"mul":4},"smp":{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,"brr":\
0,"tun":64,"lop":0},"fil":{"frq":70,"res":105,"sus":0,"rel":64,"atk":0,"env":64,\
"dec":64,"typ":2},"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":64,"vol\
":110,"dec":127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"6":64,\
"7":64}},"type":"sound","settings":{"chromatic":3,"legacyfx":0,"envreset":2,"mac\
hine":"nois","velocity":1},"tags":[],"name":"NEW SOUND"},{"modulations":{"aftert\
ouch":[{"param":20,"depth":16},{"param":41,"depth":0},{"param":41,"depth":0},{"p\
aram":41,"depth":0}],"velocity":[{"param":41,"depth":0},{"param":20,"depth":0},{\
"param":21,"depth":0},{"param":41,"depth":0}]},"sample":"FFFFFFFF000000000000000\
000000000","position":0,"params":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":20,"wa\
v":6,"mod":0,"sph":0,"mul":4},"smp":{"end":120,"lev":0,"fin":64,"smp":0,"sta":0,\
"brr":0,"tun":64,"lop":0},"fil":{"frq":70,"res":105,"sus":0,"rel":64,"atk":0,"en\
v":64,"dec":64,"typ":2},"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"pan":6\
4,"vol":110,"dec":127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"5":1,"\
6":64,"7":64}},"type":"sound","settings":{"chromatic":3,"legacyfx":0,"envreset":\
2,"machine":"nois","velocity":1},"tags":[],"name":"NEW SOUND"},{"modulations":{"\
aftertouch":[{"param":20,"depth":16},{"param":41,"depth":0},{"param":41,"depth":\
0},{"param":41,"depth":0}],"velocity":[{"param":41,"depth":0},{"param":20,"depth\
":0},{"param":21,"depth":0},{"param":41,"depth":0}]},"sample":"FFFFFFFF000000000\
000000000000000","position":0,"params":{"lfo":{"dep":0,"spd":112,"fad":64,"dst":\
20,"wav":6,"mod":0,"sph":0,"mul":4},"smp":{"end":120,"lev":0,"fin":64,"smp":0,"s\
ta":0,"brr":0,"tun":64,"lop":0},"fil":{"frq":70,"res":105,"sus":0,"rel":64,"atk"\
:0,"env":64,"dec":64,"typ":2},"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"atk":0,"\
pan":64,"vol":110,"dec":127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"4":0,"\
5":1,"6":64,"7":64}},"type":"sound","settings":{"chromatic":3,"legacyfx":0,"envr\
eset":2,"machine":"nois","velocity":1},"tags":[],"name":"NEW SOUND"},{"modulatio\
ns":{"aftertouch":[{"param":20,"depth":16},{"param":41,"depth":0},{"param":41,"d\
epth":0},{"param":41,"depth":0}],"velocity":[{"param":41,"depth":0},{"param":20,\
"depth":0},{"param":21,"depth":0},{"param":41,"depth":0}]},"sample":"FFFFFFFF000\
000000000000000000000","position":0,"params":{"lfo":{"dep":0,"spd":112,"fad":64,\
"dst":20,"wav":6,"mod":0,"sph":0,"mul":4},"smp":{"end":120,"lev":0,"fin":64,"smp\
":0,"sta":0,"brr":0,"tun":64,"lop":0},"fil":{"frq":70,"res":105,"sus":0,"rel":64\
,"atk":0,"env":64,"dec":64,"typ":2},"amp":{"del":0,"rev":96,"acc":32,"ovr":0,"at\
k":0,"pan":64,"vol":110,"dec":127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3":17,"\
4":0,"5":1,"6":64,"7":64}},"type":"sound","settings":{"chromatic":3,"legacyfx":0\
,"envreset":2,"machine":"nois","velocity":1},"tags":[],"name":"NEW SOUND"},{"mod\
ulations":{"aftertouch":[{"param":20,"depth":16},{"param":41,"depth":0},{"param"\
:41,"depth":0},{"param":41,"depth":0}],"velocity":[{"param":41,"depth":0},{"para\
m":20,"depth":0},{"param":21,"depth":0},{"param":41,"depth":0}]},"sample":"FFFFF\
FFF000000000000000000000000","position":0,"params":{"lfo":{"dep":0,"spd":112,"fa\
d":64,"dst":20,"wav":6,"mod":0,"sph":0,"mul":4},"smp":{"end":120,"lev":0,"fin":6\
4,"smp":0,"sta":0,"brr":0,"tun":64,"lop":0},"fil":{"frq":70,"res":105,"sus":0,"r\
el":64,"atk":0,"env":64,"dec":64,"typ":2},"amp":{"del":0,"rev":96,"acc":32,"ovr"\
:0,"atk":0,"pan":64,"vol":110,"dec":127,"hld":0},"syn":{"0":127,"1":127,"2":5,"3\
":17,"4":0,"5":1,"6":64,"7":64}},"type":"sound","settings":{"chromatic":3,"legac\
yfx":0,"envreset":2,"machine":"nois","velocity":1},"tags":[],"name":"NEW SOUND"}\
],"performance":[[{"track":0,"param":1,"value":0},{"track":0,"param":2,"value":1\
6},{"track":8,"param":8,"value":40},{"track":9,"param":8,"value":40},{"track":10\
,"param":8,"value":40}],[{"track":0,"param":1,"value":72},{"track":0,"param":2,"\
value":24},{"track":0,"param":29,"value":127},{"track":0,"param":28,"value":127}\
],null,null,null,null,null,null,null,null,null,null],"scenes":[[{"track":0,"para\
m":2,"value":79},{"track":0,"param":6,"value":2}],[{"track":0,"param":2,"value":\
79},{"track":0,"param":6,"value":2},{"track":8,"param":2,"value":0},{"track":9,"\
param":13,"value":6},{"track":10,"param":13,"value":6},{"track":10,"param":15,"v\
alue":113}],[{"track":0,"param":2,"value":79},{"track":0,"param":6,"value":2},{"\
track":8,"param":2,"value":0},{"track":9,"param":13,"value":6},{"track":10,"para\
m":13,"value":6},{"track":10,"param":15,"value":113},{"track":0,"param":22,"valu\
e":2},{"track":5,"param":2,"value":46},{"track":5,"param":1,"value":36},{"track"\
:5,"param":4,"value":100},{"track":5,"param":0,"value":91}],null,null,null,null,\
null,null,null,null,null],"position":7,"fx":{"cmp":{"rat":1,"mix":0,"rel":6,"vol\
":100,"atk":3,"mup":33,"thr":101,"seq":3},"lfo":{"dep":0,"spd":112,"fad":64,"dst\
":37,"wav":2,"mod":0,"sph":0,"mul":4},"rev":{"hpf":89,"gai":32,"pre":93,"vol":10\
0,"dec":122,"lpf":62,"frq":24},"del":{"x":1,"tim":11,"rev":80,"vol":45,"wid":74,\
"fdb":45,"lpf":47,"hpf":78},"dst":{"del":0,"rev":0,"sym":64,"dov":0,"amt":0}},"r\
etrig":[{"on":false,"length":46,"velocity":0,"rate":9},{"on":false,"length":46,"\
velocity":0,"rate":9},{"on":false,"length":46,"velocity":0,"rate":9},{"on":false\
,"length":46,"velocity":0,"rate":9},{"on":false,"length":46,"velocity":0,"rate":\
9},{"on":false,"length":46,"velocity":0,"rate":9},{"on":false,"length":46,"veloc\
ity":0,"rate":9},{"on":false,"length":46,"velocity":0,"rate":9},{"on":false,"len\
gth":46,"velocity":0,"rate":9},{"on":false,"length":46,"velocity":0,"rate":9},{"\
on":false,"length":46,"velocity":0,"rate":9},{"on":false,"length":46,"velocity":\
0,"rate":9}],"type":"kit","name":"LEAK"}`






