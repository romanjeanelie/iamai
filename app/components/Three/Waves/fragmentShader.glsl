uniform vec3 uColor;


varying vec2 vUv;

void main()
{
  // float alpha = 1. -  (vUv.x * vUv.y) - 0.3;
  gl_FragColor = vec4(vUv, 1.0, 1.0);
}