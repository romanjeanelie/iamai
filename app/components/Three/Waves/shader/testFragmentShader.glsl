// Classic uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform float uPixelRatio;

// Wave progress uniforms
uniform float uProgress;
uniform float uProgress1;
uniform float uProgress2;
uniform float uProgress3;

// Debug uniforms
uniform float uWaveSpeed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uWaveLength;

// Colors
uniform vec3 uWaveColor;
uniform vec3 uBackgroundColor;

varying vec2 vUv;

vec3 blend(vec3 color1, vec3 color2, float t) {
    return mix(color1, color2, t);
}

float calculateWave(float progress, float distFromCenter) {
    float thickness = 0.3;
    float blurAmount = 0.1 + 0.2 * progress;
    
    // Calculate wave properties
    float innerRadius = progress - thickness * 0.5;
    float outerRadius = progress + thickness * 0.5;
    
    // Generate the wave outline
    return 1.0 - smoothstep(
      thickness - blurAmount, thickness + blurAmount, 
      abs(distFromCenter - progress) * uAmplitude
    );
}

vec3 calculateWaveColor(float progress, float distFromCenter) {
  float thickness = 0.3;
  float innerRadius = progress - thickness * 0.5;
  float outerRadius = progress + thickness * 0.5;
  
  vec3 shadowColor = vec3(0.945, 0.965, 0.980);
  vec3 yellow = vec3(0.7529, 0.9490, 0.9765);  // #C0F2F9
  vec3 red = vec3(0.9765, 0.7098, 0.7098);  // #F9B5B5
  vec3 blue = vec3(0.7098, 0.7686, 0.9882);  // #B5C4FC
  
  float colorMixFactor = smoothstep(0.0, 1.0, distFromCenter);
  vec3 rainbowColor = mix(
    blend(yellow, red, colorMixFactor * 2.0), 
    blend(red, blue, (colorMixFactor - 0.5) * 2.0), 
    colorMixFactor
  );
  
  float rainbowIntensity = smoothstep(0.2, 0.8, distFromCenter);
  vec3 outerColor = mix(uWaveColor, rainbowColor, rainbowIntensity * 2.);
  
  float blendFactor = smoothstep(
    innerRadius, outerRadius, 
    distFromCenter + progress * 0.15
  );
  return mix(shadowColor, outerColor, blendFactor);
}

vec4 processWave(float progress, float distFromCenter) {    
  float wave = calculateWave(progress, distFromCenter);
  vec3 color = calculateWaveColor(progress, distFromCenter);
  return vec4(color, pow(wave, 0.3) * (1. - progress));
}

void main() {
  vec4 finalColor = vec4(vec3(1.), .0);
  
  // Process each wave
  float dist1 = distance(vUv, vec2(0.5, 0.0 - 0.1 * (1. - uProgress1))) * uAmplitude;
  float dist2 = distance(vUv, vec2(0.5, 0.0 - 0.1 * (1. - uProgress2))) * uAmplitude;
  float dist3 = distance(vUv, vec2(0.5, 0.0 - 0.1 * (1. - uProgress3))) * uAmplitude;
  
  vec4 wave1 = processWave(uProgress1, dist1);
  vec4 wave2 = processWave(uProgress2, dist2);
  vec4 wave3 = processWave(uProgress3, dist3);
  
  // Blend all waves together
  finalColor = mix(finalColor, wave1 , wave1.a * (1.0 - finalColor.a));
  finalColor = mix(finalColor, wave2 , wave2.a * (1.0 - finalColor.a));
  finalColor = mix(finalColor, wave3 , wave3.a * (1.0 - finalColor.a));

  finalColor.a *= 3.;

  gl_FragColor = finalColor;
}
