
window.onload = function () {
	engine.init();
};

/*
require.config({ urlArgs: "bust=" + (new Date()).getTime() });
var scripts = {};
scripts.nameList = [];
scripts.filesToLoad = 0;
scripts.directoriesToLoad = 0;
scripts.areLoaded = function ()
{
	return scripts.filesToLoad + scripts.directoriesToLoad === 0;
};

scripts.storeFileName = function (error, filename)
{
	if (error == null) {
		if (filename != "scripts/main.js" && filename != "scripts/require.js") {
			filename = filename.replace("scripts/", "").replace(".js", "");
			scripts.nameList.push(filename);
		}
	} else {
		console.log(error);
	}
};

scripts.loadDirectory = function (dir)
{
	++scripts.directoriesToLoad;
	$.ajax({ url: dir, success: function (data) {
		$(data).find("a").each(function (index, element) {
			var filename = this.href.replace(window.location.host, "").replace("http://", "").replace("/", "");
			var extension = filename.split(".");
			if (extension.length > 1) {
				++scripts.filesToLoad;
				loadFile(dir + filename, function (error, file) { 
					scripts.storeFileName(error, dir + filename.replace("scripts/", "")); 
					--scripts.filesToLoad;
				});
			} else {
				scripts.loadDirectory(dir + filename);
			}
		});
		--scripts.directoriesToLoad;
	}});
};

scripts.loadDirectory("scripts/");

var interval = setInterval( function () {
	if (scripts.areLoaded()) {
		clearInterval(interval);
		requirejs(scripts.nameList, function () {
			engine.init();
		});
	}
}, 100);
*/