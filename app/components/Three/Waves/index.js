import * as THREE from "three";
import vertexShader from "./vertexShader.glsl";

export default class Waves {
  constructor() {
    // States
    this.sizes = { width: window?.innerWidth, height: window?.innerHeight };
    console.log(vertexShader);
    // DOM ELEMENTS
    this.canvas = document.querySelector(".threejs-container");

    // INIT METHODS
    this.init();
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupGUI();
    this.setupMesh();
    this.setupEventListeners();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
    this.camera.position.set(0.25, -0.25, 1);
    this.scene.add(this.camera);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setClearAlpha(0);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setupGUI() {}

  setupMesh() {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    // this.material = new THREE.ShaderMaterial({
    //   vertexShader: testVertexShader,
    //   fragmentShader: testFragmentShader,
    //   uniforms: {
    //     uFrequency: { value: new THREE.Vector2(10, 5) },
    //     uTime: { value: 0 },
    //     uColor: { value: new THREE.Color("orange") },
    //   },
    // });

    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  animate() {
    this.clock = new THREE.Clock();

    const tick = () => {
      // const elapsedTime = this.clock.getElapsedTime();
      // this.material.uniforms.uTime.value = elapsedTime;

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
