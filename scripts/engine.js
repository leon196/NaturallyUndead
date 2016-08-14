
var engine = {};

var State = { Loading: 0, LoadingFadeOut: 1, Intro: 2, Test: 3 };
engine.state = State.Loading;
engine.isReady = false;

var loadingScene, introScene, testScene;
var gl, m4 = twgl.m4;
var planetVideo;
var assetsIsLoaded = false;
var music;
var musicIsReady = false;

engine.init = function ()
{
	gl = twgl.getWebGLContext(document.getElementById("view"), { premultipliedAlpha: false, alpha: false  });
	gl.getExtension("OES_texture_float");
	gl.getExtension("OES_texture_float_linear");
	twgl.setDefaults({attribPrefix: "a_"});

	loadingScene = new LoadingScene();
	loadingScene.init();
	blender.init();

	music = document.getElementById("music");
	music.oncanplaythrough = function() {
		musicIsReady = true;
	};
	music.load();

	requestAnimationFrame(render);

	loadAssets();
};

function render (time) 
{
	requestAnimationFrame(render);

	if (!engine.isReady && assetsIsLoaded && musicIsReady) 
	{
		engine.isReady = true;
		addHeaderToShaders();
		loadingScene.loaded();

		testScene = new TestScene();
		introScene = new IntroScene();
		mainScene = new MainScene();
	}

	twgl.resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	mouse.update();

	switch (engine.state)
	{
		case State.Loading: {
			loadingScene.update();

			if (engine.isReady && loadingScene.cooldown.isOver()) {
				loadingScene = null;
				// introScene.init();
				// engine.state = State.Intro;
				// testScene.init();
				// engine.state = State.Test;
				music.play();
				mainScene.init();
				engine.state = State.Main;
				// audioAnalyser = new AudioAnalyser();
			}
			break;
		}
		case State.Intro: {
			introScene.update();

			if (introScene.cooldownSplash.isOver()) {
				introScene = null;
				testScene.init();
				engine.state = State.Test;
			}
			break;
		}
		case State.Test: {
			testScene.update();
			break;
		}
		case State.Main: {
			mainScene.update();
			break;
		}
	}
}