import isMobile from "../../../utils/isMobile";
import ShaderWaves from "./ShaderWaves";

export default class Waves {
  constructor() {
    // STATES
    this.isAnimating = true;

    // INIT METHODS
    this.init();
    this.addEvents();
  }

  init() {
    if (isMobile()) {
      this.initLottieAnimation();
    } else {
      this.shaderWaves = new ShaderWaves();
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

  destroy() {
    this.shaderWaves?.destroy();
    this.shaderWaves = null;
    this.destroyLottieAnimation();
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
