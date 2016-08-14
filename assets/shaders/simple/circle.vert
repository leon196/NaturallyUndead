attribute vec2 a_texcoord;
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_view;
uniform vec3 u_center;
uniform float u_radius;

varying vec2 v_texCoord;
varying vec4 v_position;
varying vec4 v_color;

void main ()
{
	vec4 position = vec4(0,0,0,1);
	float angle = a_texcoord.x * 3.1416 * 2.;
	position.xz = vec2(cos(angle), sin(angle)) * u_radius;

	position.xz -= u_center.xz;

	v_color = a_color;
  gl_Position = u_view * position;
}
