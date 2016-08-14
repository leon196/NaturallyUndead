
function PointCloud (assetName, step)
{
	this.data = parsePointCloud(assets[assetName], step || 20);
	Entity.call(this, createLeaves(this.data.points), assets["leaf.vert"], assets["color.frag"], {
		u_leafSize: [1, 1],
		u_target: this.data.middle,
		u_value: 1,
	});

	this.middle = this.data.middle;

	this.setLeafSize = function (value) { this.shader.uniforms.u_leafSize = value; };
	this.setTarget = function (value) { this.shader.uniforms.u_target = value; };
}

PointCloud.prototype = Object.create(Entity.prototype);
PointCloud.prototype.constructor = PointCloud;