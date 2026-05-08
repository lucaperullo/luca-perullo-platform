// 3D simplex noise (Ashima Arts / Stefan Gustavson) + analytic-normal
// displacement, designed to be injected into MeshPhysicalMaterial via
// onBeforeCompile. Keeps every PBR feature (transmission, iridescence,
// clearcoat, sheen) usable on top of the displaced surface.

export const noiseGLSL = /* glsl */ `
vec4 mod289_v4(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 mod289_v3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec4 permute_v4(vec4 x){ return mod289_v4(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt_v4(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289_v3(i);
  vec4 p = permute_v4(permute_v4(permute_v4(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_*D.wyz - D.xzx;
  vec4 j = p - 49.0*floor(p*ns.z*ns.z);
  vec4 x_ = floor(j*ns.z);
  vec4 y_ = floor(j - 7.0*x_);
  vec4 x = x_*ns.x + ns.yyyy;
  vec4 y = y_*ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt_v4(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform float uDisplace;
uniform float uRoundness;
uniform float uPulse;
uniform vec3  uPointer;
uniform float uPointerForce;
uniform float uChaos;

float blobField(vec3 p){
  float t = uTime * uNoiseSpeed;
  float n = snoise(p * uNoiseScale + vec3(0.0, t, 0.0));
  n += 0.5 * snoise(p * uNoiseScale * 2.1 + vec3(t * 1.3, 0.0, 0.0));
  n += uChaos * 0.25 * snoise(p * uNoiseScale * 4.7 - vec3(0.0, 0.0, t * 1.7));
  n += uPulse * 0.6 * sin(t * 1.2 + length(p) * 3.0);
  return n;
}

vec3 displacePosition(vec3 pos){
  vec3 dir = normalize(pos);
  vec3 toPointer = pos - uPointer;
  float pd = length(toPointer);
  float pInfluence = exp(-pd * 1.6) * uPointerForce;
  vec3 rounded = mix(pos, dir * 1.0, uRoundness);
  float n = blobField(rounded);
  vec3 displaced = rounded + dir * n * uDisplace;
  displaced += dir * pInfluence * 0.35;
  return displaced;
}
`;

export const vertexInjection = /* glsl */ `
  // === blob-mixer displacement ===
  vec3 _origPos = transformed;
  vec3 _origN   = objectNormal;
  vec3 _t = normalize(cross(_origN, vec3(0.0, 1.0, 0.0) + vec3(0.001)));
  if (length(_t) < 0.001) _t = normalize(cross(_origN, vec3(1.0, 0.0, 0.0)));
  vec3 _b = normalize(cross(_origN, _t));
  float _eps = 0.05;

  vec3 _p0 = displacePosition(_origPos);
  vec3 _p1 = displacePosition(_origPos + _t * _eps);
  vec3 _p2 = displacePosition(_origPos + _b * _eps);
  vec3 _newN = normalize(cross(_p1 - _p0, _p2 - _p0));
  if (dot(_newN, _origN) < 0.0) _newN = -_newN;

  transformed = _p0;
  vNormal = normalize(normalMatrix * _newN);
  objectNormal = _newN;
`;
