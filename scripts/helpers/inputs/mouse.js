
var mouse = {};
mouse.x = 0;
mouse.y = 0;
mouse.down = false;
mouse.delta = { x: 0, y: 0, z: 0 };
mouse.drag = { x: 0, y: 0, z: 0 };
mouse.origin = { x: 0, y: 0, z: 0 };
mouse.sensitivity = 1.;
mouse.velocity = 0.9;

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);

function onMouseDown (e)
{
	mouse.down = true;
	mouse.x = e.clientX;
	mouse.y = e.clientY;
	mouse.origin.x = mouse.x;
	mouse.origin.y = mouse.y;
	mouse.updateDelta(e);
}

function onMouseUp (e)
{
	mouse.down = false;
}

function onMouseMove (e)
{
	if (mouse.down)
	{
		mouse.updateDelta(e);
		mouse.drag.x = mouse.x - mouse.origin.x;
		mouse.drag.y = mouse.y - mouse.origin.y;
	}
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

mouse.update = function ()
{
	mouse.delta.x *= mouse.velocity;
	mouse.delta.y *= mouse.velocity;
	mouse.delta.z *= mouse.velocity;
};

mouse.updateDelta = function (e)
{
	if (e.button == 0) {
		mouse.delta.x = (e.clientX - mouse.x) * mouse.sensitivity;
		mouse.delta.y = (e.clientY - mouse.y) * mouse.sensitivity;
	} else {
		mouse.delta.z = (e.clientY - mouse.y) * mouse.sensitivity;
	}
};