
function Moss (mesh, leafSize)
{
	var points = [];

	var step = 1;

	for (var i = 0; i < mesh.position.data.length; i += 3 * step) {
		var point = { x: mesh.position.data[i], y: mesh.position.data[i+1], z: mesh.position.data[i+2] };
		point.normal = { x: mesh.normal.data[i], y: mesh.normal.data[i+1], z: mesh.normal.data[i+2] };
		point.color = { r: 1, g: 1, b: 1, a: 1 };
		points.push(point);
	}

	Entity.call(this, createLeaves(points), assets["moss.vert"], assets["color.frag"], {
		u_leafSize: leafSize || [0.1,0.1],
		u_curveLoop: 0,
		u_radius: 2,
		u_target: [0,0,0],
		u_followTarget: 0,
	});

	this.setLeafSize = function (value) { 
		this.shader.uniforms.u_leafSize = value; 
	};

	this.setCurve = function (value, shouldLoop) { 
		shouldLoop = shouldLoop || 0;
		this.shader.uniforms.u_curve = value; 
		this.shader.uniforms.u_curveLoop = shouldLoop; 
		this.shader.uniforms.u_followTarget = 0;
	};

	this.setCurveRatio = function (value) { 
		this.shader.uniforms.u_curveRatio = value; 
	};

	this.setRadius = function (value) {
		this.shader.uniforms.u_radius = value;
	};

	this.setTarget = function (value) {
		this.shader.uniforms.u_target = value;
		this.shader.uniforms.u_followTarget = 1;
	};

	this.setColors = function (colorA, colorB) {
		this.shader.uniforms.u_colorA = colorA;
		this.shader.uniforms.u_colorB = colorB;
	}
}

Moss.prototype = Object.create(Entity.prototype);
Moss.prototype.constructor = Moss;