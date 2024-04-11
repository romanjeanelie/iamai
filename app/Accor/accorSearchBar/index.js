import gsap, { Power2 } from "gsap";
import Flip from "gsap/Flip";

const STATES = {
  MINIMIZED: "minimized",
  TEXT_INPUT: "text-input",
  STANDARD_OPTIONS: "standard-options",
  ADVANCED_OPTIONS: "advanced-options",
  CALL: "call",
};

gsap.registerPlugin(Flip);

export default class AccorSearchBar {
  constructor() {
    // States
    this.searchBarState = STATES.MINIMIZED;

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__wrapper");
    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.expandBtn = document.querySelector(".accorSearchBar__expand-btn");
    this.callBtn = document.querySelector(".accorSearchBar__action-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn");
    this.standardBtn = document.querySelector(".accorSearchBar__standard-btn");
    this.secondaryBarContainer = document.querySelector(".accorBar__secondaryBar");

    // Init
    this.initSecondaryBar();
    this.addEventListener();
  }

  switchStateClass(state) {
    this.searchBarState = state;

    // grab state
    const initialState = Flip.getState([this.searchBar, this.advancedBtn]);
    this.wrapper.classList.remove(...Object.values(STATES));
    this.wrapper.classList.add(state);

    gsap.killTweensOf(".standard-input");
    gsap.set(".standard-input", { opacity: 0 });

    // Animate from the initial state to the end state
    Flip.from(initialState, {
      duration: 0.5,
      ease: "power3.out",
      absolute: true,
      onComplete: () => {
        gsap.to(".standard-input", {
          opacity: 1,
        });
      },
    });
  }

  toMinimized() {
    this.switchStateClass(STATES.MINIMIZED);
  }

  toTextInput() {
    this.switchStateClass(STATES.TEXT_INPUT);
  }

  toStandardOptions() {
    this.switchStateClass(STATES.STANDARD_OPTIONS);
  }

  toSecondaryBar() {
    gsap.killTweensOf(this.searchBar);
    gsap.to(this.wrapper, {
      y: -200,
    });
  }

  fromSecondaryBar() {
    gsap.to(this.wrapper, {
      y: 0,
    });
  }

  initSecondaryBar() {
    gsap.set(this.secondaryBarContainer, { y: 200 });
  }

  addEventListener() {
    this.writeBtn.addEventListener("click", this.toTextInput.bind(this));
    this.expandBtn.addEventListener("click", () => {
      if (this.searchBarState !== STATES.STANDARD_OPTIONS) {
        this.toStandardOptions();
      } else {
        this.toMinimized();
      }
    });
    this.advancedBtn.addEventListener("click", this.toSecondaryBar.bind(this));
    this.standardBtn.addEventListener("click", this.fromSecondaryBar.bind(this));

    document.addEventListener("click", (event) => {
      if (!this.wrapper.contains(event.target)) {
        this.toMinimized();
      }
    });
  }
}
