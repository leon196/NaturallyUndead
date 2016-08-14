precision mediump float;

float luminance ( vec3 color )
{
	return (color.r + color.g + color.b) / 3.0;
}

float range (float fromA, float toA, float fromB, float toB, float value)
{
	return smoothstep(fromA, toA, value) * (1. - smoothstep(fromB, toB, value));
}

// Sam Hocevar
vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Sam Hocevar
vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 edge (sampler2D bitmap, vec2 uv, vec2 dimension)
{
	vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

	color += -1.0 * texture2D(bitmap, uv + vec2(-2, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-2,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2(-1, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2(-1,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2( 0, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 0, -1) / dimension);
	color += 24.0 * texture2D(bitmap, uv + vec2( 0,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 0,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 0,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2( 1, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 1,  2) / dimension);

	color += -1.0 * texture2D(bitmap, uv + vec2( 2, -2) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2, -1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  0) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  1) / dimension);
	color += -1.0 * texture2D(bitmap, uv + vec2( 2,  2) / dimension);

	return color;
}

// hash based 3d value noise
// function taken from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// ported from GLSL to HLSL
float hash( float n )
{
	return fract(sin(n)*43758.5453);
}

float noiseIQ( vec3 x )
{
	// The noise function returns a value in the range -1.0f -> 1.0f
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0 + 113.0*p.z;
	return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
	 mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
	mix(mix( hash(n+113.0), hash(n+114.0),f.x),
	 mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

vec3 rotateY(vec3 v, float t)
{
	float cost = cos(t); float sint = sin(t);
	return vec3(v.x * cost + v.z * sint, v.y, -v.x * sint + v.z * cost);
}

vec3 rotateX(vec3 v, float t)
{
	float cost = cos(t); float sint = sin(t);
	return vec3(v.x, v.y * cost - v.z * sint, v.y * sint + v.z * cost);
}

vec3 rotateZ(vec3 p, float angle)
{
	float c = cos(angle);
	float s = sin(angle);
	return vec3(c*p.x+s*p.y, -s*p.x+c*p.y, p.z);
}



vec2 lightDirection (sampler2D bitmap, vec2 uv, vec2 dimension)
{ 
  vec2 force = vec2(0.0, 0.0);
  vec3 c = texture2D(bitmap, uv).rgb;
  float l = luminance(c);

  c = texture2D(bitmap, uv + vec2(-1.0, 0.0) / dimension).rgb;
  force.x += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(1.0, 0.0) / dimension).rgb;
  force.x += l - luminance(c);

  c = texture2D(bitmap, uv + vec2(0.0, -1.0) / dimension).rgb;
  force.y += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(0.0, 1.0) / dimension).rgb;
  force.y += l - luminance(c);

  c = texture2D(bitmap, uv + vec2(-1.0, -1.0) / dimension).rgb;
  force += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(-1.0, 1.0) / dimension).rgb;
  force += l - luminance(c);

  c = texture2D(bitmap, uv + vec2(1.0, -1.0) / dimension).rgb;
  force += luminance(c) - l;

  c = texture2D(bitmap, uv + vec2(1.0, 1.0) / dimension).rgb;
  force += l - luminance(c);

  return force;
  // return normalize(force);
}