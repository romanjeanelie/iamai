import gsap from "gsap";
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
    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.expandBtn = document.querySelector(".accorSearchBar__expand-btn");
    this.callBtn = document.querySelector(".accorSearchBar__phone-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn");

    // Init
    this.addEventListener();
  }

  addEventListener() {}
}
