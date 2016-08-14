
function Entity (bufferArray, vertexShader, pixelShader, uniforms)
{
	this.buffer = twgl.createBufferInfoFromArrays(gl, bufferArray);
	
	this.shader = new Shader(vertexShader, pixelShader, uniforms);
	this.shader.uniforms.u_time = 0;
	this.shader.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight];
	this.shader.uniforms.u_view = m4.identity();
	this.shader.uniforms.u_world = m4.identity();
	this.shader.uniforms.u_cameraDirection = [0,0,1];

	this.displayType = gl.TRIANGLES;
	this.position = [0, 0, 0];
	this.orientation = [0, 0, 0];
	this.scale = [1, 1, 1];
	this.anchor = [0, 0, 0];
	this.matrix = new Float32Array(16);

	// this.axis = new Dummy(createAxis());

	this.draw = function (camera, time)
	{
		m4.translation(this.position, this.matrix);
		m4.rotateX(this.matrix, this.orientation[0], this.matrix);
		m4.rotateY(this.matrix, this.orientation[1], this.matrix);
		m4.rotateZ(this.matrix, this.orientation[2], this.matrix);
		m4.translate(this.matrix, this.anchor, this.matrix);
		m4.scale(this.matrix, this.scale, this.matrix);

		this.shader.uniforms.u_world = this.matrix;
		m4.multiply(this.matrix, camera.viewProjection, this.shader.uniforms.u_view);

		this.shader.uniforms.u_time = time || 0;
		this.shader.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight];

		this.shader.uniforms.u_cameraDirection[0] = camera.target[0] - camera.position[0];
		this.shader.uniforms.u_cameraDirection[1] = camera.target[1] - camera.position[1];
		this.shader.uniforms.u_cameraDirection[2] = camera.target[2] - camera.position[2];

		gl.useProgram(this.shader.program);
		twgl.setBuffersAndAttributes(gl, this.shader.info, this.buffer);
		twgl.setUniforms(this.shader.info, this.shader.uniforms);
		twgl.drawBufferInfo(gl, this.displayType, this.buffer);

		// this.axis.matrix = this.matrix;
		// this.axis.draw(camera);
	};

	this.translate = function (x, y, z)
	{
		this.position[0] += x;
		this.position[1] += y;
		this.position[2] += z;
	};

	this.translation = function (x, y, z)
	{
		this.position[0] = x;
		this.position[1] = y;
		this.position[2] = z;
	};

	this.rotate = function (x, y, z)
	{
		this.orientation[0] += x;
		this.orientation[1] += y;
		this.orientation[2] += z;
	};

	this.rotation = function (x, y, z)
	{
		this.orientation[0] = x;
		this.orientation[1] = y;
		this.orientation[2] = z;
	};

	this.scaling = function (x, y, z)
	{
		y = y || x;
		z = z || x;
		this.scale[0] = x;
		this.scale[1] = y;
		this.scale[2] = z;
	};

	this.setAnchor = function (x, y, z)
	{
		this.anchor[0] = x;
		this.anchor[1] = y;
		this.anchor[2] = z;
	};

	this.setUniform = function (uniformName, value)
	{
		this.shader.uniforms[uniformName] = value;
	};
}