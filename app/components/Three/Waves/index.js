import * as THREE from "three";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/testFragmentShader.glsl";
import WavesGUI from "./WavesGUI";
import gsap from "gsap";

export default class Waves {
  constructor() {
    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.sizes = { width: window?.innerWidth, height: window?.innerHeight };
    this.aspectRatio = this.sizes.width / this.sizes.height;
    this.settings = {
      progress: 0.5,
      frequency: 20,
      amplitude: 2.5,
      waveSpeed: 4,
      waveLength: 2,

      // Colors
      waveColor: 0xf9f9f9,
      backgroundColor: 0xf9f9f9,
    };

    // DOM ELEMENTS
    this.canvas = document.querySelector(".threejs-container");

    // INIT METHODS
    this.init();

    if (this.debug) {
      this.debugGUI = new WavesGUI({ settings: this.settings, material: this.material });
    }
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupMesh();

    this.updateCamera();
    this.updateRenderer();
    this.updateMeshGeometry();

    this.addEvents();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    // Set a constant FOV and calculate the camera distance needed
    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);
    this.updateCamera();
    this.scene.add(this.camera);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.setClearAlpha(0);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setupMesh() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1); // Plane will be resized to fit screen
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        // Classic uniforms
        uTime: { value: 0 },
        uProgress: { value: this.settings.progress },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },

        // Debug Uniforms
        uFrequency: { value: this.settings.frequency },
        uAmplitude: { value: this.settings.amplitude },
        uWaveSpeed: { value: this.settings.waveSpeed },
        uWaveLength: { value: this.settings.waveLength },

        // Colors
        uWaveColor: { value: new THREE.Color(0xfcfefb) },
        uBackgroundColor: { value: new THREE.Color("#f2f5f7") },
      },
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.updateMeshGeometry();
    this.scene.add(this.mesh);
  }

  updateCamera() {
    // Calculate the FOV to fit the plane exactly
    const fov = 2 * Math.atan(1 / this.camera.position.z) * (180 / Math.PI);
    this.camera.aspect = this.aspectRatio;
    this.camera.fov = fov; // Apply FOV based on aspect ratio

    this.camera.position.set(0, 0, 1); // Move the camera back to fit the entire plane
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.updateProjectionMatrix();
  }

  updateRenderer() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  updateMeshGeometry() {
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.PlaneGeometry(2 * this.aspectRatio, 2, 32, 32);
  }

  animate() {
    this.clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = this.clock.getElapsedTime();
      this.material.uniforms.uTime.value = elapsedTime;

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(tick);
    };

    tick();
  }

  addEvents() {
    window.addEventListener("click", () => {
      gsap.to(this.settings, { progress: 1, duration: 1 });
    });

    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      this.aspectRatio = this.sizes.width / this.sizes.height;

      this.material.uniforms.uResolution.value.set(this.sizes.width, this.sizes.height);
      this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

      this.updateCamera();
      this.updateRenderer();
      this.updateMeshGeometry();
    });
  }
}
