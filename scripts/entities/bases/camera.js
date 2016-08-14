
function Camera (fov, position, target)
{
	this.fov = (fov || 60) * Math.PI / 180;
	this.position = position || [0, 0, 0];
	this.target = target || [0, 0, 0];
	this.nearClip = 0.1;
	this.farClip = 1000;
	this.up = [0, 1, 0];

	this.view = m4.identity();
	this.world = m4.identity();
	this.camera = m4.identity();
	this.projection = m4.identity();
	this.viewProjection = m4.identity();

	this.rotationY = 0;
	this.rotationX = 0;
	this.distanceZ = 10;

	this.update = function ()
	{
		m4.perspective(this.fov, gl.drawingBufferWidth / gl.drawingBufferHeight, this.nearClip, this.farClip, this.projection);
		m4.lookAt(this.position, this.target, this.up, this.camera);
		m4.inverse(this.camera, this.view);
		m4.multiply(this.view, this.projection, this.viewProjection);
	};

	this.orbitControl = function ()
	{
		this.position[0] = this.target[0] + Math.cos(this.rotationY) * this.distanceZ;
		this.position[1] = this.target[1];
		this.position[2] = this.target[2] + Math.sin(this.rotationY) * this.distanceZ;

		this.rotationY += mouse.delta.x * 0.01;
		// this.rotationX -= mouse.delta.y * 0.01;
		this.distanceZ -= mouse.delta.y * 0.05;
	};
}