
function Character (curve)
{
	Mesh.call(this, {
		meshName: "character.ply",
		textureSrc: "assets/images/character.png",
		vertexShader: "character.vert",
	});

	this.shader.uniforms.u_curve = curve;
	this.shader.uniforms.u_curveLoop = 0; 

	this.setCurve = function (value, shouldLoop) { 
		shouldLoop = shouldLoop || 0;
		this.shader.uniforms.u_curve = value; 
		this.shader.uniforms.u_curveLoop = shouldLoop; 
	};

	this.setCurveRatio = function (ratio)
	{
		this.shader.uniforms.u_curveRatio = ratio;
	};

	this.setValue = function (value) {
		this.shader.uniforms.u_size = value;
	};
}

Character.prototype = Object.create(Mesh.prototype);
Character.prototype.constructor = Character;