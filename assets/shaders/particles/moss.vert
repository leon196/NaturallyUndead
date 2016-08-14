
attribute vec3 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform mat4 u_view;
uniform float u_top;
uniform float u_ground;
uniform float u_radius;
uniform vec2 u_leafSize;
uniform vec3 u_cameraDirection;
uniform vec3 u_target;
uniform float u_curveRatio;
uniform float u_curveLoop;
uniform float u_followTarget;
uniform sampler2D u_curve;
uniform vec3 u_colorA;
uniform vec3 u_colorB;

varying vec2 v_texCoord;
varying vec4 v_position;
varying vec4 v_color;
varying vec3 v_normal;
varying float v_depth;

vec3 pointAt (float ratio)
{
	return texture2D(u_curve, vec2(ratio, 0.)).rgb;
}

void main ()
{
	float aspect = u_resolution.y / u_resolution.x;
	vec4 position = vec4(a_position.xyz, 1);

	float light = dot(a_normal, -normalize(u_cameraDirection)) * 0.5 + 0.5;

	float curveRatio = u_curveRatio;
	curveRatio = mix(curveRatio, mod(abs(u_time * 0.1) + 0.5, 1.), u_curveLoop);

	vec3 point = mix(pointAt(curveRatio), u_target, u_followTarget);
	// point.y += 1.0;

	float distanceTarget = length(position.xyz - point) / u_radius;

	// float ratio = min(1., mod(abs(distanceTarget), 2.0));
	// float ratio = clamp(abs((forwardCurve + 5.) / 10.) - 1. + u_curveRatio * 2., 0., 1.);
	float ratio = clamp(distanceTarget, 0., 1.);

	// vec3 displacement = normalize(vec3(a_normal.x, -3., a_normal.z));
	// displacement *= ratio * 3. * luminance(a_color.rgb) * smoothstep(0.5, 1., ratio);
	// position.xyz += displacement;

	// vec2 pulse = vec2(sin(u_time * 8. + noiseIQ(a_normal) * 10.) * 0.5 + 0.5);
	// pulse.x *= 2.0;
	// pulse *= 0.3;
	// pulse += vec2(1.0);

	// cycle
	vec2 size = u_leafSize * (1.0 - ratio) * (light * 0.5 + 1.0);// * pulse;// * (sin(u_time * 10.) * 0.5 + 0.5);//smoothstep(0., 0.25, ratio) * (1. - smoothstep(0.9, 1., ratio));
	// size = mix(size, size * light, u_followTarget);

	position = (u_view * vec4(position.xyz, 1));

	vec3 up = normalize(vec3(a_normal.x, a_normal.y, 0));
	vec3 right = vec3(up.y, -up.x, 0);
	up.x *= aspect;
	right.x *= aspect;

	vec2 coord = a_texcoord;
	coord.x = coord.x * 2. - 1.;

	position.xyz += up * coord.x * size.x;
	position.xyz += right * coord.y * size.y;

	// vec3 color = vec3(1);
	// color *= dot(a_normal, -normalize(u_cameraDirection)) * 0.5 + 0.5;

	vec3 color = mix(u_colorB, u_colorA, light);

	v_color = vec4(color, 1);
	gl_Position = position;
}
