
function AudioAnalyser ()
{
	this.context = new (window.AudioContext || window.webkitAudioContext)();
	this.analyser = this.context.createAnalyser();

	this.streamSource = audioStreamSource.create({
		context: this.context,
		loop: true,
	});

	this.numPoints = this.analyser.frequencyBinCount | 0;
	this.spreadArray = new Float32Array(this.numPoints);
	this.heightArray = new Uint8Array(this.numPoints);

	for (var ii = 0; ii < this.numPoints; ++ii) {
		this.spreadArray[ii] = ii / this.numPoints * 2 - 1;  // make clipspace positions
	}
	this.arrays = {
		spread: { data: this.spreadArray, numComponents: 1 },
		height: { data: this.heightArray, numComponents: 1, drawType: gl.DYNAMIC_DRAW },
	};
	this.bufferInfo = twgl.createBufferInfoFromArrays(gl, this.arrays);

	this.startMusic = function () {
		this.analyser.getByteFrequencyData(this.heightArray);
		this.streamSource.play();
		this.streamSource.getSource().connect(this.analyser);
		this.analyser.connect(this.context.destination);
	}

	this.streamSource.on('error', function(e) {
		console.error("audio error:", e);  // eslint-disable-line
	});

	var self = this;
	this.streamSource.on('newSource', function(/* source */) {
		self.startMusic();
	});

	this.streamSource.setSource('assets/music.wav');
}