attribute vec2 a_texcoord;
attribute vec4 a_position;

varying vec2 v_texCoord;

void main ()
{
	v_texCoord = a_texcoord;
  gl_Position = a_position;
}
