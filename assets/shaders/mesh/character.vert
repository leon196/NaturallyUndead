
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute float a_ratio;

uniform mat4 u_view;
// uniform mat4 u_viewInverse;
// uniform float u_ground;
// uniform float u_radius;
uniform float u_time;
uniform float u_size;
uniform float u_curveLoop;
uniform float u_curveRatio;
uniform sampler2D u_curve;
// uniform vec3 u_center;

varying vec2 v_texCoord;

// vec3 pointAt (float ratio)
// {
// 	float a = ratio * 3.1416 * 2.;
// 	float h = sin(a * 10.) * 2.;
// 	float radius = u_radius + h * clamp(a_position.z / 10., 0., 1.);
// 	return vec3(cos(a), 0., sin(a)) * radius;
// }

vec3 pointAt (float ratio)
{
	// return texture2D(u_curve, mod(abs(vec2(ratio, 0.)), 1.)).rgb;
	return texture2D(u_curve, vec2(ratio, 0.)).rgb;
}

void main ()
{
	vec4 position = a_position;
	float forwardCurve = -position.x;
	float rightCurve = position.y;
	float upCurve = -position.z;
	float _PlanarScale = 0.3;// * sin(a_ratio * 3.1416);
	float _CurveResolution = 32.;

	// the actual clamped ratio position on the curve
	// float ratio = clamp(abs((forwardCurve + 5.) / 10.) - 1. + u_curveRatio * 2., 0., 1.);
	float ratio = clamp(abs((forwardCurve + 5.) / 50.) + 0.5 - 1. + u_curveRatio * 2., 0., 1.);

	ratio = mix(ratio, mod(abs(-forwardCurve / 50. - u_time * 0.1) + 0.5, 1.), u_curveLoop);

	// float ratio = mod(abs(forwardCurve * _CurveScale + u_time * 0.05), 1.0);

	// used to distribute point on the plane that is perpendicular to the curve forward
	float angle = atan(upCurve, rightCurve);
	float radius = 0.5 * length(vec2(rightCurve * _PlanarScale, upCurve * _PlanarScale));

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
	vec3 up = vec3(0, -1, 0);//normalize(cross(normalize(bezierPoint), normalize(bezierPointNext)));
	// vec3 up = normalize(cross(forward, backward));
	vec3 right = normalize(cross(forward, up));// * sin(a_position.z * 2.);//clamp(a_position.z / 10., 0., 1.);
	
	// up += right * sin(a_position.z) * 0.2;

	// voila
	position.xyz = bezierPoint + right * cos(angle) * radius + up * sin(angle) * radius;

	// position.xz -= u_center.xz;
	position.y += 0.05;

	position.xyz *= u_size;

	v_texCoord = a_texcoord;
  gl_Position = u_view * position;
}
