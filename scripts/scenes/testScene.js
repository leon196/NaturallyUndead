
function TestScene ()
{
	Scene.call(this); 

	this.init = function (time)
	{
		this.camera.position = [0, 2, -5];
		this.camera.target = [0, 2, 0];

		this.vegetation = new PointCloud("vegetation.ply", 20);
		this.vegetation.setLeafSize([0.2, 0.1]);
		this.vegetation.position[1] = 2;

		this.bush = new Bush([8,8,8]);
		this.bush.setVoxelSize(1.);
		this.bush.setLeafSize([0.3, 4.]);
		this.bush.setDisplacementScale([0.5, 0.1, 0.5]);
		this.bush.setNoiseScale([0.5, 0.5, 0.5]);

		var curveArray = curveToArray(assets["curve.3d"]);
		var curve = twgl.createTexture(gl, { type: gl.FLOAT, min: gl.LINEAR, mag: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE, width: Math.ceil(curveArray.length / 4.), height: 1, src: curveArray });

		this.bamboo = new Bamboo(curve);

		this.character = new Character();

		this.hand = new Mesh({
			meshName: "hand.ply",
			textureSrc: [0,0,0,1],
			vertexShader: "bone.vert",
			pixelShader: "color.frag",
			wired: true,
		});
		this.hand.displayType = gl.LINES;
		this.hand.scaling(2);

		this.moss = new Moss(createMesh(assets["hand.ply"]));
		this.moss.setLeafSize([0.1, 0.5]);
		this.moss.scaling(2);

		this.grid = new Entity(createGrid(), assets["color.vert"], assets["color.frag"]);
		this.grid.displayType = gl.LINES;

		this.targetBush = new Entity(createWiredCube(), assets["color.vert"], assets["color.frag"]);
		this.targetBush.displayType = gl.LINES;

		this.targetBoids = new Entity(createWiredCube(), assets["color.vert"], assets["color.frag"]);
		this.targetBoids.displayType = gl.LINES;

		this.boidManager = new Butterflies();

		this.video = new Video("assets/videos/dance1.mp4");
		this.opticalFlow = new OpticalFlow();

		// this.addEntity(this.vegetation);
		// this.addEntity(this.bamboo);
		// this.addEntity(this.character);
		// this.addEntity(this.grid);
		// this.addEntity(this.targetBush);
		this.addEntity(this.moss);
		this.addEntity(this.hand);
		// this.addEntity(this.targetBoids);
		// this.addEntity(this.bush);
		// this.addEntity(this.boidManager);
	};

	this.update = function ()
	{
		// target
		// var speed = 0.3;
		// var radius = 4.;
		// this.targetBush.position = [Math.cos(this.cooldown.elapsed * speed) * radius, Math.sin(this.cooldown.elapsed * 2. * speed), Math.sin(this.cooldown.elapsed * speed) * radius];
		// this.targetBoids.position = [Math.cos(this.cooldown.elapsed * speed + Math.PI) * 2, 1, Math.sin(this.cooldown.elapsed * speed + Math.PI) * 2];

		// camera
		this.camera.orbitControl();
		this.camera.position[1] = 1;

		// uniforms
		// this.bush.setUniform("u_target", this.targetBush.position);
		// this.vegetation.setTarget(this.target);

		// boids
		// this.boidManager.update();
		// this.boidManager.target = this.targetBoids.position;

		// planetVideo.update(this.cooldown.elapsed);

		this.draw();
		// this.opticalFlow.draw(planetVideo, this.camera);
	};
}

TestScene.prototype = Object.create(Scene.prototype);
TestScene.prototype.constructor = TestScene;