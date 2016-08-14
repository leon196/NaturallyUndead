
function Dummy (bufferArray)
{
	this.buffer = twgl.createBufferInfoFromArrays(gl, bufferArray);
	this.shader = new Shader( 
		"precision mediump float; attribute vec4 a_position; attribute vec4 a_color; uniform mat4 u_view; varying vec4 v_color; void main() { v_color = a_color; gl_Position = u_view * a_position; }",
		"precision mediump float; varying vec4 v_color; void main () { gl_FragColor = v_color; }",
		{ u_view: m4.identity() });
	this.displayType = gl.LINES;
	this.matrix = new Float32Array(16);

	this.draw = function (camera)
	{
		m4.multiply(this.matrix, camera.viewProjection, this.shader.uniforms.u_view);
		gl.useProgram(this.shader.program);
		twgl.setBuffersAndAttributes(gl, this.shader.info, this.buffer);
		twgl.setUniforms(this.shader.info, this.shader.uniforms);
		twgl.drawBufferInfo(gl, this.displayType, this.buffer);
	};
}