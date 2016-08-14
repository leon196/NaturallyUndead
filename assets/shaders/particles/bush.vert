
attribute vec3 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform mat4 u_view;
uniform vec3 u_center;
uniform float u_top;
uniform float u_ground;
uniform vec3 u_target;
uniform vec3 u_gridSize;
uniform float u_voxelSize;
uniform float u_value;
uniform vec2 u_leafSize;
uniform vec3 u_displacementScale;
uniform vec3 u_noiseRange;

varying vec2 v_texCoord;
varying vec4 v_position;
varying vec4 v_color;
varying vec3 v_normal;
varying float v_depth;

void main ()
{
	float aspect = u_resolution.y / u_resolution.x;
	vec4 position = vec4(a_position.xyz, 1);

	vec3 targetWorld = u_target / u_voxelSize;
	vec3 target = floor(targetWorld * u_gridSize + 0.5);
	position.xyz -= u_gridSize / 2.;
	position.xyz += target;

	float distanceCenter = distance(position.xyz / u_gridSize, targetWorld);
	float ratio = 1. - clamp(distanceCenter * 2., 0., 1.);

	vec3 noiseRange = u_noiseRange;
	float noise1 = noiseIQ(position.xyz * noiseRange);
	float noise2 = noiseIQ(position.xyz * noiseRange + vec3(4.0, 8.0, 2.0));
	float noise3 = noiseIQ(position.xyz * noiseRange + vec3(32.0, 10.0, 7.0));

	vec3 normal = vec3(noise1, noise2, noise3);
	vec3 colorA = vec3(152. / 255., 177. / 255., 109. / 255.);
	vec3 colorB = vec3(35. / 255., 66. / 255., 9. / 255.);
	vec3 color = mix(colorA, colorB, noise1);

	vec2 leafSize = u_leafSize * ratio * noise1;//smoothstep(0.25, 1., noise1);

	normal = normalize(normal * 2.0 - 1.0);

	position.xyz /= u_gridSize;
	position.xyz *= u_voxelSize;
	position.xyz += normal * u_displacementScale;
	// position.xyz += normalize(position.xyz - targetWorld) * 2.;

	float angle = atan(normal.z, normal.x) + 3.1416 * .5;
	vec3 up = vec3(cos(angle) * aspect, sin(angle), 0);
	vec3 right = vec3(up.y * aspect, -up.x, 0);

	vec2 coord = a_texcoord;
	coord.x = coord.x * 2. - 1.;

	position = (u_view * vec4(position.xyz, 1));
	position.xyz += up * coord.x * leafSize.x * u_value;
	position.xyz += right * coord.y * leafSize.y * u_value;

	v_color = vec4(color, 1);
	gl_Position = position;
}
