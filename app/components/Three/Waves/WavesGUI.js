import dat from "dat.gui";

export default class WavesGUI {
  constructor({ settings, material, toggleWaves, destroy }) {
    this.settings = settings;
    this.material = material;
    this.toggleWaves = toggleWaves;
    this.destroy = destroy;

    this.setupGUI();
  }

  setupGUI() {
    this.gui = new dat.GUI();
    const paramsFolder = this.gui.addFolder("Parameters");
    paramsFolder
      .add(this.settings, "progress", 0, 1)
      .name("Progress")
      .step(0.01)
      .onChange((value) => {
        this.material.uniforms.uStateProgress.value = value;
      });
    paramsFolder
      .add(this.settings, "fadeProgress", 0, 1)
      .name("Fade Progress")
      .step(0.01)
      .onChange((value) => {
        this.material.uniforms.uFadeProgress.value = value;
      });
    paramsFolder
      .add(this.settings, "frequency", 0, 20)
      .name("Frequency")
      .onChange((value) => {
        this.material.uniforms.uFrequency.value = value;
      });
    paramsFolder
      .add(this.settings, "amplitude", 0, 10)
      .name("Amplitude")
      .onChange((value) => {
        this.material.uniforms.uAmplitude.value = value;
      });
    paramsFolder
      .add(this.settings, "waveSpeed", 0, 100)
      .name("Wave Speed")
      .onChange((value) => {
        this.material.uniforms.uWaveSpeed.value = value;
      });
    paramsFolder
      .add(this.settings, "waveLength", 0, 5)
      .name("Wave Length")
      .step(0.01)
      .onChange((value) => {
        this.material.uniforms.uWaveLength.value = value;
      });

    // Add a button that creates or destroy the waves
    paramsFolder;

    this.gui
      .add(
        {
          add: this.destroy,
        },
        "add"
      )
      .name("DEstroy");

    // create a new gui folder for colors
    const colorsFolder = this.gui.addFolder("Colors");
    colorsFolder
      .addColor(this.settings, "backgroundColor")
      .name("Background Color")
      .onChange((value) => {
        // Assuming this.material.uniforms.uBackgroundColor exists
        this.material.uniforms.uBackgroundColor.value.set(value);
      });
    this.gui
      .add(this.settings, "r", 0, 1)
      .onChange((value) => (this.material.uniforms.uR.value = value))
      .step(0.01);
    this.gui
      .add(this.settings, "g", 0, 1)
      .onChange((value) => (this.material.uniforms.uG.value = value))
      .step(0.01);
    this.gui
      .add(this.settings, "b", 0, 1)
      .onChange((value) => (this.material.uniforms.uB.value = value))
      .step(0.01);

    this.gui
      .add(this.settings, "intensityR", 0, 5)
      .onChange((value) => (this.material.uniforms.uIntensityR.value = value))
      .max(5)
      .step(0.01);
    this.gui
      .add(this.settings, "intensityG", 0, 5)
      .onChange((value) => (this.material.uniforms.uIntensityG.value = value))

      .step(0.01);
    this.gui
      .add(this.settings, "intensityB", 0, 5)
      .onChange((value) => (this.material.uniforms.uIntensityB.value = value))

      .step(0.01);
  }

  destroy() {
    this.gui.destroy();
  }
}
