
function FrameBuffer (attachements)
{
	this.array = [];
	this.current = 0;
	this.attachements = attachements;

	this.createBuffer = function (gl, width, height, count)
	{
		count = count || 2;
		for (var i = 0; i < count; ++i)
		{
			this.array.push(twgl.createFramebufferInfo(gl, this.attachements, width, height));
		}
	}

	this.getFrameBuffer = function ()
	{
		return this.array[this.current];
	}

	this.getTexture = function ()
	{
		return this.array[this.current].attachments[0];
	}

	this.swap = function ()
	{
		this.current = (this.current + 1) % this.array.length;
	}
}