import gsap, { Power3 } from "gsap";

class HeroBento {
  constructor({ user, emitter }) {
    this.user = user;
    this.emitter = emitter;

    // States
    this.isDisplayed = true;

    // Dom Elements
    this.container = document.querySelector(".heroBentoGrid__container");
    this.name = this.container.querySelector(".name");

    // Init
    this.setName();
    this.addEventListeners();
  }

  setName() {
    this.name.textContent = this.user.name;
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
