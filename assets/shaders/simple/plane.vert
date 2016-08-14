attribute vec2 a_texcoord;
attribute vec4 a_position;

uniform mat4 u_view;

varying vec2 v_texCoord;
varying vec4 v_position;

void main ()
{
	v_texCoord = a_texcoord;
  gl_Position = u_view * a_position;
}
