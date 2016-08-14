
function createQuads (gl, width, height, pivot)
{
	var particles = {
		position: { numComponents: 3, data: [] }, 
		texcoord: { numComponents: 2, data: [] }, 
		indices: { numComponents: 3, data: [] }, 
	};

	width = width || 128;
	height = height || 128;
	pivot = pivot || { x: 0.5, y: 0.5 };
	var scale = 2;
	var count = width * height;
	var unit = { x: scale / width, y: scale / height };
	var size = { x: width / 2, y: height / 2 };

	var index = 0;

	for (var i = 0; i < count; ++i) {
		var x = ((i % width) - size.x) / size.x + unit.x / 2;
		var y = (Math.floor(i / width) - size.y) / size.y + unit.y / 2;
		var z = 0;

		// positions
		for (var p = 0; p < 4; ++p) {
			Array.prototype.push.apply(particles.position.data, [ x,y,z ]);
		}

		// textures coordinates
		// Array.prototype.push.apply(particles.texcoord.data, [ 0,0, 1,0, 0,1, 1,1 ]);

		Array.prototype.push.apply(particles.indices.data, [ index,index+1,index+2, index+1,index+2,index+3 ]);
		index += 4;

		// leaf style
		Array.prototype.push.apply(particles.texcoord.data, [ 0.5,0, 1,0.5, 0,0.5, 0.5,1 ]);
	}

	return particles;
}

function createArrows (gl, width, height, pivot)
{
	var particles = { 
		position: { numComponents: 3, data: [] }, 
		texcoord: { numComponents: 2, data: [] }, 
	};

	width = width || 128;
	height = height || 128;
	pivot = pivot || { x: 0.5, y: 0.5 };
	var scale = 2;
	var count = width * height;
	var unit = { x: scale / width, y: scale / height };
	var size = { x: width / 2, y: height / 2 };

	var uvMid = { x: 0.45, y: 0.85 };

	for (var i = 0; i < count; ++i) {
		var x = ((i % width) - size.x) / size.x + unit.x / 2;
		var y = (Math.floor(i / width) - size.y) / size.y + unit.y / 2;

		for (var a = 0; a < 9; ++a) {
			particles.position.data.push(x);
			particles.position.data.push(y);
			particles.position.data.push(0);
		}

		Array.prototype.push.apply(particles.texcoord.data, [ 1 - uvMid.x, 0, uvMid.x, 0, 1 - uvMid.x, uvMid.y, 1 - uvMid.x, uvMid.y, uvMid.x, 0, uvMid.x, uvMid.y, 0, uvMid.y, 1, uvMid.y, 0.5, 1 ]);
	}

	return particles;
}