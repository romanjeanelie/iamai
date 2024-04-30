import AccorSearchBarAnims from "./AccorSearchBarAnims.js";
import AccorSearchBarCalendar from "./AccorSearchBarCalendars.js";
import AccorSearchBarPhone from "./AccorSearchBarPhone.js";

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
// [X] fix the bug when clicking on the phone button on the secondary bar

const oneDay = 60 * 60 * 24 * 1000;

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // getMonth() returns a 0-based month (0 = January)
  const day = date.getDate(); // getDate() returns the day of the month

  // Pad the month and day with leading zeros if they are less than 10
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${formattedMonth}/${formattedDay}`;
}

let todayTimestamp = Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60;

export default class AccorSearchBar {
  constructor({ emitter }) {
    // Event Emitter
    this.emitter = emitter;

    // States
    this.isMobile = window.innerWidth <= 640;
    this.searchBarState = STATES.MINIMIZED;
    this.inputsValues = {
      departureDate: todayTimestamp,
      arrivalDate: null,
      departureCity: null,
      arrivalCity: null,
      adults: 1,
      children: 0,
      rooms: 1,
    };

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__wrapper");
    this.searchBar = document.querySelector(".accorSearchBar__container");
    this.writeBtn = document.querySelector(".accorSearchBar__write-btn");
    this.expandBtns = document.querySelectorAll(".accorSearchBar__expand-btn");
    this.callBtn = document.querySelector(".accorSearchBar__action-btn");
    this.advancedBtn = document.querySelector(".accorSearchBar__advanced-btn");
    this.standardBtn = document.querySelector(".accorSearchBar__standard-btn");
    this.actionBtn = document.querySelector(".accorSearchBar__action-btn");
    this.secondaryBarPhoneBtn = document.querySelector(".secondary-action-btn");
    this.inputBtns = document.querySelectorAll(".accorSearchBar__input-btn");

    // Debug
    this.debug = import.meta.env.VITE_DEBUG === "true";

    // Phone Elements
    this.phoneCloseBtn = document.querySelector(".accorSearchBar__phoneClose");
    this.phone = new AccorSearchBarPhone({ debug: this.debug });

    // Animations
    this.anims = new AccorSearchBarAnims(this.searchBarState, this.updateSearchBarState.bind(this));
    if (this.debug) {
      console.log("-------- debug state ---------");
      const phone__debug = document.querySelector(".phone__debug");
      phone__debug.style.display = "block";
      this.anims.toStandardOptions();

      this.calendars = new AccorSearchBarCalendar({
        key: "departureDate",
        selectedDay: this.inputsValues["departureDate"],
        setGlobalInputValues: this.setInputValues.bind(this),
      });
    }
    // Init
    this.addEventListener();
  }

  setInputValues(key, value) {
    // Check if the key exists in the inputsValues object
    if (this.inputsValues.hasOwnProperty(key)) {
      // Update the value of the specified key
      this.inputsValues[key] = value;
      // find the corresponding input
      const input = document.querySelector(`[data-key=${key}]`);
      const span = input.querySelector("span");

      if (key === "departureDate" || "arrivalDate") {
        span.innerText = formatDate(value);
      } else {
        span.innerText = value;
      }
    } else {
      console.error(`Input key ${key} does not exist.`);
    }
  }

  updateSearchBarState(newState) {
    this.searchBarState = newState;
  }

  // Submit the input value
  onSubmit() {
    const input = document.querySelector(".standard-input");
  }

  // Phone Call
  startPhoneCall() {
    this.anims.toPhoneBar();
    this.phone.startConnecting();
  }

  endPhoneCall() {
    this.phone.leave();
    this.anims.fromSecondaryBar(STATES.MINIMIZED);
  }

  // handle
  handleToAdvanceOptions() {
    this.anims.toAdvanceOptions();
    if (this.calendars) this.destroyCalendar();
  }

  // Inputs
  destroyCalendar() {
    if (this.calendars) {
      this.calendars.destroy();
      this.calendars = null;
    }
  }

  // Event Listeners
  addEventListener() {
    this.writeBtn.addEventListener("click", this.anims.toTextInput.bind(this.anims));
    this.expandBtns.forEach((expandBtn) => {
      expandBtn.addEventListener("click", () => {
        if (this.searchBarState !== STATES.STANDARD_OPTIONS) {
          this.anims.toStandardOptions();
        } else {
          this.anims.toMinimized();
        }
      });
    });
    this.advancedBtn.addEventListener("click", this.handleToAdvanceOptions.bind(this));
    this.standardBtn.addEventListener("click", () => this.anims.fromSecondaryBar());
    this.actionBtn.addEventListener("click", () => {
      console.log(this.searchBarState);
      this.destroyCalendar();
      if (this.searchBarState === STATES.TEXT_INPUT) {
        // TO DO - SUBMIT THE INPUT VALUE (on submit function)
        this.onSubmit();
      } else {
        this.startPhoneCall();
      }
    });
    this.secondaryBarPhoneBtn.addEventListener("click", this.startPhoneCall.bind(this));
    this.phoneCloseBtn.addEventListener("click", this.endPhoneCall.bind(this));
    document.addEventListener("click", (event) => {
      if (!this.wrapper.contains(event.target) && !this.calendars) {
        this.anims.toMinimized();
      }
    });

    this.emitter.on("closeCalendar", this.destroyCalendar.bind(this));

    // handling the searchbar inputs
    this.inputBtns.forEach((inputBtn) => {
      inputBtn.addEventListener("click", () => {
        const dataType = inputBtn.getAttribute("data-type");
        if (dataType === "calendar") {
          if (this.calendars) {
            this.destroyCalendar();
          }
          this.calendars = new AccorSearchBarCalendar({
            key: inputBtn.getAttribute("data-key"),
            selectedDay: this.inputsValues[inputBtn.getAttribute("data-key")],
            setGlobalInputValues: this.setInputValues.bind(this),
            emitter: this.emitter,
          });
        }
      });
    });

    window.addEventListener("resize", () => {
      // console.log(this.searchBarState);
    });
  }
}
