
function LoadingScene ()
{
	Scene.call(this); 

	this.alpha = true;

	this.init = function (time)
	{
		this.camera.fov = 90;
		this.camera.position = [0, 0, 3];

		this.cube = new Entity (
			createWiredCube(1), 
			"precision mediump float; attribute vec4 a_position; uniform mat4 u_view; void main() { gl_Position = u_view * a_position; }", 
			"precision mediump float; uniform float u_alpha; void main () { gl_FragColor = vec4(vec3(1), u_alpha); }", { 
				u_view: m4.identity(),
				u_alpha: 1,
			}
		);
		this.cube.displayType = gl.LINES;
		this.addEntity(this.cube);

		this.loadingText = text.makeSimpleText("assets loading...", "monospace", 40, [0.005, 0.005]);
		this.loadedText = text.makeSimpleText("assets loaded!", "monospace", 40, [0.005, 0.005]);
		this.text = new Entity (
			createPlane(), 
			"precision mediump float; attribute vec4 a_position; attribute vec2 a_texcoord; uniform mat4 u_view; varying vec2 v_uv; void main() { v_uv = vec2(a_texcoord.x, 1. - a_texcoord.y); gl_Position = u_view * a_position; }", 
			"precision mediump float; uniform sampler2D u_texture; uniform float u_alpha; varying vec2 v_uv; void main () { vec4 color = texture2D(u_texture, v_uv); color.a *= u_alpha; gl_FragColor = color; }", { 
				u_view: m4.identity(),
				u_texture: this.loadingText.texture,
				u_alpha: 1,
			}
		);
		this.text.scale = this.loadingText.scale;
		this.addEntity(this.text);
	};

	this.update = function ()
	{
		this.cube.setUniform("u_alpha", this.cooldown.ratio); 
		this.cube.scaling(this.cooldown.ratio, this.cooldown.ratio, this.cooldown.ratio);
		this.cube.rotation(this.cooldown.elapsed * 2, this.cooldown.elapsed, 0);
		this.text.setUniform("u_alpha", this.cooldown.ratio); 

		this.draw();
	};

	this.loaded = function ()
	{
		this.text.setUniform("u_texture", this.loadedText.texture); 
		this.text.scale = this.loadedText.scale;
		this.cooldown.reverse();
	};
}

LoadingScene.prototype = Object.create(Scene.prototype);
LoadingScene.prototype.constructor = LoadingScene;