
function Butterflies (count)
{
	count = count || 32;

	var positionArray = new Float32Array(count * 6 * 3);
	var boidArray = [];
	var index = 0;

	for (var i = 0; i < count; ++i) {
		var boid = new Boid();
		boid.ratio = i / count;
		boidArray.push(boid);
		for (var a = 0; a < 6; ++a) {
			positionArray[index] = 0;
			positionArray[index + 1] = 0;
			positionArray[index + 2] = 0;
			index += 3;
		}
	}

	Entity.call(this, createButterflies(boidArray), assets["butterfly.vert"], assets["color.frag"], {
		u_target: [0,0,0],
	});

	this.boidArray = boidArray;
	this.positionArray = positionArray;
	this.index = 0;

	this.hasStarted = false;

	this.target = [0,0,0];
	this.center = [0,0,0];

	for (var i = 0; i < count; ++i) {
		var boid = new Boid();
		boid.ratio = i / count;
		this.boidArray.push(boid);

		// pivot point
		for (var a = 0; a < 6; ++a) {
			this.positionArray[this.index] = 0;
			this.positionArray[this.index + 1] = 0;
			this.positionArray[this.index + 2] = 0;
			this.index += 3;
		}
	}

	this.resetAtTarget = function ()
	{
		for (var current = 0; current < this.boidArray.length; ++current) {
			this.boidArray[current].resetAt(this.target);
		}
	};

	this.setBoidsValue = function (value)
	{
		this.shader.uniforms.u_boidsValue = value;
	};

	this.getTarget = function ()
	{
		return [this.boidArray[0].x, this.boidArray[0].y, this.boidArray[0].z];
	};

	this.update = function ()
	{
		this.vectorAvoid = { x: 0, y: 0, z: 0 };
		this.vectorTarget = { x: 0, y: 0, z: 0 };

		this.index = 0;
		this.center = [0,0,0];

		for (var current = 0; current < this.boidArray.length; ++current) {
			var boid = this.boidArray[current];

			this.vectorAvoid.x = this.vectorAvoid.y = this.vectorAvoid.z = 0;
			// this.vectorTarget.x = boid.target.x - boid.x;
			// this.vectorTarget.y = boid.target.y - boid.y;
			// this.vectorTarget.z = boid.target.z - boid.z;
			this.vectorTarget.x = this.target[0] - boid.x;
			this.vectorTarget.y = this.target[1] - boid.y;
			this.vectorTarget.z = this.target[2] - boid.z;

			var avoidCount = 0;

			for (var other = 0; other < this.boidArray.length; ++other) {
				if (current != other) {
					var boidOther = this.boidArray[other];

					// Avoid
					var distance = distanceBetween(boid, boidOther);
					var dist = distance - (boid.size + boidOther.size);
					if (dist < 0.) {
						this.vectorAvoid.x = boid.x - boidOther.x;
						this.vectorAvoid.y = boid.y - boidOther.y;
						this.vectorAvoid.z = boid.z - boidOther.z;
						++avoidCount;
					}
				}
			}

			if (avoidCount > 0) {
				this.vectorAvoid.x /= avoidCount;
				this.vectorAvoid.y /= avoidCount;
				this.vectorAvoid.z /= avoidCount;
			}

			// Scale them
			this.vectorAvoid.x *= boid.avoidScale;
			this.vectorAvoid.y *= boid.avoidScale;
			this.vectorAvoid.z *= boid.avoidScale;
			this.vectorTarget.x *= boid.targetScale;
			this.vectorTarget.y *= boid.targetScale;
			this.vectorTarget.z *= boid.targetScale;

			// Apply to Boid
			boid.move(
				this.vectorTarget.x + this.vectorAvoid.x,
				this.vectorTarget.y + this.vectorAvoid.y,
				this.vectorTarget.z + this.vectorAvoid.z);

			this.center[0] += boid.x;
			this.center[1] += boid.y;
			this.center[2] += boid.z;

			// pivot point
			for (var a = 0; a < 6; ++a) {
				this.positionArray[this.index] = boid.x;
				this.positionArray[this.index + 1] = boid.y;
				this.positionArray[this.index + 2] = boid.z;
				this.index += 3;
			}
		}

		this.center[0] /= this.boidArray.length;
		this.center[1] /= this.boidArray.length;
		this.center[2] /= this.boidArray.length;

    twgl.setAttribInfoBufferFromArray(gl, this.buffer.attribs.a_position, this.positionArray);
	}
}

Butterflies.prototype = Object.create(Entity.prototype);
Butterflies.prototype.constructor = Butterflies;