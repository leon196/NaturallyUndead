
function MainScene ()
{
	Scene.call(this); 

	this.init = function (time)
	{
		this.camera.fov = 25 * Math.PI / 180;
		this.camera.position = blender.getVector3("CameraAction", "location");
		this.camera.target = blender.getVector3("TargetAction", "location");

		this.vegetation = new PointCloud("vegetation.ply", 20);
		this.vegetation.setLeafSize([0.3, 1.5]);
		this.vegetation.position = blender.getVector3("VegetationAction", "location");
		this.vegetation.orientation = blender.getRotation("VegetationAction");

		this.bush = new Bush([16,16,16]);
		this.bush.setVoxelSize(0.5);
		this.bush.setLeafSize([1.2, 16.]);
		this.bush.setDisplacementScale([4, 0.1, 4]);
		this.bush.setNoiseScale([0.5, 0.5, 0.5]);

		this.currentCurve = 1;

		for (var c = 1; c <= 5; ++c) {
			var curveArray = curveToArray(assets["curve" + c + ".3d"]);
			var width = Math.ceil(curveArray.length / 4.);
			this["curve" + c] = twgl.createTexture(gl, { type: gl.FLOAT, min: gl.LINEAR, mag: gl.LINEAR, wrap: gl.CLAMP_TO_EDGE, width: width, height: 1, src: curveArray });
		}

		this.bamboo = new Bamboo(this.curve1);
		this.character = new Character(this.curve1);

		this.skull = new Skull();

		this.moss = new Moss(createMesh(assets["skull.ply"]));
		this.mossLeafSize = [0.5, 4.];
		this.moss.setLeafSize(this.mossLeafSize);
		this.moss.setCurve(this.curve1);
		this.moss.setColors([152. / 255., 177. / 255., 109. / 255.], [35. / 255., 66. / 255., 9. / 255.]);

		this.mossRed = new Moss(createMesh(assets["skull.ply"]));
		this.mossRed.setLeafSize([0.5, 2.]);
		this.mossRed.setColors([0.8, 0.08, 0.15], [0.07, 0, 0]);
		this.mossRed.setRadius(3);

		this.grid = new Entity(createGrid(), assets["color.vert"], assets["color.frag"]);
		this.grid.displayType = gl.LINES;

		this.targetBush = new Entity(createWiredCube(), assets["color.vert"], assets["color.frag"]);
		this.targetBush.displayType = gl.LINES;

		// this.targetBoids = new Entity(createWiredCube(), assets["color.vert"], assets["color.frag"]);
		// this.targetBoids.displayType = gl.LINES;

		this.butterflies = new Butterflies();

		this.painting = new Painting(createQuads(gl, 128, 128, { x: 0.5, y: 0.5 }));
		this.painting.setSize([0.04, 0.08]);
		this.paintingFrame = new FrameBuffer();
		this.paintingFrame.createBuffer(gl, gl.drawingBufferWidth, gl.drawingBufferHeight, 1);

		// this.textTitle = new CoolText("Naturally\nUndead\nEvoke 2016", 0, 7);//, ["rgb(0,250,0)", "rgb(250,0,0)", "white"]);
		this.textTitle2 = new CoolText("Naturally\nUndead\nEvoke 2016", 100, 8);//, ["rgb(0,250,0)", "rgb(250,0,0)", "white"]);
		this.textCredits1 = new CoolText("Visual by\nPONK\nMusic by\nDOK", 108, 8);
		// this.textCredits2 = new CoolText("Skull scanned by\nDoug Boyer from\nDuke University", 169, 12);
		this.textCredits3 = new CoolText("First Demo Ever", 116, 8);
		this.textCredits4 = new CoolText("Still LJ Fairlight\nConspiracy\nASD Mercury\nrgba Farbrausch", 124, 6);
		this.textCredits5 = new CoolText("Cocoon Xmen\nPoobrain\nLNX Triple A\nOne Studio Off\nRazor 1911", 130, 6);
		this.textCredits6 = new CoolText("Cyclades\nThe Cybernetics\nSt Connexion \nThe Overlanders\nYoyoST The Mysfits\nSector One", 136, 6);
		this.textCredits7 = new CoolText("No Extra TMP STIron\nFLUSH TRSI\nSOS SOosoWsKy\nThe Tourist Phaazon", 142, 6);
		this.textCredits8 = new CoolText("We Love You", 148, 6);
		
		this.textArray = [];
		// this.textArray.push(this.textTitle);
		this.textArray.push(this.textTitle2);
		this.textArray.push(this.textCredits1);
		this.textArray.push(this.textCredits3);
		this.textArray.push(this.textCredits4);
		this.textArray.push(this.textCredits5);
		this.textArray.push(this.textCredits6);
		this.textArray.push(this.textCredits7);
		this.textArray.push(this.textCredits8);
		// this.textArray.push(this.textCredits;

		// this.video = new Video("assets/videos/dance1.mp4");
		// this.opticalFlow = new OpticalFlow();

		// this.addEntity(this.grid);
		this.addEntity(this.skull);
		this.addEntity(this.bamboo);
		this.addEntity(this.character);
		this.addEntity(this.moss);
		this.addEntity(this.mossRed);
		this.addEntity(this.butterflies);
		this.addEntity(this.vegetation);
		// this.addEntity(this.bush);
		// this.addEntity(this.text);
		// this.addEntity(this.targetBush);
		// this.addEntity(this.targetBoids);
		// this.textTest = new CoolText("Text", 3 * 60 + 10, 1000);
		// this.textArray.push(this.textTest);

		this.time = 0;//3 * 60 + 10;
		// console.log(music.currentTime);
		// music.currentTime = 40;
		// console.log(music.currentTime);
		this.start = Date.now() - this.time * 1000;
	};

	this.setCurve = function (curve)
	{
		var shouldLoop = this.currentCurve == 5 ? 1 : 0;

		if (this.currentCurve == 5) {
			this.moss.setRadius(5);
		}

		this.bamboo.setCurve(curve, shouldLoop);
		this.character.setCurve(curve, shouldLoop);
		this.moss.setCurve(curve, shouldLoop);
	};

	this.getCurrentCurveRatio = function ()
	{
		return "Curve" + this.currentCurve + "Action";
	};

	this.update = function ()
	{
		// camera
		this.camera.position = blender.evaluate("CameraAction", "location", this.time);
		this.camera.target = blender.evaluate("TargetAction", "location", this.time);

		// this.camera.orbitControl();
		// this.camera.position[1] = 1;

		var currentCurve = Math.floor(blender.evaluate("CurrentCurveAction", "location", this.time)[0]);
		if (currentCurve != this.currentCurve) {
			this.currentCurve = currentCurve;
			this.setCurve(this["curve" + this.currentCurve]);
		}

		// curve
		var curveRatio = blender.evaluate(this.getCurrentCurveRatio(), "eval_time", this.time)[0] / 100;
		this.bamboo.setCurveRatio(curveRatio);
		this.character.setCurveRatio(curveRatio);
		this.moss.setCurveRatio(curveRatio);

		// skull
		var fadeValue = blender.evaluate("BoneFadeValueAction", "location", this.time)[0];
		var shineValue = blender.evaluate("BoneShineValueAction", "location", this.time)[0];
		this.skull.setFadeValue(fadeValue);
		this.skull.setShineValue(shineValue);

		// moss
		var mossValue = blender.evaluate("MossFadeValueAction", "location", this.time)[0];
		this.moss.setLeafSize([this.mossLeafSize[0] * mossValue, this.mossLeafSize[1] * mossValue]);
		this.mossRed.setTarget(this.butterflies.getTarget());

		// character
		var characterValue = blender.evaluate("CharacterValueAction", "location", this.time)[0];
		this.character.setValue(characterValue);

		// butterflies
		var boidsValue = blender.evaluate("BoidsValueAction", "location", this.time)[0];
		this.butterflies.setBoidsValue(boidsValue);
		this.butterflies.target = blender.evaluate("TargetBoidsAction", "location", this.time);
		if (this.butterflies.hasStarted == false && boidsValue > 0) {
			this.butterflies.hasStarted = true;
			this.butterflies.resetAtTarget();
		}
		this.butterflies.update();

		// vegetation
		var targetVegetation = blender.evaluate("TargetVegetationAction", "location", this.time);
		this.vegetation.setTarget(targetVegetation);
		this.vegetation.position = blender.evaluate("VegetationAction", "location", this.time);
		var orientationVegetation = blender.evaluate("VegetationAction", "rotation_euler", this.time);
		orientationVegetation[0] -= Math.PI * 0.5;
		this.vegetation.orientation = orientationVegetation;

		this.vegetation.shader.uniforms.u_value = blender.evaluate("VegetationValueAction", "location", this.time)[0];
		// this.vegetation.setTarget(this.butterflies.getTarget());
		// this.targetBush.position = targetVegetation;

		// planetVideo.update(this.cooldown.elapsed);

		// bush
		// var bushTargetAngle = this.time * 0.2;
		// var bushTargetRadius = 1;
		// this.bush.setValue(blender.evaluate("BushValueAction", "location", this.time)[0]);
		// this.bush.setTarget([Math.cos(bushTargetAngle) * 4, 0, Math.sin(bushTargetAngle) * 4]);

		this.draw();

		// TEXTS
		twgl.bindFramebufferInfo(gl, this.paintingFrame.getFrameBuffer());
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		for (var i = 0; i < this.textArray.length; ++i) {
			this.textArray[i].drawText(this.time);
		}
		twgl.bindFramebufferInfo(gl, null);
		this.painting.draw(this.paintingFrame.getTexture(), this.time);

		// this.opticalFlow.draw(planetVideo, this.camera);
	};
}

MainScene.prototype = Object.create(Scene.prototype);
MainScene.prototype.constructor = MainScene;