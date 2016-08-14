
function createButterflies (array)
{
	var particles = {
		position: { numComponents: 3, data: [], drawType: gl.DYNAMIC_DRAW }, 
		normal: { numComponents: 3, data: [], drawType: gl.DYNAMIC_DRAW },
		texcoord: { numComponents: 2, data: [] }, 
		size: { numComponents: 1, data: [] }, 
		ratio: { numComponents: 1, data: [] }, 
	};

	for (var i = 0; i < array.length; ++i) {
		Array.prototype.push.apply(particles.texcoord.data, [ 0.5,0.5, 0.75,0, 1,1, 0.5,0.5, 0,1, 0.25,0 ]);

		for (var a = 0; a < 6; ++a) {
			Array.prototype.push.apply(particles.position.data, [ 0, 0, 0 ]);
			particles.size.data.push(array[i].size);
			particles.ratio.data.push(array[i].ratio);
			particles.normal.data.push(array[i].velocity);
		}
	}

	return particles;
}

function createLeaves (points)
{
	var bufferArray = {
		position: { numComponents: 3, data: [] }, 
		normal: { numComponents: 3, data: [] }, 
		color: { numComponents: 4, data: [] }, 
		texcoord: { numComponents: 2, data: [] }, 
		indices: { numComponents: 2, data: [] }, 
	};

	var index = 0;

	for (var i = 0; i < points.length; ++i) {
		var point = points[i];

		for (var p = 0; p < 4; ++p) {
			Array.prototype.push.apply(bufferArray.position.data, [point.x, point.y, point.z]);
			Array.prototype.push.apply(bufferArray.normal.data, [point.normal.x, point.normal.y, point.normal.z]);
			Array.prototype.push.apply(bufferArray.color.data, [point.color.r, point.color.g, point.color.b, point.color.a]);
		}

		// textures coordinates
		// Array.prototype.push.apply(bufferArray.texcoord.data, [ 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1 ]);

		// textures coordinates leaf style
		// Array.prototype.push.apply(bufferArray.texcoord.data, [ 0.5,0, 1,0.5, 0,0.5, 0,0.5, 1,0.5, 0.5,1 ]);

		var mid = 0.5;// + Math.random() * 0.4;
		Array.prototype.push.apply(bufferArray.texcoord.data, [ 0.5,0, 1,mid, 0,mid, 0.5,1 ]);
		// Array.prototype.push.apply(bufferArray.indices.data, [ index,index+1, index,index+2, index+1,index+2, index+1,index+3, index+2,index+3]);//, i+4,i+3 ]);
		Array.prototype.push.apply(bufferArray.indices.data, [ index,index+1,index+2, index+1,index+2,index+3 ]);
		index += 4;
	}

	return bufferArray;
}