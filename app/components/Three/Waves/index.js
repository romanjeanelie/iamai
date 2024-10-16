import * as THREE from "three";
import dat from "dat.gui";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

export default class Waves {
  constructor() {
    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.sizes = { width: window?.innerWidth, height: window?.innerHeight };
    this.aspectRatio = this.sizes.width / this.sizes.height;
    this.settings = {
      frequency: 5,
      amplitude: 1.2,
      wave1Speed: 13,
      wave2Speed: 20,
      waveLength: 3.3,
      color: "#ffa500", // Orange color in hex format
    };

    // DOM ELEMENTS
    this.canvas = document.querySelector(".threejs-container");

    // INIT METHODS
    this.init();

    if (this.debug) {
      this.setupGUI();
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
        uTime: { value: 0 },
        uFrequency: { value: this.settings.frequency },
        uAmplitude: { value: this.settings.amplitude },
        uWave1Speed: { value: this.settings.wave1Speed },
        uWave2Speed: { value: this.settings.wave2Speed },
        uWaveLength: { value: this.settings.waveLength },
        uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
        uColor: { value: new THREE.Color(this.settings.color) },
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

  setupGUI() {
    this.gui = new dat.GUI();

    this.gui
      .add(this.settings, "frequency", 0, 20)
      .name("Frequency")
      .onChange((value) => {
        this.material.uniforms.uFrequency.value = value;
      });
    this.gui
      .add(this.settings, "amplitude", 0, 10)
      .name("Amplitude")
      .onChange((value) => {
        this.material.uniforms.uAmplitude.value = value;
      });
    this.gui
      .add(this.settings, "wave1Speed", 0, 100)
      .name("Wave 1 Speed")
      .onChange((value) => {
        this.material.uniforms.uWave1Speed.value = value;
      });
    this.gui
      .add(this.settings, "wave2Speed", 0, 100)
      .name("Wave 2 Speed")
      .onChange((value) => {
        this.material.uniforms.uWave2Speed.value = value;
      });

    this.gui
      .add(this.settings, "waveLength", 0, 5)
      .name("Wave Length")
      .onChange((value) => {
        this.material.uniforms.uWaveLength.value = value;
      });
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
    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      this.aspectRatio = this.sizes.width / this.sizes.height;

      this.material.uniforms.uResolution.value.set(this.sizes.width, this.sizes.height);

      this.updateCamera();
      this.updateRenderer();
      this.updateMeshGeometry();
    });
  }
}