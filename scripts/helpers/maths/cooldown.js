
function Cooldown (time, delay)
{
	this.ratio = 0;
	this.elapsed = time;
	this.delay = delay || 3;
	this.delta = 0.01;
	this.sens = 1;

	this.start = function (time)
	{
		this.ratio = 0;
		this.elapsed = time;
	};

	this.update = function (time)
	{
		this.delta = time - this.elapsed;
		this.elapsed = time;
		this.ratio = Math.max(0, Math.min(1, this.ratio + this.delta * this.sens / this.delay));
	};

	this.isOver = function ()
	{
		return this.ratio == (this.sens > 0 ? 1 : 0);
	};

	this.reverse = function () 
	{
		this.sens *= -1;
	}
}