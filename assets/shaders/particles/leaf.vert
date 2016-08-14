
attribute vec3 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform mat4 u_view;
uniform mat4 u_world;
uniform vec3 u_target;
uniform float u_top;
uniform float u_ground;
uniform float u_value;
uniform vec2 u_leafSize;

varying vec2 v_texCoord;
varying vec4 v_position;
varying vec4 v_color;
varying vec3 v_normal;
varying float v_depth;

void main ()
{
	float aspect = u_resolution.y / u_resolution.x;
	vec4 position = vec4(a_position.xyz, 1);


	float distanceTarget = length((u_world * position).xyz - u_target) / 3.;

	float ratio = step(distanceTarget, 1.) * mod(abs(-u_time * 0.5 + distanceTarget), 1.0);
	// float ratio = clamp(distanceTarget, 0., 1.) * mod(abs(-u_time * 0.5 + distanceTarget), 1.0);
	// float ratio = (1. - clamp(distanceTarget, 0., 1.));// * (1. - max(0., sin(-u_time * 4. + distanceTarget * 3.)));
	// float ratio = clamp(distanceTarget, 0., 1.) * (1. - max(0., sin(-u_time * 2. + distanceTarget)));
	// float ratio = min(1., mod(abs(-u_time * 0.5 + distanceTarget), 2.0));

	vec3 displacement = normalize(vec3(a_normal.x, -3., a_normal.z));
	displacement *= ratio * 3. * luminance(a_color.rgb) * smoothstep(0.5, 1., ratio);
	position.xyz += displacement;

	// float timeSpeed = .5;
	// float lum = (a_color.r + a_color.b + a_color.g) / 3.0;
	// float green = clamp(a_color.g - a_color.b - a_color.r, 0., 1.);
	// float osc = sin((sin(u_time * timeSpeed) * 0.5 + 0.5) * 3.1416);

	// float offset =  - ((distanceFromCenter / 5.) * osc * 5.);
	// float offset =  - ((lum - distanceFromCenter / 5.) * osc * 5.);
	// float o = sin(u_time * timeSpeed) * 0.5 + 0.5;

	// grow
	// float ratio = 1. - smoothstep(u_ground, u_top, mix(u_ground, anch.y + u_top, o) + offset);
	// anch.y = mix(u_ground, anch.y, ratio);
	// anch.y = mix(anch.y, u_ground, smoothstep(u_ground, u_top, anch.y - (u_top - u_ground) * o));
	// size = mix(0., size, ratio);//1. - smoothstep(u_ground, u_top, anch.y + (u_top - u_ground) * sin(u_time * 2.)));

	// cycle
	vec2 pulse = vec2(sin(u_time * 8. + noiseIQ(a_normal) * 10.) * 0.5 + 0.5);
	pulse.x *= 2.0;
	// pulse *= 0.2;
	pulse += vec2(1.0);
	vec2 size = u_leafSize * smoothstep(0., 0.25, ratio) * (1. - smoothstep(0.9, 1., ratio)) * pulse;

	size *= u_value;

	position = (u_view * vec4(position.xyz, 1));

	vec3 up = normalize(vec3(a_normal.x, a_normal.y, 0));
	vec3 right = vec3(up.y, -up.x, 0);
	up.x *= aspect;
	right.x *= aspect;

	position.xyz += up * a_texcoord.x * size.x;
	position.xyz += right * a_texcoord.y * size.y;

	v_color = a_color;
	gl_Position = position;
}
