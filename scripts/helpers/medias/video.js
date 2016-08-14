
function Video (videoSrc, loop)
{
	this.element = document.createElement("video");
	this.element.src = videoSrc;
	this.element.type = "video/mp4";
	this.element.loop = loop || true;
	this.element.autoplay = false;
	this.element.preload = "auto";
	this.element.muted = true;
	this.element.load();
	// this.element.addEventListener('loadeddata', function() { this.play(); }, false);

	this.frameRate = 24;
	this.delay = 1 / this.frameRate;
	this.start = 0;

	this.texture = null;
	this.frameBuffer = null;
	this.planeBuffer = twgl.createBufferInfoFromArrays(gl, createPlane());
	this.shader = new Shader("precision mediump float; attribute vec2 a_texcoord; attribute vec4 a_position; varying vec2 v_texCoord; void main () { v_texCoord = a_texcoord; gl_Position = a_position; }", 
		"precision mediump float; float luminance ( vec3 color ) { return (color.r + color.g + color.b) / 3.0; }  vec4 edge (sampler2D bitmap, vec2 uv, vec2 dimension) { 	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);  	color += -1.0 * texture2D(bitmap, uv + vec2(-2, -2) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-2, -1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  0) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  2) / dimension);  	color += -1.0 * texture2D(bitmap, uv + vec2(-1, -2) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-1, -1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  0) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  2) / dimension);  	color += -1.0 * texture2D(bitmap, uv + vec2( 0, -2) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 0, -1) / dimension); 	color += 24.0 * texture2D(bitmap, uv + vec2( 0,  0) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 0,  1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 0,  2) / dimension);  	color += -1.0 * texture2D(bitmap, uv + vec2( 1, -2) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 1, -1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  0) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  2) / dimension);  	color += -1.0 * texture2D(bitmap, uv + vec2( 2, -2) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 2, -1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  0) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  1) / dimension); 	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  2) / dimension);  	return color; } uniform vec2 u_videoResolution; uniform sampler2D u_video; uniform sampler2D u_videoCurrent; uniform vec2 u_resolution; varying vec2 v_texCoord; void main () { vec2 uv = gl_FragCoord.xy / u_resolution.xy; vec4 color = vec4(1.); color.rgb *= clamp(luminance(edge(u_video, v_texCoord, u_videoResolution).rgb), 0., 1.); color.rgb = step(0.25, color.rgb); color.rgb += texture2D(u_videoCurrent, v_texCoord).rgb * 0.9; color.rgb = clamp(color.rgb, 0., 1.); gl_FragColor = color; }");
	this.uniforms = {
		u_video: 0,
		u_videoResolution: [1,1],
		u_videoCurrent: 0,
		u_videoLast: 0,
	};

	this.isSeeking = false;

	this.slider = document.getElementById("slider");

	this.isLoaded = function ()
	{
		return this.element.readyState > 3;
	};

	this.isReady = function ()
	{
		return this.texture != null;
	};

	this.createTexture = function ()
	{
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		this.frameBuffer = new FrameBuffer();
		this.frameBuffer.createBuffer(gl, this.element.videoWidth, this.element.videoHeight, 3);
	};

	this.update = function (time)
	{
		if (this.isLoaded())
		{
			// setup video teture
			if (this.isReady() == false)
			{
				this.createTexture(gl);	
				this.uniforms.u_video = this.texture;
				this.uniforms.u_videoResolution = [this.element.videoWidth, this.element.videoHeight];
			}

			// update slider cursor
			if (this.isSeeking == false && this.slider) 
			{
				this.slider.value = this.element.currentTime / this.element.duration;
			}

			// update gl texture
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.element);

			if (this.start + this.delay < time)
			{
				this.start = time;
				
				// update frame buffer ping pong
				this.uniforms.u_videoCurrent = this.frameBuffer.getTexture();
				this.frameBuffer.swap();
				this.uniforms.u_videoLast = this.frameBuffer.getTexture();
				this.frameBuffer.swap();

				// apply shader on video
				twgl.bindFramebufferInfo(gl, this.frameBuffer.getFrameBuffer());
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.useProgram(this.shader.program);
				twgl.setBuffersAndAttributes(gl, this.shader.info, this.planeBuffer);
				twgl.setUniforms(this.shader.info, this.uniforms);
				twgl.drawBufferInfo(gl, gl.TRIANGLES, this.planeBuffer);
				twgl.bindFramebufferInfo(gl, null);
			}
		}
	};

	this.seek = function (e)
	{
		this.isSeeking = true;
	};

	this.resume = function (e)
	{
		this.element.currentTime = this.slider.value * this.element.duration;
		this.isSeeking = false;
	};

	if (this.slider)
	{
		var self = this;
		this.slider.addEventListener("mousedown", function (e) { self.seek(e); });
		this.slider.addEventListener("mouseup", function (e) { self.resume(e); });
	}
}