
function Boid ()
{
	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.size = 0.1 + 0.1 * Math.random();
	this.target = { x: 0, y: 0, z: 0 };

	var velocityAngle = Math.random() * Math.PI * 2;
	this.velocity = { x: Math.cos(velocityAngle), y: Math.random() * 2. - 1., z: Math.sin(velocityAngle) };

	this.speed = 0.1;
	this.friction = 0.9;

	this.targetScale = 0.05;
	this.avoidScale = 5.;

	this.move = function (moveX, moveY, moveZ)
	{
		this.velocity.x += moveX;
		this.velocity.y += moveY;
		this.velocity.z += moveZ;

		this.x += this.velocity.x * this.speed / Math.max(1, this.size);
		this.y += this.velocity.y * this.speed / Math.max(1, this.size);
		this.z += this.velocity.z * this.speed / Math.max(1, this.size);

		this.velocity.x *= this.friction;
		this.velocity.y *= this.friction;
		this.velocity.z *= this.friction;
	}

	this.resetAt = function (position)
	{
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.velocity.z = 0;
		this.x = Math.random() * 0.1 - 0.05;
		this.y = Math.random() * 0.1 - 0.05;
		this.z = Math.random() * 0.1 - 0.05;
	};
}