
var gui = {};

gui.init = function ()
{
	gui.loader = document.getElementById("loader");
	gui.percent = document.getElementById("percent");
};

gui.loadProgress = function (ratio)
{
	gui.percent.innerHTML = Math.floor(ratio * 100) + "%";
}

gui.fadeOutLoader = function (callback)
{
	var cooldown = new Cooldown(3);
	var interval = setInterval( function () {
		cooldown.update();
		gui.loader.style.opacity = 1 - cooldown.ratio;
		gui.percent.style.opacity = 1 - cooldown.ratio;
	}, 1 / 30);
	setTimeout( function () { 
		clearInterval(interval); 
		gui.loader.style.display = "none";
		gui.percent.style.display = "none";
		if (callback) { callback(); }
	}, cooldown.delay * 1000 );
};