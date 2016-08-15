
var text = {};

text.makeSimpleText = function (message, font, fontSize, scale)
{
	font = font || "monospace";
	font = fontSize + "px " + font;
	scale = scale || [0.01, 0.01];
	var ctx = document.createElement("canvas").getContext("2d");
	ctx.font = font;
	ctx.canvas.width  = Math.ceil(ctx.measureText(message).width) + 2;
	ctx.canvas.height = fontSize + 10;
	ctx.font = font;
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(message, ctx.canvas.width / 2 | 0, ctx.canvas.height / 2 | 0);

	return {
		texture: twgl.createTexture(gl, { src: ctx.canvas }),
		scale: [ctx.canvas.width * scale[0], ctx.canvas.height * scale[1], 1],
	};
};

text.makeText = function (message, font, fontSize, scale, colors)
{
	font = font || "monospace";
	font = fontSize + "px " + font;
	scale = scale || [0.01, 0.01];
	var ctx = document.createElement("canvas").getContext("2d");
	ctx.font = font;
	ctx.canvas.width  = gl.drawingBufferWidth;//Math.ceil(ctx.measureText(message).width) + 2;
	ctx.canvas.height = gl.drawingBufferHeight;//fontSize + 10;
	ctx.font = font;
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	var maxWidth = 20;
	var lineHeight = fontSize;
	var words = message.split('\n');
	var line = '';

	colors = colors || [];
	if (colors.length == 0) {
		for (var i = 0; i < words.length; ++i) {
			colors.push("white");
		}
	}

	var x = ctx.canvas.width / 2;// | 0;
	var y = ctx.canvas.height / 2 - Math.max(0, words.length - 1) * lineHeight / 2;// | 0;

	for(var n = 0; n < words.length; n++) {
		// var testLine = line + words[n] + ' ';
		// if (n > 0) {
			line = words[n];
			ctx.fillStyle = colors[n];
			ctx.fillText(line, x, y);
			y += lineHeight;
		// } else {
		// 	line = testLine;
		// }
	}
	// ctx.fillStyle = colors[words.length - 1];
	// ctx.fillText(line, x, y);

	// ctx.fillText(message, ctx.canvas.width / 2 | 0, ctx.canvas.height / 2 | 0);

	return {
		texture: twgl.createTexture(gl, { src: ctx.canvas }),
		scale: [ctx.canvas.width * scale[0], ctx.canvas.height * scale[1], 1],
	};
};

function CoolText (message, start, delay, colors)
{
	Entity.call(this, 
		createPlane(), 
		"precision mediump float; attribute vec4 a_position; attribute vec2 a_texcoord; uniform mat4 u_view; varying vec2 v_uv; void main() { v_uv = a_texcoord; gl_Position = u_view * a_position; }", 
		"precision mediump float; uniform sampler2D u_texture; uniform float u_alpha; varying vec2 v_uv; void main () { vec4 color = texture2D(u_texture, v_uv); color.a *= u_alpha; gl_FragColor = color; }", { 
			u_view: m4.identity(),
			u_texture: 0,
			u_alpha: 1,
		}
	);
	this.text = text.makeText(message, "monospace", 32, [0.0075, 0.02], colors);
	this.shader.uniforms.u_texture = this.text.texture;
	// this.scale = this.text.scale;
	this.scale = [6, 6, 6];

	this.camera = {target:[0,0,0], position:[0,0,0], viewProjection:m4.identity()};

	this.start = start;
	this.delay = delay;

	this.drawText = function (elapsed)
	{
		// if (this.started == false && this.start <= elapsed) {
			var ratio = Math.max(0, Math.min(1, (elapsed - this.start) / this.delay));
			if (ratio < 1) {
				// ratio = Math.sin(elapsed * 0.2) * 0.5 + 0.5;
				ratio = smoothstep(0, 0.4, ratio) * (1 - smoothstep(0.6, 1.0, ratio));
				// ratio = Math.sin(elapsed) * 0.5 + 0.5;
				// ratio = smoothstep(0, 0.4, ratio) * (1 - smoothstep(0.7, 1.0, ratio));
				// this.text.position[1] = Math.sin(this.time * 0.1);
				this.shader.uniforms.u_alpha = ratio;
				this.draw(this.camera, elapsed);
			}
		// }
	};
}

CoolText.prototype = Object.create(Entity.prototype);
CoolText.prototype.constructor = CoolText;