
function parsePointCloud (data, step)
{
	var cloud = {};
	cloud.points = [];

	cloud.middle = [0, 0, 0];
	cloud.top = -9000;
	cloud.ground = 9000;

	step = step || 10;
	var lines = data.split("\n");
	for (var l = 17; l < lines.length; l += step)
	{
		var column = lines[l].split(" ");
		if (column.length > 8)
		{
			var point = { x: parseFloat(column[0]), y: parseFloat(column[1]), z: parseFloat(column[2]) };
			point.normal = { x: parseFloat(column[3]), y: parseFloat(column[4]), z: parseFloat(column[5]) };
			point.color = { r: parseInt(column[6]) / 255, g: parseInt(column[7]) / 255, b: parseInt(column[8]) / 255, a: parseInt(column[9]) / 255 };
			cloud.points.push(point);

			cloud.middle[0] += point.x;
			cloud.middle[1] += point.y;
			cloud.middle[2] += point.z;

			cloud.top = Math.max(cloud.top, point.y);
			cloud.ground = Math.min(cloud.ground, point.y);
		}
	}

	cloud.middle[0] /= cloud.points.length;
	cloud.middle[1] /= cloud.points.length;
	cloud.middle[2] /= cloud.points.length;

	cloud.ground = cloud.ground;

	return cloud;
}