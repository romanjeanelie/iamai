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

// Helper function to convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 blend(vec3 color1, vec3 color2, float t) {
    return mix(color1, color2, t);
}


void main() {
  // Normalize fragment coordinates to [0, 1] range
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  
  // Adjust pixel size by pixel ratio
  float adjustedPixelSize = 1.0 / uPixelRatio;
  vec2 scaledCoords = st * adjustedPixelSize;
  
  // Set the center of the circle (for example, at the center of the screen)
  vec2 center = vec2(0.5, 0.); // Adjust this if you want the circle at a different position
  
  // Calculate the distance from the center of the circle
  float dist = distance(scaledCoords, center);
  
  // Animate the radius of the circle to expand over time
  float radius = 0.1 + uTime * 0.2;  // Initial radius + time-based expansion
  float thickness = 0.035;            // Thickness of the outline
  float softness = 0.02;             // Amount of blur at the edge
  
  // Fade the circle out as it expands beyond a certain size
  float fadeOut = smoothstep(1.0, 0., radius);  // Adjust the range to control when fading starts

  // Interpolate between the background color and the circle outline color
  vec3 color = mix(vec3(0.), uWaveColor, dist - radius + thickness);
  
  // Output the final color with the applied fading
  gl_FragColor = vec4(color, 1.);  // Fade the entire ring
}

