
function Scene ()
{
	this.start = Date.now();
	this.time = 0;
	this.cooldown = new Cooldown(this.time);

	this.camera = new Camera();
	this.entityArray = [];

	this.alpha = false;

	this.init = function ()
	{
	};

	this.update = function ()
	{
		this.draw();
	};

	this.draw = function ()
	{
		gl.enable(gl.DEPTH_TEST);

		if (this.alpha) {
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	
		}

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		this.time = (Date.now() - this.start) / 1000;
		this.cooldown.update(this.time);
		this.camera.update();

		for (var i = 0; i < this.entityArray.length; ++i) {
			this.entityArray[i].draw(this.camera, this.time);
		}
	};

	this.addEntity = function (entity)
	{
		this.entityArray.push(entity);
	};
}