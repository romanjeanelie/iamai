import gsap, { Power3 } from "gsap";

class HeroBento {
  constructor({ user, emitter }) {
    this.user = user;
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.isDisplayed = true;

    // Dom Elements
    this.container = document.querySelector(".heroBentoGrid__container");
    this.name = this.container.querySelector(".name");

    // Init
    this.setName();
    this.addEventListeners();

    if (this.debug) {
      this.hideBento();
    }
  }

  setName() {
    this.name.textContent = this.user?.name || "Guest";
  }

  hideBento() {
    this.isDisplayed = false;
    gsap.to(this.container, {
      yPercent: -100,
      ease: Power3.easeOut,
      duration: 1,
      onComplete: this.destroy.bind(this),
    });
  }

  destroy() {
    this.container.remove();
  }

  addEventListeners() {
    this.emitter.on("pre-text-animation", () => {
      if (!this.isDisplayed) return;
      this.hideBento();
    });
  }
}

export default HeroBento;
