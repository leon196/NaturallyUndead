
function mix (a, b, ratio) { return a * (1 - ratio) + b * ratio; }
function clamp (v, min, max) { return Math.max(min, Math.min(v, max)); }
function length (x, y, z) { return Math.sqrt(x*x+y*y+z*z); }
function distanceBetween (a, b) { return length(b.x - a.x, b.y - a.y, b.z - a.z); }
function normalize (p) { var dist = length(p.x, p.y, p.z); return { x: p.x / dist, y: p.y / dist, z: p.z / dist }; }

// https://www.khronos.org/opengles/sdk/docs/man31/html/smoothstep.xhtml
function smoothstep (edge0, edge1, x)
{
	var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
	return t * t * (3 - 2 * t);
}


function lerp(a, b, t) 
{
	return a + (b - a) * t;
}

function randomVector3 ()
{
	var v = { x: Math.random() * 2.0 - 1.0, y: Math.random() * 2.0 - 1.0, z: Math.random() * 2.0 - 1.0 };
	return normalize(v);
}