import isMobile from "../../../utils/isMobile";
import ShaderWaves from "./ShaderWaves";

export default class Waves {
  constructor(inputType = "audio") {
    this.inputType = inputType;

    // DOM Elements
    this.inputWrapper = document.querySelector(".input__wrapper");

    // INIT METHODS
    this.init();
    this.addEvents();
  }

  updateFrames(frame) {
    this.frame = frame;
    if (this.shaderWaves) {
      this.shaderWaves.updateFrames(frame); // we're passing the frames from voiceConv to shaderWave -- WIP
    }
  }

  init() {
    this.inputWrapper.classList.add("compact-gradient-background");
    if (isMobile()) {
      this.initLottieAnimation();
      this.shaderWaves.destroy();
      this.shaderWaves = null;
    } else {
      this.shaderWaves = new ShaderWaves(this.inputType);
    }
  }

  initLottieAnimation() {
    const lottieContainer = document.querySelector(".lottie-container");
    this.lottieAnimation = bodymovin.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: true,
      path: "/public/animations/mobile_listening.json",
      autoplay: true,
    });
  }

  destroyLottieAnimation() {
    if (this.lottieAnimation) {
      this.lottieAnimation.destroy();
      this.lottieAnimation = null;
    }
  }

  async destroy() {
    this.inputWrapper.classList.remove("compact-gradient-background");
    await this.shaderWaves?.destroy();
    this.shaderWaves = null;
    this.destroyLottieAnimation();
  }

  toggleBetweenIdleAndActive() {
    if (!this.shaderWaves) return;
    this.shaderWaves.toggleBetweenIdleAndActive();
  }

  addEvents() {
    window.addEventListener("resize", () => {
      if (isMobile()) {
        this.shaderWaves?.destroy();
        this.shaderWaves = null;
        this.initLottieAnimation();
      } else {
        this.destroyLottieAnimation();
        if (!this.shaderWaves) this.shaderWaves = new ShaderWaves();
      }
    });
  }
}
