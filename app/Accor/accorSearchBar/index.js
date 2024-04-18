import * as dat from "dat.gui";

import Phone from "../../components/Phone";
import PhoneAnimations from "../../components/Phone/PhoneAnimations";
import AccorSearchBarAnims from "./accorSearchBarAnims";

export const STATES = {
  MINIMIZED: "minimized",
  TEXT_INPUT: "text-input",
  STANDARD_OPTIONS: "standard-options",
  ADVANCED_OPTIONS: "advanced-options",
  CALL: "call",
};

// TO DO
// [X] remove the "phone-btn" when on text input state
// [] change the logic of action button when on text-input
// [] fix the bug when clicking on the phone button on the secondary bar

export default class AccorSearchBar {
  constructor({ emitter }) {
    // Event Emitter
    this.emitter = emitter;

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
    this.actionBtn = document.querySelector(".accorSearchBar__action-btn");
    this.secondaryBarPhoneBtn = document.querySelector(".secondary-action-btn");

    // Phone Elements
    this.phoneCloseBtn = document.querySelector(".accorSearchBar__phoneClose");

    // Animations
    this.anims = new AccorSearchBarAnims(this.searchBarState);
    this.phoneAnimations = new PhoneAnimations({ pageEl: document });

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";
    if (this.debug) {
      console.log("-------- debug state ---------");
      const phone__debug = document.querySelector(".phone__debug");
      phone__debug.style.display = "block";
      // this.anims.toPhoneBar();
    }

    // Init
    this.addEventListener();
  }

  // Submit the input value
  onSubmit() {
    const input = document.querySelector(".standard-input");
    console.log("on submit");
  }

  // Event Listeners
  addEventListener() {
    this.writeBtn.addEventListener("click", this.anims.toTextInput.bind(this.anims));
    this.expandBtn.addEventListener("click", () => {
      if (this.searchBarState !== STATES.STANDARD_OPTIONS) {
        this.anims.toStandardOptions();
      } else {
        this.anims.toMinimized();
      }
    });
    this.advancedBtn.addEventListener("click", this.anims.toAdvanceOptions.bind(this.anims));
    this.standardBtn.addEventListener("click", this.anims.fromSecondaryBar.bind(this.anims));
    this.actionBtn.addEventListener("click", () => {
      if (this.searchBarState === STATES.TEXT_INPUT) {
        // TO DO - SUBMIT THE INPUT VALUE (on submit function)
        this.onSubmit();
      } else {
        this.anims.toPhoneBar();
      }
    });
    this.secondaryBarPhoneBtn.addEventListener("click", this.anims.toPhoneBar.bind(this.anims));
    this.phoneCloseBtn.addEventListener("click", () => {
      // TO DO - CLOSE THE PHONE BAR
      this.anims.fromSecondaryBar();
    });

    document.addEventListener("click", (event) => {
      if (!this.wrapper.contains(event.target)) {
        this.anims.toMinimized();
      }
    });
  }
}
