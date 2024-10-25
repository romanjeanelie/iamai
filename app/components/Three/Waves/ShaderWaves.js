import gsap, { Power3 } from "gsap";
import * as THREE from "three";
import fragmentShader from "./shader/fragmentShaderv2.glsl";
import vertexShader from "./shader/vertexShader.glsl";
import WavesGUI from "./WavesGUI";

export default class ShaderWaves {
  constructor() {
    // States
    this.maxWaves = 5;
    this.currentWaveIndex = 1; // Track which wave to trigger next
    this.debug = import.meta.env.VITE_DEBUG === "true";

    this.sizes = { width: window?.innerWidth, height: window?.innerHeight };
    this.aspectRatio = this.sizes.width / this.sizes.height;
    this.settings = {
      progress: 0,
      fadeProgress: 0,
      frequency: 20,
      amplitude: 4,
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
        destroy: () => this.destroy(),
      });
    }
  }

  init() {
    if (!this.debug) {
      this.captureMicrophone();
    }

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

  // ----- Three.js setup -----
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
    const waveProgressArray = new Float32Array(this.maxWaves).fill(0);

    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMaxWaves: { value: this.maxWaves },
        uFadeProgress: { value: 0 },
        uWaveProgress: { value: waveProgressArray },
        uStateProgress: { value: this.settings.progress }, // handling the transition between idle and waves states
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

  // ----- Three.js methods to handle window resize -----
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

  // ----- Get audio to make it interact with the animation -----
  captureMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.stream = stream;
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

  stopMicrophone() {
    this.stream.getTracks().forEach((track) => track.stop());
  }

  analyseAudio() {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Get the frequency data
    this.analyser.getByteFrequencyData(dataArray);

    const avgVolume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

    // Trigger the wave if volume exceeds a threshold
    if (avgVolume > 5) {
      this.triggerWave();
    }
  }

  // ----- Waves Animations -----
  increaseWaveIndex() {
    // Increment the wave index and loop back to 1 if it exceeds the maxWaves
    // Never set to to 0 as the first wave is looping indefinitely
    this.currentWaveIndex = (this.currentWaveIndex + 1) % this.maxWaves || 1;
  }

  startWaveLoop() {
    const progressProxy = {
      value: 0,
    };

    gsap.to(progressProxy, {
      value: 1,
      duration: 2,
      ease: Power3.easeIn,
      repeat: -1,
      onUpdate: () => {
        this.material.uniforms.uWaveProgress.value[0] = progressProxy.value;
      },
    });
  }

  triggerWave() {
    this.increaseWaveIndex();
    const currentIndex = this.currentWaveIndex - 1;

    // Only trigger if the current wave is inactive (progress >= 1.0)
    if (this.material.uniforms.uWaveProgress.value[currentIndex] > 0) return;

    // gasp can't animates an array so we have to use a proxy object
    const progressProxy = {
      value: 0,
    };

    gsap.to(progressProxy, {
      value: 1,
      duration: 2,
      ease: Power3.easeOut,
      onUpdate: () => {
        // Update the array value during animation
        this.material.uniforms.uWaveProgress.value[currentIndex] = progressProxy.value;
      },
      onComplete: () => {
        // Reset progress to 0 at end
        this.material.uniforms.uWaveProgress.value[currentIndex] = 0;
      },
    });
  }

  // ----- Toggle between idle and active states -----
  toggleBetweenIdleAndActive() {
    gsap.to(this.settings, {
      progress: this.settings.progress === 0 ? 1 : 0,
      duration: 2,
      ease: Power3.easeInOut,
      onUpdate: () => {
        this.material.uniforms.uStateProgress.value = this.settings.progress;
      },
    });
  }

  // ----- Animate loop -----
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

  addEvents() {
    window.addEventListener("click", () => {
      this.triggerWave();
    });

    window.addEventListener("resize", this.handleResize);
  }

  fade() {
    return new Promise((resolve) => {
      gsap.to(this.material.uniforms.uFadeProgress, {
        duration: 1,
        value: 1,
        onComplete: resolve,
      });
    });
  }

  async destroy() {
    await this.fade();
    // Clean up the Three.js ressources
    this.scene?.remove(this.mesh);
    this.mesh?.geometry.dispose();
    this.mesh?.material.dispose();
    this.debugGUI?.destroy();
    this.renderer?.dispose();

    // Stop the request animation frame loop
    window.cancelAnimationFrame(this.raf);

    this.stopMicrophone();

    // Remove the event listeners
    window.removeEventListener("resize", this.handleResize);
  }
}
