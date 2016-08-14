
function OpticalFlow (bufferArray, vertexShader)
{
	bufferArray = bufferArray || createArrows(gl, 128, 128, { x: 0.5, y: 0 });
	Entity.call(this, bufferArray, assets[vertexShader || "flow.vert"], assets["color.frag"], {
		u_opticalFlow: 0,
		u_videoResolution: [1,1],
		u_resolution: [1,1],
		u_videoCurrent: 0,
		u_videoLast: 0,
		u_size: [0.06, 0.2],
	});

	this.frameBuffer = null;

	this.planeBuffer = twgl.createBufferInfoFromArrays(gl, createPlane());
	this.opticalFlowShader = new Shader(assets["simple.vert"], assets["opticalflow.frag"]);

	this.draw = function (video, camera)
	{
		if (video.isReady()) 
		{
			if (this.frameBuffer == null) 
			{
				this.frameBuffer = new FrameBuffer([ 
					{ type: gl.FLOAT, min: gl.NEAREST, mag: gl.NEAREST, wrap: gl.CLAMP_TO_EDGE },
					{ format: gl.DEPTH_STENCIL, }]);
				this.frameBuffer.createBuffer(gl, video.element.videoWidth, video.element.videoHeight);
				this.shader.uniforms.u_videoResolution = [video.element.videoWidth, video.element.videoHeight];
			}

			this.shader.uniforms.u_opticalFlow = this.frameBuffer.getTexture();
			this.frameBuffer.swap();

			this.shader.uniforms.u_video = video.uniforms.u_video;
			this.shader.uniforms.u_videoCurrent = video.uniforms.u_videoCurrent;
			this.shader.uniforms.u_videoLast = video.uniforms.u_videoLast;
		
			this.shader.uniforms.u_view = camera.viewProjection;
			this.shader.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight];

			// optical process
			twgl.bindFramebufferInfo(gl, this.frameBuffer.getFrameBuffer());
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.useProgram(this.opticalFlowShader.program);
			twgl.setBuffersAndAttributes(gl, this.opticalFlowShader.info, this.planeBuffer);
			twgl.setUniforms(this.opticalFlowShader.info, this.shader.uniforms);
			twgl.drawBufferInfo(gl, gl.TRIANGLES, this.planeBuffer);
			twgl.bindFramebufferInfo(gl, null);

			gl.useProgram(this.shader.program);
			twgl.setBuffersAndAttributes(gl, this.shader.info, this.buffer);
			twgl.setUniforms(this.shader.info, this.shader.uniforms);
			twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffer);
		}
	};

	this.setSize = function (value)
	{
		this.shader.uniforms.u_size = value;
	};
}

OpticalFlow.prototype = Object.create(Entity.prototype);
OpticalFlow.prototype.constructor = OpticalFlow;