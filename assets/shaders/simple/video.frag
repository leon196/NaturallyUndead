
uniform vec2 u_videoResolution;
uniform sampler2D u_video;
uniform sampler2D u_videoCurrent;
uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main ()
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;

	vec4 color = vec4(1.);
	color.rgb *= clamp(luminance(edge(u_video, v_texCoord, u_videoResolution).rgb), 0., 1.);
	color.rgb = step(0.25, color.rgb);

	color.rgb += texture2D(u_videoCurrent, v_texCoord).rgb * 0.9;
	color.rgb = clamp(color.rgb, 0., 1.);
	// color.rgb = mix(color.rgb, texture2D(videoBuffer, v_texCoord).rgb * 0.99, 0.9);

	gl_FragColor = color;
}