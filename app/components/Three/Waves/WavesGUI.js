import dat from "dat.gui";

export default class WavesGUI {
  constructor({ settings, material }) {
    this.settings = settings;
    this.material = material;
    console.log("WavesGUI -> constructor -> this.material", this.material);
    this.setupGUI();
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
      .add(this.settings, "waveSpeed", 0, 100)
      .name("Wave Speed")
      .onChange((value) => {
        this.material.uniforms.uWaveSpeed.value = value;
      });
    this.gui
      .add(this.settings, "waveLength", 0, 5)
      .name("Wave Length")
      .onChange((value) => {
        this.material.uniforms.uWaveLength.value = value;
      });
    this.gui
      .add(this.settings, "colorMin", 0, 1)
      .name("Color Min")
      .onChange((value) => {
        this.material.uniforms.uColorMin.value = value;
      });
    this.gui
      .add(this.settings, "colorMax", 0, 5)
      .name("Color Max")
      .onChange((value) => {
        this.material.uniforms.uColorMax.value = value;
      });
    this.gui
      .add(this.settings, "saturation", 0, 1)
      .name("Saturation")
      .onChange((value) => {
        this.material.uniforms.uSaturation.value = value;
      });
    this.gui
      .add(this.settings, "lightness", 0, 1, 0.01)
      .name("Lightness")
      .onChange((value) => {
        this.material.uniforms.uLightness.value = value;
      });
    this.gui
      .addColor(this.settings, "waveColor")
      .name("Wave Color")
      .onChange((value) => {
        // Assuming this.material.uniforms.uWaveColor exists
        this.material.uniforms.uWaveColor.value.set(value);
      });
    this.gui
      .addColor(this.settings, "backgroundColor")
      .name("Background Color")
      .onChange((value) => {
        // Assuming this.material.uniforms.uBackgroundColor exists
        this.material.uniforms.uBackgroundColor.value.set(value);
      });
  }
}
