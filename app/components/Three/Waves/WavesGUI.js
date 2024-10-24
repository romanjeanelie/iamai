import dat from "dat.gui";

export default class WavesGUI {
  constructor({ settings, material, toggleWaves }) {
    this.settings = settings;
    this.material = material;
    this.toggleWaves = toggleWaves;
    console.log("WavesGUI -> constructor -> this.material", this.material);
    this.setupGUI();
  }

  setupGUI() {
    this.gui = new dat.GUI();
    this.gui
      .add(this.settings, "progress", 0, 1)
      .name("Progress")
      .step(0.01)
      .onChange((value) => {
        this.material.uniforms.uProgress.value = value;
      });
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
      .add(this.settings, "waveSpeed", 0, 100)
      .name("Wave Speed")
      .onChange((value) => {
        this.material.uniforms.uWaveSpeed.value = value;
      });
    this.gui
      .add(this.settings, "waveLength", 0, 1)
      .name("Wave Length")
      .step(0.01)
      .onChange((value) => {
        this.material.uniforms.uWaveLength.value = value;
      });

    this.gui
      .addColor(this.settings, "backgroundColor")
      .name("Background Color")
      .onChange((value) => {
        // Assuming this.material.uniforms.uBackgroundColor exists
        this.material.uniforms.uBackgroundColor.value.set(value);
      });

    // Add a button that creates or destroy the waves
    this.gui
      .add(
        {
          add: this.toggleWaves,
        },
        "add"
      )
      .name("Toggle Waves");
  }
}
