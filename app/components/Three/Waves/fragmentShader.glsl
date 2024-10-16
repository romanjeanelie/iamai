uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
  vec4 color = texture2D(uTexture, vUv);
  // float alpha = 1. -  (vUv.x * vUv.y) - 0.3;
  gl_FragColor = color;
}