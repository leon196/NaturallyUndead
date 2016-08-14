
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute float a_ratio;

uniform mat4 u_view;
// uniform float u_ground;
// uniform float u_radius;
uniform float u_time;
uniform float u_curveLoop;
uniform float u_curveRatio;
// uniform vec3 u_center;
uniform sampler2D u_curve;

varying vec2 v_texCoord;

// vec3 pointAt (float ratio)
// {
// 	float a = ratio * 3.1416 * 2.;
// 	float h = sin(a * 10.) * 0.5;
// 	float radius = u_radius;// + h;
// 	return vec3(cos(a), 0., sin(a)) * radius;
// }

vec3 pointAt (float ratio)
{
	return texture2D(u_curve, vec2(ratio, 0.)).rgb;
}

void main ()
{
	vec4 position = a_position;
	float forwardCurve = position.z;
	float rightCurve = position.x;
	float upCurve = position.y;
	float _PlanarScale = 0.05 * mix(sin(a_ratio * 3.1416), 1., u_curveLoop);
	float _CurveResolution = 32.;

	float ratio = clamp(forwardCurve / 253. - 1. + u_curveRatio * 2., 0., 1.);
	ratio = mix(ratio, mod(abs(forwardCurve / 253. - u_time * 0.1), 1.), u_curveLoop);

	// the actual clamped ratio position on the curve
	// float ratio = mod(abs(forwardCurve + u_curveRatio), 1.0);

	// used to distribute point on the plane that is perpendicular to the curve forward
	float angle = atan(upCurve, rightCurve);
	float radius = length(vec2(rightCurve * _PlanarScale, upCurve * _PlanarScale));

	vec3 bezierPoint = pointAt(ratio);

	// get neighbors of the current ratio
	float unit = 1.0 / _CurveResolution;
	float next = mod(ratio + unit, 1.0);
	float prev = mod(ratio - unit + 1.0, 1.0);

	// get next and previous point through the texture
	vec3 bezierPointNext = pointAt(next);
	vec3 bezierPointPrevious = pointAt(prev);

	// find out vectors
	vec3 forward = normalize(bezierPointNext - bezierPoint);
	// vec3 backward = normalize(bezierPointPrevious - bezierPoint);
	vec3 up = vec3(0,1,0);
	// vec3 up = normalize(cross(normalize(bezierPoint), normalize(bezierPointNext)));
	// vec3 up = normalize(cross(forward, backward));
	vec3 right = normalize(cross(forward, up));

	// voila
	position.xyz = bezierPoint + (right * cos(angle) * radius + up * sin(angle) * radius) * step(ratio, 0.99);
	// position.xz -= u_center.xz;
	// position.y += u_ground;

	v_texCoord = a_texcoord;
  gl_Position = u_view * position;
}
