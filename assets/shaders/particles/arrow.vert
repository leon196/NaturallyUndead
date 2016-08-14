
attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec2 a_anchor;

uniform sampler2D u_video;
uniform sampler2D u_opticalFlow;
uniform vec2 u_resolution;

varying vec2 v_texCoord;
varying vec4 v_position;
varying vec4 v_color;

void main ()
{
	vec2 uv = a_anchor.xy * 0.5 + 0.5;
	vec4 videoColor = texture2D(u_video, uv);
	vec4 motionColor = texture2D(u_opticalFlow, uv);
	// float lum = (videoColor.r + videoColor.g + videoColor.b) / 3.0;
	// float angle = lum * 3.1416 * 2.;

	// float angle = motionColor.x * 2.0 * 3.1416;
	// float radius = motionColor.y;

	vec2 direction = normalize(motionColor.xy);
	// vec2 direction = -vec2(cos(angle), sin(angle)) * radius;
	vec2 right = vec2(direction.y, -direction.x);
	float radius = length(motionColor.xy);

	v_texCoord = a_texcoord;
	// v_color = vec4(hsv2rgb(vec3(atan(direction.y, direction.x), 0.8, 0.8)), 1.0);
	v_color = videoColor;
	gl_Position = vec4(a_anchor, 0, 1) + vec4(direction * a_texcoord.y * 0.1 * radius, 0, 0) + vec4(right * (a_texcoord.x * 2.0 - 1.0) * 0.01 * radius, 0, 0);
}
