
attribute vec3 a_position;
attribute vec2 a_texcoord;

uniform sampler2D u_video;
uniform sampler2D u_opticalFlow;
uniform vec2 u_resolution;
uniform vec2 u_size;
uniform mat4 u_view;

varying vec4 v_color;

void main ()
{
	vec2 uv = a_position.xy * 0.5 + 0.5;
	vec4 videoColor = texture2D(u_video, uv);
	vec4 motionColor = texture2D(u_opticalFlow, uv);
	float lum = (videoColor.r + videoColor.g + videoColor.b) / 3.0;
	vec2 direction = normalize(motionColor.xy);

	vec2 coord = a_texcoord;
	vec2 size = u_size * length(motionColor.xy);

	vec3 colorSub = vec3(41. / 255., 62. / 255., 148. / 255.);

	size *= (abs(colorSub.r - videoColor.r) + abs(colorSub.g - videoColor.g) + abs(colorSub.b - videoColor.b));
	size = max(size, 0.);

	float depth = 1. - clamp(length(motionColor.xy) / 2., 0., 1.);

	vec4 position = vec4(a_position.xy, 0, 1);
	// vec4 position = vec4(0,0,0,1);
	// position.x *= 4.;
	// position.xz -= u_center.xz;
	//float angle = atan(position.z, position.x);// * 4.;
	// float angle = a_position.x;
	// float radius = 4.;
	// vec3 target = vec3(0,0,0);
	// position.xz = vec2(cos(angle), sin(angle)) * (radius - lum) - target.xz;
	// position.y = (a_position.y * 0.5 + 0.5) * 4.;

	// direction = vec2(1.0, 0.0);
	float aspect = u_resolution.y / u_resolution.x;

	vec4 up = vec4(direction * coord.y * size.y, 0, 0);
	vec4 right = vec4(vec2(direction.y, -direction.x) * coord.x * size.x, 0, 0);
	vec4 forward = vec4(0, 0, -lum, 0);
	// vec4 forward = vec4(0, 0, -length(motionColor.xy), 0);

	up.x *= aspect;
	right.x *= aspect;

	v_color = videoColor;

	gl_Position = vec4(u_view * (position)) + up + right;//));// + forward));
}
