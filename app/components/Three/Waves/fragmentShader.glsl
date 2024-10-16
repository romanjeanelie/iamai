uniform float uTime;
uniform vec2 uResolution;
uniform float uFrequency;
uniform float uAmplitude; // Renamed from uSpeed
uniform float uWave1Speed;
uniform float uWave2Speed;
uniform float uWaveLength;

varying vec2 vUv;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 center = vec2(0.5, 0.0); // Center bottom of the plane
    
    float dist = distance(st, center) * uWaveLength;
    
    // Create two distinct waves with separate speeds
    float wave1 = sin(dist * uWave1Speed - uTime * uFrequency * 0.5) * 0.5 + 0.5;
    float wave2 = sin(dist * uWave2Speed - uTime * uFrequency * 0.7) * 0.5 + 0.5;
    
    // Combine waves
    float combinedWave = (wave1 * 1. + wave2 * 0.) * uAmplitude; // Use uAmplitude to control overall amplitude
    
    // Apply distance falloff
    // wave1 *= uAmplitude;
    // wave1 *= smoothstep(1.0, 0.0, dist) ;
    combinedWave *= smoothstep(1.0, 0.0, dist);
    
    vec3 color = vec3(combinedWave);
    gl_FragColor = vec4(color, 1.0);
}