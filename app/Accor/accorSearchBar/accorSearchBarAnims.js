import gsap, { Power3 } from "gsap";
import Flip from "gsap/Flip";

import { STATES } from ".";

gsap.registerPlugin(Flip);

export default class AccorSearchBarAnims {
  constructor(state) {
    // States
    this.searchBarState = state;

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__wrapper");
    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn");
    this.standardBtn = document.querySelector(".accorSearchBar__standard-btn");
    this.actionBtn = document.querySelector(".accorSearchBar__action-btn");

    this.secondaryBarContainer = document.querySelector(".accorBar__secondaryBar");

    this.advancedBar = document.querySelector(".accorBar__advancedBar-wrapper");
    this.phoneBar = document.querySelector(".accorSearchBar__phoneBar");

    this.initSecondaryBar();
  }

  switchStateClass(state) {
    this.searchBarState = state;
    // handle action btn
    this.actionBtn.classList.remove("phone-btn");
    if (this.searchBarState !== STATES.TEXT_INPUT) this.actionBtn.classList.add("phone-btn");

    // grab state
    const initialState = Flip.getState([this.searchBar, this.advancedBtn]);
    this.wrapper.classList.remove(...Object.values(STATES));
    this.wrapper.classList.add(state);

    gsap.killTweensOf(".standard-input");
    gsap.set(".standard-input", { opacity: 0 });

    // Animate from the initial state to the end state
    Flip.from(initialState, {
      duration: 0.4,
      ease: "power3.out",
      absolute: true,
      onComplete: () => {
        gsap.to(".standard-input", {
          opacity: 1,
        });
      },
    });
  }

  // Transitions between states of main bar (minimized, text input, standard options)
  toMinimized() {
    this.switchStateClass(STATES.MINIMIZED);
  }

  toTextInput() {
    this.switchStateClass(STATES.TEXT_INPUT);
  }

  toStandardOptions() {
    this.switchStateClass(STATES.STANDARD_OPTIONS);
  }

  // Transitions between states of secondary bar (advanced options, call)
  initSecondaryBar() {
    gsap.set(this.secondaryBarContainer, { y: 200 });
  }

  toSecondaryBar(floor = 1) {
    gsap.killTweensOf(this.searchBar);
    const tl = gsap.timeline({ defaults: { ease: Power3.easeOut } });

    tl.to([this.standardBtn, this.advancedBtn], { opacity: 0, duration: 0.1 });
    tl.to(this.wrapper, {
      y: -200 * floor,
      onComplete: () => {
        if (floor === 2) {
          this.resetPhoneBar();
          this.advancedBar.classList.add("none");
        }
      },
    });
    tl.to([this.standardBtn, this.advancedBtn], { opacity: 1 });
  }

  fromSecondaryBar() {
    const tl = gsap.timeline({ defaults: { ease: Power3.easeOut } });

    tl.to([this.standardBtn, this.advancedBtn], { opacity: 0, duration: 0.1 });
    tl.to(this.wrapper, {
      y: 0,
      onComplete: () => {
        this.advancedBar.classList.add("none");
        this.phoneBar.classList.add("none");
      },
    });
    tl.to([this.standardBtn, this.advancedBtn], { opacity: 1 });
  }

  toAdvanceOptions() {
    console.log(this.advancedBar);
    this.advancedBar.classList.remove("none");
    this.toSecondaryBar();
    this.phoneBar.classList.add("absolute");
    this.searchBarState = STATES.ADVANCED_OPTIONS;
  }

  toPhoneBar() {
    this.phoneBar.classList.remove("none");
    this.toSecondaryBar(this.searchBarState === STATES.ADVANCED_OPTIONS ? 2 : 1);
    this.searchBarState = STATES.CALL;
    // HERE INITIATE THE PHONE ANIMATION
    // this.phoneAnimations.toProcessing();
  }

  resetPhoneBar() {
    this.phoneBar.classList.remove("absolute");
    gsap.set(this.wrapper, {
      y: -200,
    });
  }
}
