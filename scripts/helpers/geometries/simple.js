
createAxis = function (s)
{
	s = s || 1;
	return {
		position: { numComponents: 3, data: [ 0,0,0, s,0,0, 0,0,0, 0,s,0, 0,0,0, 0,0,s ] },
		indices: { numComponents: 2, data: [ 0,1, 2,3, 4,5 ] },
		color: { numComponents: 4, data: [ 1,0,0,1, 1,0,0,1, 0,1,0,1, 0,1,0,1, 0,0,1,1, 0,0,1,1 ] },
	};
}

createPlane = function ()
{
	return { 
		position: [ -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0 ],
		texcoord: [ 0, 0, 1, 0, 0, 1, 1, 1 ], 
		indices: [ 0, 1, 2, 1, 3, 2 ]
	};
}

createWiredCube = function (s)
{
	s = s || 1;
	return { 
		position: [ -s,-s,-s, s,-s,-s, s,s,-s, -s,s,-s, -s,-s,s, s,-s,s, s,s,s, -s,s,s ],
		texcoord: [ 0,0, 1,0, 0,1, 1,1 ], 
		color: [ 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1 ],
		indices: [ 0,1, 1,2, 2,3, 3,0, 0,4, 1,5, 2,6, 3,7, 4,5, 5,6, 6,7, 7,4 ],
	};
}

createCube = function ()
{
	return {
		position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
		normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
		texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
		indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
	};
}

createGrid = function (s)
{
	s = s || 10;
	var bufferArray = {
		position: { numComponents: 3, data: [] },
		indices: { numComponents: 2, data: [] },
		color: { numComponents: 4, data: [] },
	};

	var index = 0;
	var g = 0.3;

	for (var l = -s; l <= s; ++l) {
		Array.prototype.push.apply(bufferArray.position.data, [ l,0,-s, l,0,s, -s,0,l, s,0,l ]);
		Array.prototype.push.apply(bufferArray.indices.data, [ index, index+1, index+2, index+3 ]);
		if (l == 0) {
			Array.prototype.push.apply(bufferArray.color.data, [ 0,0,1,1, 0,0,1,1, 1,0,0,1, 1,0,0,1 ]);
		} else {
			Array.prototype.push.apply(bufferArray.color.data, [ g,g,g,1, g,g,g,1, g,g,g,1, g,g,g,1 ]);
		}
		index += 4;
	}

	return bufferArray;
}

function createCircle (segment)
{
	var circle = {
		position: { numComponents: 3, data: [] }, 
		color: { numComponents: 4, data: [] }, 
		texcoord: { numComponents: 2, data: [] }, 
	};

	segment = segment || 32;

	for (var i = 0; i < segment; ++i) {
		var ratio = i / segment;

		// positions
		Array.prototype.push.apply(circle.position.data, [ 0, 0, 0 ]);

		// textures coordinates
		Array.prototype.push.apply(circle.texcoord.data, [ ratio, 0 ]);

		// color
		Array.prototype.push.apply(circle.color.data, [ 1, 0, 0, 1 ]);
	}

	return circle;
}