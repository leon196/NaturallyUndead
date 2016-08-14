
uniform sampler2D u_texture;

varying vec2 v_texCoord;

void main ()
{
	vec2 uv = v_texCoord;
	uv.y = 1.0 - uv.y;
	gl_FragColor = texture2D(u_texture, uv);
}
