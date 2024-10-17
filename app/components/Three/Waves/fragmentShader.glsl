uniform float uTime;
uniform float uPixelRatio;

uniform vec3 uWaveColor;        // Color of the waves
uniform vec3 uBackgroundColor;  // Color of the background
uniform float uWaveSpeed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uWaveLength;
uniform vec2 uResolution;

void main() {
    // Normalize fragment coordinates to [0, 1] range
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    
    // Now you can use uPixelRatio inside your fragment shader
    float adjustedPixelSize = 1.0 / uPixelRatio;

    vec2 scaledCoords = st * adjustedPixelSize;

    vec2 center = vec2(.5, 0.0); // Center at the bottom of the plane
    float dist = distance(scaledCoords, center) * uWaveLength;
    
    // Create a single wave
    float wave = sin(dist * uWaveSpeed - uTime * uFrequency ) * .5 + 0.5;
    
    // Control amplitude with uAmplitude
    float combinedWave = wave * uAmplitude;
    
    // Apply distance falloff
    combinedWave *= smoothstep(1.0, 0.0, dist);
    
    // Smooth transition for alpha
    float alpha = smoothstep(0.0, 0.2, combinedWave); // Adjust 0.2 for smoother alpha transition
    
    // Interpolate between background color and wave color based on wave strength
    vec3 color = mix(uBackgroundColor, uWaveColor, combinedWave);
    
    // Final color output with alpha transparency
    gl_FragColor = vec4(color, alpha);
}