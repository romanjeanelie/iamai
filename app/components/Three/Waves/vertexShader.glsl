
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}