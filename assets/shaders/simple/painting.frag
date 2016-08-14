
uniform sampler2D u_texture;

varying vec2 v_texcoord;
varying vec4 v_color;

void main ()
{
	vec4 color = v_color;
	// color.a = texture2D(u_texture, v_texcoord).a;
	gl_FragColor = color;
}
