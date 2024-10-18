// Classic uniforms
uniform float uTime;
uniform vec2 uResolution;
uniform float uPixelRatio;

// Debug uniforms
uniform float uWaveSpeed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uWaveLength;

// Rainbow helper
uniform float uColorMin;
uniform float uColorMax;
uniform float uSaturation;
uniform float uLightness;

// Colors
uniform vec3 uWaveColor; 
uniform vec3 uBackgroundColor; 

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

    // Set the center of the wave at the bottom of the screen
    vec2 center = vec2(0.5, 0.0);
    
    // Calculate distance from the center
    float dist = distance(scaledCoords, center) * uWaveLength;
    
    // Create the wave with speed, frequency, and amplitude controls
    float wave = sin(dist * uFrequency - uTime * uWaveSpeed) * 1. + 0.5;
    
    // Control the amplitude of the wave
    float waveIntensity = wave * uAmplitude;

    // Apply a smooth distance-based falloff for the wave (so it fades at the beginning and end)
    waveIntensity *= smoothstep(0.5, 0., dist);
    waveIntensity *= smoothstep(0., 0.45 , dist);
   
    // handling the shadow 
    float shadowIntensity = smoothstep(0.48, 1., wave);
    vec3 shadowColor = vec3(0.945, 0.965, 0.980);
    // Interpolate between the wave color and the rainbow color based on the wave intensity
    vec3 waveWithShadowColor = mix(shadowColor,uWaveColor,shadowIntensity);

    // Handling the rainbow color that appears near the tip of the wave
    // Defining colors
    vec3 yellow = vec3(1.0, 1.0, 0.0);
    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);

    // Calculate color blend based on distance
    float t = smoothstep(0.06, 0.5, dist);
    vec3 rainbowColor;
    if (t < 0.5 ) {
        rainbowColor = blend(yellow, red, t * 2.0);
    } else {
        rainbowColor = blend(red, blue, (t - 0.5) * 2.0);
    }

    float rainbowIntensity = smoothstep(0.14, 1., dist);
    vec3 finalWaveColor = mix(waveWithShadowColor, rainbowColor, rainbowIntensity);

    // Interpolate between background color and the final wave color based on intensity
    vec3 finalColor = mix(uBackgroundColor, finalWaveColor, waveIntensity);
    
    // Output the final color with transparency
    gl_FragColor = vec4(finalColor, waveIntensity);
}
