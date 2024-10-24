import gsap, { Power3 } from "gsap";
import * as THREE from "three";
import fragmentShader from "./shader/fragmentShaderv2.glsl";
import vertexShader from "./shader/vertexShader.glsl";
import WavesGUI from "./WavesGUI";

export default class ShaderWaves {
  constructor() {
    // States
    this.maxWaves = 3;
    this.currentWaveIndex = 1; // Track which wave to trigger next
    this.debug = import.meta.env.VITE_DEBUG === "true";

    this.sizes = { width: window?.innerWidth, height: window?.innerHeight };
    this.aspectRatio = this.sizes.width / this.sizes.height;
    this.settings = {
      progress: 0,
      frequency: 20,
      amplitude: 3.2,
      waveSpeed: 4,
      waveLength: 2,

      // Colors
      waveColor: 0xf9f9f9,
      backgroundColor: 0xf9f9f9,
    };

    // DOM ELEMENTS
    this.canvas = document.querySelector(".threejs-container");

    // BINDINGS
    this.handleResize = this.handleResize.bind(this);

    // INIT METHODS
    this.init();
    this.addEvents();

    if (this.debug) {
      this.debugGUI = new WavesGUI({
        settings: this.settings,
        material: this.material,
        toggleWaves: () => console.log("toggle waves on and off"),
      });
    }
  }

  init() {
    this.captureMicrophone();
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupMesh();
    this.startWaveLoop();
    this.updateCamera();
    this.updateRenderer();
    this.updateMeshGeometry();
    this.animate();
  }

  captureMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(stream);

        // Create an AnalyserNode to process the audio
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256; // Set the FFT size
        source.connect(this.analyser);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  analyseAudio() {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Get the frequency data
    this.analyser.getByteFrequencyData(dataArray);

    const avgVolume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

    // Trigger the wave if volume exceeds a threshold
    if (avgVolume > 10) {
      this.triggerWave();
    }
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
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        // Classic uniforms
        uTime: { value: 0 },
        // Three separate progress uniforms instead of array
        uProgress: { value: this.settings.progress },
        uProgress1: { value: 0 }, // 1.0 means inactive
        uProgress2: { value: 0 },
        uProgress3: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },

        // Debug Uniforms
        uFrequency: { value: this.settings.frequency },
        uAmplitude: { value: this.settings.amplitude },
        uWaveSpeed: { value: this.settings.waveSpeed },
        uWaveLength: { value: this.settings.waveLength },

        // Colors
        uWaveColor: { value: new THREE.Color("#fcfefb") },
        uBackgroundColor: { value: new THREE.Color("#f2f5f7") },
      },
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.updateMeshGeometry();
    this.scene.add(this.mesh);
  }

  increaseWaveIndex() {
    // Increment the wave index and loop back to 1 if it exceeds the maxWaves
    // Never set to to 0 as the first wave is looping indefinitely
    this.currentWaveIndex = (this.currentWaveIndex + 1) % this.maxWaves || 1;
  }

  startWaveLoop() {
    gsap.to(this.material.uniforms.uProgress1, {
      value: 1,
      duration: 2,
      ease: Power3.easeIn,
      repeat: -1,
    });
  }

  triggerWave() {
    // Get the uniform name based on current index
    const progressUniform = `uProgress${this.currentWaveIndex + 1}`;

    // Only trigger if the current wave is inactive (progress >= 1.0)
    if (this.material.uniforms?.[progressUniform].value > 0) {
      return;
    }

    gsap.to(this.material.uniforms[progressUniform], {
      value: 1,
      duration: 2,
      ease: Power3.easeOut,
      onComplete: () => {
        // Reset progress to 0 at start
        this.material.uniforms[progressUniform].value = 0;
      },
    });

    this.increaseWaveIndex();
  }

  updateCamera() {
    const fov = 2 * Math.atan(1 / this.camera.position.z) * (180 / Math.PI);
    this.camera.aspect = this.aspectRatio;
    this.camera.fov = fov;

    this.camera.position.set(0, 0, 1);
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

      this.analyseAudio();

      this.raf = window.requestAnimationFrame(tick);
    };

    tick();
  }

  handleResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.aspectRatio = this.sizes.width / this.sizes.height;

    this.material.uniforms.uResolution.value.set(this.sizes.width, this.sizes.height);
    this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    this.updateCamera();
    this.updateRenderer();
    this.updateMeshGeometry();
  }

  addEvents() {
    window.addEventListener("click", () => {
      this.triggerWave();
    });

    window.addEventListener("resize", this.handleResize);
  }

  destroy() {
    this.scene?.remove(this.mesh);
    this.mesh?.geometry.dispose();
    this.mesh?.material.dispose();
    this.debugGUI?.destroy();

    this.renderer?.dispose();
    window.cancelAnimationFrame(this.raf);

    window.removeEventListener("resize", this.handleResize);
  }
}