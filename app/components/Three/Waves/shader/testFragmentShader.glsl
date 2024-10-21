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

vec3 blend(vec3 color1, vec3 color2, float t) {
    return mix(color1, color2, t);
}

void main(){
  float radius = 0.85 * uProgress; 
  float thickness = 0.3;
  float blurAmount = 0.1 + 0.2 * uProgress;
  float amplitude =  4. ;

  // Calculate the distance from the center (which is at vec2(0.5, 0.0))
  float distFromCenter = distance(vUv, vec2(0.5 , 0.0 - 0.1 * (1. - uProgress))) * amplitude;
  float innerRadius = uProgress - thickness * 0.5;
  float outerRadius = uProgress + thickness * 0.5;


  // Colors
  vec3 shadowColor = vec3(0.945, 0.965, 0.980);

  // Handling the rainbow color that appears near the tip of the wave
  vec3 yellow = vec3(1.0, 1.0, 0.0);
  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 blue = vec3(0.0, 0.0, 1.0);

  float colorMixFactor = smoothstep(0.0, 1.0, distFromCenter);

  // Calculate color blend based on distance
  vec3 rainbowColor = mix(blend(yellow, red, colorMixFactor * 2.0), blend(red, blue, (colorMixFactor - 0.5) * 2.0), colorMixFactor);
  float rainbowIntensity = smoothstep(0.14, 1., distFromCenter);

  vec3 outerColor = mix(uWaveColor * 2., rainbowColor, rainbowIntensity - 0.1  );

  // Calculate the smooth transition (blurred lines)
  float innerEdge = smoothstep(innerRadius - blurAmount, innerRadius + blurAmount, distFromCenter);
  float outerEdge = smoothstep(outerRadius - blurAmount, outerRadius + blurAmount, distFromCenter);
  
  // Transition zone between inner and outer colors
  float blendFactor = smoothstep( innerRadius,outerRadius, distFromCenter + uProgress * 0.15);
  vec3 color = mix(shadowColor, outerColor, blendFactor);  // Blend between green and blue

  // Generate the wave (or ring) outline with smoothstep
  float wave = 1.0 - smoothstep(thickness - blurAmount, thickness + blurAmount, abs(distFromCenter - uProgress) * uAmplitude);

  // Set the fragment color with transparency based on wave
  gl_FragColor = vec4(color, wave * (1. - uProgress)); 
}

