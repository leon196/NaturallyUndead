
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_leaf;
uniform sampler2D u_video;
uniform sampler2D u_opticalFlow;

varying vec2 v_texCoord;

void main ()
{
	// vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 color = texture2D(u_video, v_texCoord);
	gl_FragColor = color;
}
