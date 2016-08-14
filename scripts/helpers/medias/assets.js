var assets = {};

function loadAssets() {
	loadFiles(
		["assets/clouds/vegetation.ply", 
		"assets/images/bamboo.jpg", 
		"assets/images/character.png", 
		"assets/images/leaf.png", 
		"assets/meshes/bamboo.ply", 
		"assets/meshes/character.ply", 
		"assets/meshes/curve1.3d", 
		"assets/meshes/curve2.3d", 
		"assets/meshes/curve3.3d", 
		"assets/meshes/curve4.3d", 
		"assets/meshes/curve5.3d", 
		"assets/meshes/skull.ply", 
		"assets/meshes/skullFlat.ply", 
		"assets/shaders/mesh/bamboo.vert", 
		"assets/shaders/mesh/bone.vert", 
		"assets/shaders/mesh/character.vert", 
		"assets/shaders/particles/arrow.vert", 
		"assets/shaders/particles/bush.vert", 
		"assets/shaders/particles/butterfly.vert", 
		"assets/shaders/particles/flow.vert", 
		"assets/shaders/particles/leaf.vert", 
		"assets/shaders/particles/moss.vert", 
		"assets/shaders/particles/painting.vert", 
		"assets/shaders/simple/circle.vert", 
		"assets/shaders/simple/color.frag", 
		"assets/shaders/simple/color.vert", 
		"assets/shaders/simple/mesh.vert", 
		"assets/shaders/simple/painting.frag", 
		"assets/shaders/simple/plane.vert", 
		"assets/shaders/simple/render.frag", 
		"assets/shaders/simple/simple.vert", 
		"assets/shaders/simple/texture.frag", 
		"assets/shaders/simple/video.frag", 
		"assets/shaders/utils/header.glsl", 
		"assets/shaders/opticalflow.frag"], 
		function (error, content) { 
		assets = content;
		assetsIsLoaded = true;
	});
}

// assets.loaded = false;
// assets.totalCount = 0;
// assets.filesToLoad = 0;
// assets.directoriesToLoad = 0;

// assets.areLoaded = function ()
// {
// 	return assets.loaded;//assets.filesToLoad + assets.directoriesToLoad === 0;
// };

// assets.load = function ()
// {
// };

function addHeaderToShaders ()
{
	for (var key in assets) {
		var k = key.split(".");
		if (assets.hasOwnProperty(key) && (k[1] === "vert" || k[1] === "frag")) {
			assets[key] = assets["header.glsl"] + assets[key];
		}
	}
};

// assets.storeFile = function (error, file, filename)
// {
// 	if (error == null) {
// 		assets[filename] = file;
// 	} else {
// 		console.log(error);
// 	}
// };


// assets.loadDirectory = function (dir)
// {
// 	++assets.directoriesToLoad;
// 	$.ajax({ url: dir, success: function (data) {
// 		$(data).find("a").each(function (index, element) {
// 			var filename = this.href.replace(window.location.host, "").replace("http://", "").replace("/", "");
// 			var extension = filename.split(".");
// 			if (extension.length > 1) {
// 				++assets.filesToLoad;
// 				++assets.totalCount;
// 				loadFile(dir + filename, function (error, file) { 
// 					assets.storeFile(error, file, filename); 
// 					--assets.filesToLoad;
// 				});
// 			} else {
// 				assets.loadDirectory(dir + filename);
// 			}
// 		});
// 		--assets.directoriesToLoad;
// 	}});
// };