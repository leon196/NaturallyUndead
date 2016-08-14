
function Bamboo (curve)
{
	Entity.call(this, createMesh(assets["bamboo.ply"]), assets["bamboo.vert"], assets["texture.frag"], {
		u_texture: twgl.createTexture(gl, { src: "assets/images/bamboo.jpg" }),
		u_curve: curve,
		u_curveLoop: 0
	});

	this.setCurve = function (value, shouldLoop) { 
		shouldLoop = shouldLoop || 0;
		this.shader.uniforms.u_curve = value; 
		this.shader.uniforms.u_curveLoop = shouldLoop; 
	};

	this.setCurveRatio = function (ratio)
	{
		this.shader.uniforms.u_curveRatio = ratio;
	};
}

Bamboo.prototype = Object.create(Entity.prototype);
Bamboo.prototype.constructor = Bamboo;