
var blender = {};

blender.sceneName = "main";

blender.init = function ()
{
	blender.main = new blenderHTML5Animations.ActionLibrary(actions);
};

blender.setScene = function (sceneName)
{
	blender.sceneName = sceneName;
};

blender.getValue = function (actionName, propertyName)
{
	return blender[blender.sceneName][actionName].paths[propertyName][0].keyframes[0].value;
};

blender.getVector3 = function (actionName, propertyName)
{
	var property = blender[blender.sceneName][actionName].paths[propertyName];
	return [property[0].keyframes[0].value, property[1].keyframes[0].value, property[2].keyframes[0].value];
};

blender.getRotation = function (actionName)
{
	var property = blender[blender.sceneName][actionName].paths["rotation_euler"];
	return [property[0].keyframes[0].value - Math.PI * 0.5, property[1].keyframes[0].value, property[2].keyframes[0].value];
};

blender.evaluate = function (actionName, propertyName, time)
{
	return blender[blender.sceneName][actionName].paths[propertyName].evaluate(time);
};

/*
function Blender ()
{
	this.myAction = blender.actions['camera'];
	this.myActionTime = this.myAction.startTime;

	this.startTime = Date.now();
	this.lastTime = 0;

	this.update = function ()
	{
		this.time = (Date.now() - this.startTime) / 1000;
		var dt = Math.min(this.time - this.lastTime, 0.1);
		this.lastTime = this.time;

		var newActionTime = this.myActionTime + dt;
		while (newActionTime >= this.myAction.endTime) {
			// this.myAction.forEachMarker(this.myActionTime, this.myAction.endTime, markerCallback);
			this.myActionTime = 0;

			newActionTime -= (this.myAction.endTime - this.myAction.startTime);
		}

		// this.myAction.forEachMarker(this.myActionTime, newActionTime, markerCallback);

		this.myActionTime = newActionTime;
	}

	// console.log(this.myAction.paths['location'][0]);

	// this.getCameraPosition = function ()
	// {
	// 	return this.myAction.paths['location'].evaluate(this.myActionTime, FCurveArray.DefaultValues.LOCATION);
	// }

	// this.myAction.setElementTransform(objectElement, this.myActionTime, RotationMode.EULER_XYZ);
}
*/