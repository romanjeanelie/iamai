uniform vec3 uWaveColor1;       // Primary color of the waves (top)
uniform vec3 uWaveColor2;       // Secondary color of the waves (bottom)
uniform vec3 uBackgroundColor;  // Color of the background
uniform float uTime;
uniform float uWave1Speed;
uniform float uWave2Speed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uWaveLength;
uniform vec2 uResolution;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 center = vec2(0.5, 0.0);
    
    float dist = distance(st, center) * uWaveLength;
    
    float wave1 = sin(dist * uWave1Speed - uTime * uFrequency * 0.5);
    float wave2 = sin(dist * uWave2Speed - uTime * uFrequency * 0.7);
    
    float combinedWave = (wave1 * 0.6 + wave2 * 0.4) * uAmplitude;
    
    // Create a sharper transition for the second color
    float colorMix = smoothstep(0., 0.2, combinedWave);
    
    // Mix the two wave colors based on the wave height
    vec3 waveColor = mix(uWaveColor2, uWaveColor1, colorMix);
    
    // Apply distance falloff
    float falloff = smoothstep(1.0, 0.0, dist);
    
    // Smooth transition for alpha, adjusted for more visible waves
    float alpha = smoothstep(0.0, 0.3, abs(combinedWave) * falloff);
    
    // Interpolate between background color and wave color
    vec3 finalColor = mix(uBackgroundColor, waveColor, alpha);
    
    gl_FragColor = vec4(finalColor, alpha);
}