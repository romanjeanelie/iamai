// Classic uniforms
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform float uPixelRatio;

// Debug uniforms
uniform float uWaveSpeed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uWaveLength;

// Colors
uniform vec3 uWaveColor;
uniform vec3 uBackgroundColor;

varying vec2 vUv;


void main(){
  vec3 testColor = vec3(vUv, 0.5);
  float radius = 0.25 * uProgress; 
  float thickness = 0.1;
  //  float looping = mod(uTime, 2.0) - 1.0;
  
  // float distanceFromCenter = distance(vUv, vec2(0.5, 0. - 0.25 * (1. - uProgress)));
  // float distanceFromCenter = distance(vUv, vec2(0.5));
  // float strength = 1.0 - smoothstep(thickness, abs(distance(vUv, vec2(0.5)) - 0.25 * uProgress), distanceFromCenter);
  float strength = 1. - step(thickness,abs(distance(vUv, vec2(0.5, 0.)) - 0.25 * uProgress) * uAmplitude);

  gl_FragColor = vec4(testColor, strength * (1. - uProgress)); 


}

