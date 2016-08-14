
function Shader (vert, frag, uniforms)
{
	this.program = twgl.createProgramFromSources(gl, [vert, frag]);
	this.info = twgl.createProgramInfoFromProgram(gl, this.program);
	this.uniforms = uniforms || {};
}