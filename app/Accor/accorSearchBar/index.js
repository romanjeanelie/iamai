import AccorSearchBarAnims from "./AccorSearchBarAnims";
import AccorSearchBarPhone from "./AccorSearchBarPhone";

export const STATES = {
  MINIMIZED: "minimized",
  TEXT_INPUT: "text-input",
  STANDARD_OPTIONS: "standard-options",
  ADVANCED_OPTIONS: "advanced-options",
  CALL: "call",
};

// TO DO
// [X] remove the "phone-btn" when on text input state
// [X] change the logic of action button when on text-input
// [X] refactor by creating AccorSearchBarAnims
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

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";
    if (this.debug) {
      console.log("-------- debug state ---------");
      const phone__debug = document.querySelector(".phone__debug");
      phone__debug.style.display = "block";
      // this.anims.toPhoneBar();
    }

    // Phone Elements
    this.phoneCloseBtn = document.querySelector(".accorSearchBar__phoneClose");
    this.phone = new AccorSearchBarPhone({ debug: this.debug });

    // Animations
    this.anims = new AccorSearchBarAnims(this.searchBarState, this.updateSearchBarState.bind(this));

    // Init
    this.addEventListener();
  }

  updateSearchBarState(newState) {
    this.searchBarState = newState;
  }

  // Submit the input value
  onSubmit() {
    const input = document.querySelector(".standard-input");
  }

  startPhoneCall() {
    this.anims.toPhoneBar();
    this.phone.startConnecting();
  }

  endPhoneCall() {
    this.phone.leave();
    this.anims.fromSecondaryBar();
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
        this.startPhoneCall();
      }
    });
    this.secondaryBarPhoneBtn.addEventListener("click", this.anims.toPhoneBar.bind(this.anims));
    this.phoneCloseBtn.addEventListener("click", this.endPhoneCall.bind(this));

    document.addEventListener("click", (event) => {
      if (!this.wrapper.contains(event.target)) {
        this.anims.toMinimized();
      }
    });
  }
}
