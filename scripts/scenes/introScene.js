
function IntroScene ()
{
	Scene.call(this);

	this.camera.position = [0,0,-5];

	this.leafSize = [0.02, 0.1];

	this.cooldown.delay = 10;
	this.cooldownFadeIn = new Cooldown(this.time, 3);
	this.cooldownBeforeSplash = new Cooldown(this.time, 30);
	this.cooldownSplash = new Cooldown(this.time, 2);

	this.state = 0;

	this.init = function ()
	{
		planetVideo.element.play();
		this.start = Date.now();

		this.painting = new OpticalFlow(createQuads(gl, 128, 128, { x: 0.5, y: 0 }), "painting.vert");
		this.painting.setSize(this.leafSize);
	};

	this.update = function ()
	{
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.time = (Date.now() - this.start) / 1000;
		this.cooldown.update(this.time);

		switch (this.state) {
			case 0: {
				if (this.cooldownFadeIn.isOver() == false) {
					this.cooldownFadeIn.update(this.time);
				} else {
					this.cooldownBeforeSplash.start(this.time);
					this.state = 1;
				}
				break;
			}
			case 1: {
				if (this.cooldownBeforeSplash.isOver() == false) {
					this.cooldownBeforeSplash.update(this.time);
				} else {
					this.cooldownSplash.start(this.time);
					this.state = 2;
				}
				break;
			}
			case 2: {
				this.cooldownSplash.update(this.time);
			}
		}

		this.painting.shader.uniforms.u_splashRatio = this.cooldownSplash.ratio;
		this.painting.setSize([this.leafSize[0] * this.cooldownFadeIn.ratio, this.leafSize[1] * this.cooldownFadeIn.ratio]);

		planetVideo.update(this.cooldown.elapsed);
		this.painting.drawVideo(planetVideo, this.camera, this.time);
	};
}

IntroScene.prototype = Object.create(Scene.prototype);
IntroScene.prototype.constructor = IntroScene;