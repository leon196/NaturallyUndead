
function Skull ()
{
	Mesh.call(this, {
		meshName: "skullFlat.ply",
		textureSrc: [0,0,0,1],
		vertexShader: "bone.vert",
		pixelShader: "color.frag",
		wired: true,
	});

	this.displayType = gl.LINES;

	this.setFadeValue = function (value)
	{
		this.shader.uniforms.u_fadeValue = value;
	};

	this.setShineValue = function (value)
	{
		this.shader.uniforms.u_shineValue = value;
	};
}

Skull.prototype = Object.create(Mesh.prototype);
Skull.prototype.constructor = Skull;