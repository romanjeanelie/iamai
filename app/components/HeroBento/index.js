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
    this.bentoGrids = this.container.querySelectorAll(".heroBentoGrid__grid");
    this.indicators = this.container.querySelectorAll(".heroBentoGrid__indicators .indicator");

    // Init
    this.setName();
    this.observeBentoItems();
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

  observeBentoItems() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the index of the bento grid
            const index = Array.from(this.bentoGrids).indexOf(entry.target);
            this.updateIndicators(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.bentoGrids.forEach((item) => observer.observe(item));
  }

  updateIndicators(activeIndex) {
    this.indicators.forEach((indicator, index) => {
      // Toggle the active class on the indicator
      indicator.classList.toggle("active", index === activeIndex);
    });
  }

  addEventListeners() {
    this.emitter.on("pre-text-animation", () => {
      if (!this.isDisplayed) return;
      this.hideBento();
    });
  }
}

export default HeroBento;
