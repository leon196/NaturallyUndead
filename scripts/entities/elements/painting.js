
function Painting (bufferArray, vertexShader)
{
	bufferArray = bufferArray || createQuads(gl, 512, 512, { x: 0.5, y: 0 });
	Entity.call(this, bufferArray, assets[vertexShader || "painting.vert"], assets["painting.frag"], {
		u_framebuffer: 0,
		u_videoResolution: [1,1],
		u_resolution: [1,1],
		u_video: 0,
		u_size: [0.1, 0.2],
		u_splashRatio: 0,
		u_view: m4.identity(),
		u_time: 0
		// u_texture: twgl.createTexture(gl, { src: "assets/images/leaf.png", flipY: true })
	});

	this.draw = function (image, time)
	{
		this.shader.uniforms.u_time = time;
		this.shader.uniforms.u_video = image;
		this.shader.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight];
		// this.shader.uniforms.u_videoResolution = [image.width, image.height];

		twgl.bindFramebufferInfo(gl, null);
		gl.useProgram(this.shader.program);
		twgl.setBuffersAndAttributes(gl, this.shader.info, this.buffer);
		twgl.setUniforms(this.shader.info, this.shader.uniforms);
		twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffer);
	};

	this.setSize = function (value)
	{
		this.shader.uniforms.u_size = value;
	};
}

Painting.prototype = Object.create(Entity.prototype);
Painting.prototype.constructor = Painting;