
attribute vec3 a_position;
attribute vec2 a_texcoord;

uniform sampler2D u_video;
uniform vec2 u_resolution;
uniform vec2 u_size;
uniform mat4 u_view;
uniform float u_time;
uniform float u_splashRatio;

varying vec4 v_color;
varying vec2 v_texcoord;

void main ()
{
	vec2 uv = a_position.xy * 0.5 + 0.5;
	uv.y = 1. - uv.y;
	vec4 videoColor = texture2D(u_video, uv);
	// vec4 motionColor = texture2D(u_opticalFlow, uv);

	vec3 color = videoColor.rgb;// * (dot(direction, vec2(0,-1)) * 0.25 + 0.75);
	// vec3 color = hsv2rgb(vec3(mod(abs(angle / (3.1416 * 2.)), 1.), 0.8, 0.8));
	 // + vec3(u_time, u_time * 2., 0)
	float lum = rgb2hsv(color).b;
	// float lum = (videoColor.r + videoColor.g + videoColor.b) / 3.0;

	float angle = lum * 3.1416 * 2. + noiseIQ(vec3(uv, 1) * 40.) * 3.1416;// + u_time * 0.2;
	// float angle = rgb2hsv(videoColor.rgb).r * 3.1416 * 2.;// + noiseIQ(vec3(uv, 1) * 40.) * 3.1416;// + u_time;
	vec2 direction = vec2(cos(angle), sin(angle));
	// vec2 direction = normalize(motionColor.xy);
	// vec2 direction = normalize(vec2(0,1) + lightDirection(u_video, uv, u_resolution));

	float ratioStyle = (1. - clamp(lum, 0.0, 0.6)) * smoothstep(0.0, 0.1, lum);

	vec2 coord = a_texcoord;
	coord = coord * 2. - 1.;
	// vec2 size = u_size * (length(motionColor.xy) * 0.25 + lum);
	vec2 size = u_size * ratioStyle;

	vec4 position = vec4(a_position.xy, 0, 1);

	float aspect = u_resolution.y / u_resolution.x;

	vec2 fragcoord = vec4(u_view * position).xy;
	// vec4 displacement = vec4(normalize(fragcoord), 0, 0);
	// displacement.xy = direction.xy * 0.1;
	// float ratioFall = mod(u_time + angle, 1.);
	vec2 center = fragcoord.xy;
	// vec4 displacement = vec4(normalize(direction + vec2(0,-5)),0,0);
	// vec4 displacement = vec4(0,-1,0,0);
	// displacement *= ratioFall * 0.3 * smoothstep(0.8, 1.0, noiseIQ(vec3(uv * 100., 1) + vec3(u_time, 0, 0)));
	// fragcoord.x /= aspect;
	float ratio = u_splashRatio * step(length(fragcoord) * 0.5, u_splashRatio);
	// displacement *= ratio;
	size *= 1. - smoothstep(0.75, 1., u_splashRatio);
	// size *= (1. - ratioFall);
	// ratioFall = range(0., 0.1, 0.8, 1., ratioFall);
	// size *= ratioFall;
	// size *= (1. + ratio * 2.) * (1. - smoothstep(0.75, 1., u_splashRatio));
	// float ratioRatio = mix(ratioStyle, 1. - )
	// position.xy += displacement.xy * smoothstep(0.5, 1.0, lum);
	// position.xy += displacement.xy * (1. - sin(ratioStyle * 3.1416));


	vec4 up = vec4(direction * coord.y * size.y, 0, 0);
	vec4 right = vec4(vec2(direction.y, -direction.x) * coord.x * size.x, 0, 0);
	vec4 forward = vec4(0, 0, -lum, 0);

	up.x *= aspect;
	right.x *= aspect;
	// displacement.x *= aspect;

	// color.rgb *= coord.y;

	// v_color = vec4(1);
	v_color = vec4(color, 1);
	v_texcoord = a_texcoord;

	gl_Position = vec4(u_view * position) + up + right + forward;// + displacement;
}
