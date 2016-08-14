
attribute vec2 a_texcoord;
attribute vec3 a_position;
attribute vec3 a_velocity;
attribute float a_size;
attribute float a_ratio;

uniform float u_time;
uniform float u_boidsValue;
uniform vec2 u_resolution;
uniform mat4 u_view;
uniform vec3 u_target;

varying vec4 v_color;

void main ()
{
	vec3 position = a_position.xyz;

	vec3 p = position - u_target;
	float angleY = atan(p.z, p.x);
	float angleX = atan(p.y, p.x);
	float size = a_size * 0.6 * u_boidsValue * (1. + length(a_velocity));

	// vec3 up = normalize(position);
	vec3 up = vec3(-1.0, 0.0, 0.0);
	// vec3 up = -normalize(a_velocity);
	vec3 right = vec3(up.y, -up.x, 0);
	// vec3 forward = normalize(p);
	// vec3 right = vec3(forward.y, -forward.x, 0);
	// vec3 right = normalize(cross(up, normalize(position)));
	vec3 forward = vec3(0,0,sin((u_time + size) * 30.));
	// vec3 n = normalize(vec3(up.x, 0, up.z));
	// float angle = atan(n.y, n.z);

	vec2 coord = a_texcoord * 2. - 1.;

	position.xyz += up * coord.x * size;
	position.xyz += right * coord.y * size;
	position.xyz += forward * (1. - sin(a_texcoord.x * 3.1416)) * size;

	// angleY *= 3.0;
	// angleX *= 3.0;
	// position = rotateY(rotateX(position, angleX), angleY);

	v_color = vec4(hsv2rgb(vec3(a_ratio, 0.8, 0.8)), 1);
	gl_Position = u_view * vec4(position, 1);
}
