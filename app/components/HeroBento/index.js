import gsap, { Power3 } from "gsap";

class HeroBento {
  constructor({ emitter }) {
    this.emitter = emitter;

    // States
    this.isDisplayed = true;

    // Dom Elements
    this.container = document.querySelector(".heroBentoGrid__container");

    // Init
    this.addEventListeners();
  }

  addEventListeners() {
    this.emitter.on("pre-text-animation", () => {
      if (!this.isDisplayed) return;
      this.isDisplayed = false;

      gsap.to(this.container, {
        yPercent: -100,
        ease: Power3.easeOut,
        duration: 1,
      });
    });
  }
}

export default HeroBento;
