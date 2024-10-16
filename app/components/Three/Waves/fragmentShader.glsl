uniform vec3 uWaveColor;        // Color of the waves
uniform vec3 uBackgroundColor;  // Color of the background
uniform float uTime;
uniform float uWave1Speed;
uniform float uWave2Speed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uWaveLength;
uniform vec2 uResolution;

void main() {
    // Normalize fragment coordinates to [0, 1] range
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 center = vec2(0.5, 0.0); // Center at the bottom of the plane
    
    float dist = distance(st, center) * uWaveLength;
    
    // Create two distinct waves with separate speeds
    float wave1 = sin(dist * uWave1Speed - uTime * uFrequency * 0.5) * 0.5 + 0.5;
    float wave2 = sin(dist * uWave2Speed - uTime * uFrequency * 0.7) * 0.5 + 0.5;
    
    // Combine waves
    float combinedWave = (wave1 * 1.0 + wave2 * 0.0) * uAmplitude; // Control amplitude with uAmplitude
    
    // Apply distance falloff
    combinedWave *= smoothstep(1.0, 0.0, dist);
    
    // Smooth transition for alpha
    float alpha = smoothstep(0.0, 0.2, combinedWave); // Adjust 0.2 for smoother alpha transition
    
    // Interpolate between background color and wave color based on wave strength
    vec3 color = mix(uBackgroundColor, uWaveColor, combinedWave);
    
    // Final color output with alpha transparency
    gl_FragColor = vec4(color, alpha);
}
