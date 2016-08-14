attribute vec3 a_position;
attribute vec4 a_color;
uniform mat4 u_view;
varying vec4 v_color;

void main ()
{
	v_color = a_color;
  gl_Position = u_view * vec4(a_position, 1);
}
