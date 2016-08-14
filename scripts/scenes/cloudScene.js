
var cloudScene = {};

cloudScene.init = function (time)
{
	var self = this;

	this.camera = new Camera(80, blender.getVector3("camera", "location"), blender.getVector3("target", "location"));

	var leafSize = blender.getValue("leafSize", "scale");
	this.leafSize = [leafSize, leafSize * 2];

	var cloud = pointCloud.parse(assets["vegetation.ply"], 20);
	this.vegetation = new Entity(pointCloud.createBufferArray(cloud.points), "point.vert", "point.frag", {
		u_time: 0,
		u_resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight],
		u_view: m4.identity(),
		u_leafSize: self.leafSize,
	});
	this.vegetation.position = blender.getVector3("vegetation", "location");
	this.vegetation.orientation = blender.getRotation("vegetation");

	this.startTime = Date.now();
	this.time = 0;
	this.ratio = 0;
};

cloudScene.draw = function (time)
{
	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.BLEND);
	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var dt = (Date.now() - this.startTime) / 1000 - this.time;
	this.time = (Date.now() - this.startTime) / 1000;
	this.ratio = clamp(this.ratio + dt, 0, 1);

	this.camera.position = blender.evaluate("camera", "location", this.time);
	this.camera.update();

	this.vegetation.setUniform("u_time", this.time);
	this.vegetation.setUniform("u_resolution", [gl.drawingBufferWidth, gl.drawingBufferHeight]);
	this.vegetation.setUniform("u_leafSize", [this.leafSize[0] * this.ratio, this.leafSize[1] * 2 * this.ratio]);
	this.vegetation.draw(this.camera);
};