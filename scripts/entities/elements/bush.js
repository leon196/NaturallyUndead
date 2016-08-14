
function Bush (gridSize)
{
	var points = [];
	var count = gridSize[0] * gridSize[1] * gridSize[2];
	for (var i = 0; i < count; ++i) {	
		var x = i % gridSize[0];
		var y = Math.floor(i / (gridSize[0] * gridSize[2]));
		var z = Math.floor(i / gridSize[0]) % gridSize[2];
		var point = { x: x, y: y, z: z };
		point.normal = { x: 0, y: 1, z: 0 };
		point.color = { r: 0, g: .8, b: 0, a: 1 };
		points.push(point);
	}

	Entity.call(this, createLeaves(points), assets["bush.vert"], assets["color.frag"], {
		u_gridSize: gridSize,
		u_voxelSize: 1.,
		u_leafSize: [1,1],
		u_displacementScale: [0.5,0.5,0.5],
		u_noiseRange: [1,1,1],
		u_target: [0,0,0],
	});

	this.setVoxelSize 					= function (value) { this.shader.uniforms.u_voxelSize = value; };
	this.setLeafSize 						= function (value) { this.shader.uniforms.u_leafSize = value; };
	this.setDisplacementScale 	= function (value) { this.shader.uniforms.u_displacementScale = value; };
	this.setNoiseScale 					= function (value) { this.shader.uniforms.u_noiseRange = value; };
	this.setTarget 							= function (value) { this.shader.uniforms.u_target = value; };
	this.setValue 							= function (value) { this.shader.uniforms.u_value = value; };
}

Bush.prototype = Object.create(Entity.prototype);
Bush.prototype.constructor = Bush;