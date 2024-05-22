import { createNanoEvents } from "nanoevents";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import PopUp from "./PopUp";

gsap.registerPlugin(Flip);

class PhoneCallPage {
  constructor() {
    this.emitter = createNanoEvents();
    // States
    this.section = "dark";

    // DOM Elements
    this.herobanners = document.querySelector(".herobanners__container");
    this.darkSection = document.querySelector(".herobanner__container.dark-section");
    this.lightSection = document.querySelector(".herobanner__container.light-section");
    this.scrollIndicator = document.querySelector(".herobanner__scroll-indicator-container");
    this.herobannerButtons = document.querySelectorAll(".herobanner__button");

    // Methods
    this.handleSwitchSections();
    this.addEvents();
    // this.popUp = new PopUp({ section: this.section, emitter: this.emitter });
  }

  // ----- Transition between two sections -----
  animateScrollIndicators() {
    const indicators = this.scrollIndicator.querySelectorAll(".herobanner__scroll-indicator");
    const initialState = Flip.getState([indicators]);
    this.scrollIndicator.classList.remove("dark", "light");
    this.scrollIndicator.classList.add(this.section);
    Flip.from(initialState, {
      duration: 0.4,
      ease: "power3.out",
    });
  }

  handleSwitchSections() {
    this.herobanners.addEventListener("scroll", (e) => {
      const maxScrollLeft = e.target.scrollWidth - e.target.clientWidth;
      const scrollValueNormalized = e.target.scrollLeft / maxScrollLeft;

      if (scrollValueNormalized > 0.5) {
        if (this.section === "light") return;
        this.section = "light";
        this.animateScrollIndicators();
      } else {
        if (this.section === "dark") return;
        this.section = "dark";
        this.animateScrollIndicators();
      }
    });
  }

  addEvents() {
    this.herobannerButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        new PopUp({ section: this.section, emitter: this.emitter });
      });
    });
  }
}

new PhoneCallPage();
