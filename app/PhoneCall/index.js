import { createNanoEvents } from "nanoevents";

class PhoneCallPage {
  constructor() {
    this.emitter = createNanoEvents();
    // States

    // DOM Elements
    this.herobanners = document.querySelector(".herobanners__container");
    this.darkSection = document.querySelector(".herobanner__container.dark-section");
    this.lightSection = document.querySelector(".herobanner__container.light-section");
    this.scrollIndicator = document.querySelector(".herobanner__scroll-indicator-container");

    // Methods
    this.handleSwitchSections();
  }

  handleSwitchSections() {
    this.herobanners.addEventListener("scroll", (e) => {
      const maxScrollLeft = e.target.scrollWidth - e.target.clientWidth;
      const scrollValueNormalized = e.target.scrollLeft / maxScrollLeft;

      if (scrollValueNormalized > 0.5) {
        this.scrollIndicator.classList.add("light-section");
        this.scrollIndicator.classList.remove("dark-section");
      } else {
        this.scrollIndicator.classList.add("dark-section");
        this.scrollIndicator.classList.remove("light-section");
      }
    });
  }
}

new PhoneCallPage();
