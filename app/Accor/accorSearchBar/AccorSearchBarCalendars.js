import { STATES } from ".";
import Calendar from "../../components/Calendar";

const CALENDARS_STATES = {
  DATES: "dates",
  MONTHS: "months",
  YEARS: "years",
};

export default class AccorSearchBarCalendars {
  constructor({ selectedDay, key, setGlobalInputValues }) {
    this.key = key;
    this.setGlobalInputValues = setGlobalInputValues;

    // States
    this.calendars = [];
    this.isMobile = window.innerWidth < 820;
    this.selectedDay = selectedDay;
    console.log("selectedDay", new Date(selectedDay).getMonth());
    this.currentYear = new Date().getFullYear();
    this.centeredYear = this.currentYear;
    this.state = CALENDARS_STATES.DATES;

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__calendar-wrapper");
    this.yearsContainer = document.querySelector(".years_pick-container");
    this.calContainer = document.querySelector(".date_pick-container");
    this.headerBtns = document.querySelectorAll(".calendar_nav-item");
    this.btns = document.querySelectorAll(".cal-btn");

    this.initDates();
    this.show();
    this.addEventListeners();
  }

  // Initialize the calendars
  initDates(month = 11, year = new Date().getFullYear()) {
    const calendarCount = this.isMobile ? 1 : 2;

    for (let i = 0; i < calendarCount; i++) {
      if (i === 1 && month === 11) {
        month = -1;
        year++;
      }

      const calendar = new Calendar({
        container: this.calContainer,
        month: month + i,
        year: year,
        selectedDay: this.selectedDay,
        setSelectedDay: this.handleSelectedDayChange.bind(this),
      });
      this.calendars.push(calendar);
    }
  }

  initMonths() {
    this.yearsContainer.classList.add("months");
    this.yearsContainer.innerText = this.currentYear;
    for (let i = 0; i < 12; i++) {
      const calendar = new Calendar({
        container: this.calContainer,
        month: i,
        year: this.currentYear,
        selectedDay: this.selectedDay,
        setSelectedDay: this.handleSelectedDayChange.bind(this),
      });
      this.calendars.push(calendar);

      calendar.calendarContainer.addEventListener("click", () => {
        this.updateCalendarsState(CALENDARS_STATES.DATES, i, this.currentYear);
      });
    }
  }

  initYears() {
    // get the 4 years before and after the current year and put them into an array
    this.yearsContainer.classList.remove("months");
    const years = [];
    for (let i = -4; i <= 4; i++) {
      years.push(this.centeredYear + i);
    }

    // Create a button for each year
    years.forEach((year) => {
      const btn = document.createElement("button");
      btn.classList.add("year-btn");

      // Add appropriate classes based on the relationship with currentYear
      if (year < this.centeredYear) {
        btn.classList.add("unactive");
      } else if (year === this.centeredYear) {
        btn.classList.add("selected");
      } else {
        btn.classList.add("active");
      }

      btn.innerText = year;
      btn.addEventListener("click", () => {
        this.currentYear = year;
        this.centeredYear = year;
        this.updateCalendarsState(CALENDARS_STATES.MONTHS);
      });
      this.yearsContainer.appendChild(btn);
    });
  }

  show = () => {
    this.wrapper.style.display = "block";
  };

  hide = () => {
    this.wrapper.style.display = "none";
    this.destroyCalendars();
  };

  // Update the selected day
  handleSelectedDayChange(newSelectedDay) {
    this.selectedDay = newSelectedDay;
    // Update all calendars with the new selected day
    this.calendars.forEach((calendar) => {
      calendar.selectedDay = newSelectedDay;
    });

    this.setGlobalInputValues(this.key, newSelectedDay);
  }

  // update the calendar state (dates, months, years)
  updateCalendarsState = (
    newState,
    month = new Date(this.selectedDay).getMonth(),
    year = new Date(this.selectedDay).getFullYear()
  ) => {
    if (this.state === newState) return;
    this.state = newState;
    this.updateHeader(newState);
    this.destroyCalendars();
    if (newState === CALENDARS_STATES.DATES) {
      this.initDates(month, year);
    } else if (newState === CALENDARS_STATES.MONTHS) {
      this.initMonths();
    } else if (newState === CALENDARS_STATES.YEARS) {
      this.initYears();
    }
  };

  updateHeader = (newState) => {
    // Remove active class from all buttons
    let btn;
    this.headerBtns.forEach((headerBtn) => {
      headerBtn.classList.remove("active");
      // get the button with data-state equal to newState
      if (headerBtn.getAttribute("data-state") === newState) {
        btn = headerBtn;
      }
    });

    btn.classList.add("active");
    // Update wrapper class
    this.wrapper.classList.remove("dates", "months", "years");
    this.wrapper.classList.add(newState);
  };

  // Navigate through the calendars (clicking the back and next buttons)
  updateCalendars = (btn) => {
    if (this.state === CALENDARS_STATES.DATES) {
      this.calendars.forEach((calendar) => {
        if (btn.classList.contains("back")) {
          calendar.updateCalendarMonth(-1);
        } else {
          calendar.updateCalendarMonth(1);
        }
      });
    } else if (this.state === CALENDARS_STATES.MONTHS) {
      this.destroyCalendars();
      const isBack = btn.classList.contains("back");
      this.currentYear = isBack ? this.currentYear - 1 : this.currentYear + 1;
      this.initMonths();
    } else if (this.state === CALENDARS_STATES.YEARS) {
      const isBack = btn.classList.contains("back");
      this.centeredYear = this.centeredYear + (isBack ? -4 : 4);
      this.destroyCalendars();
      this.initYears();
    }
  };

  destroyCalendars = () => {
    // this.wrapper.style.display = "none";
    // Clear inner HTML of all calendar bodies
    this.calendars.forEach((calendar) => {
      calendar.destroy();
    });
    this.calendars = [];

    this.yearsContainer.innerHTML = "";
  };

  handleWindowResize() {
    // only when state is DATES
    if (this.state)
      if (!this.isMobile && this.calendars.length === 1) {
        const newCalendar = new Calendar({
          container: this.calContainer,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          selectedDay: this.selectedDay,
          setSelectedDay: this.handleSelectedDayChange.bind(this),
        });
        this.calendars.push(newCalendar);
      } else if (this.isMobile && this.calendars.length === 2) {
        const removedCalendar = this.calendars.pop();
        removedCalendar.destroy();
      }
  }

  addEventListeners = () => {
    this.headerBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const btnState = btn.getAttribute("data-state");
        if (this.state === btnState) return;
        this.updateCalendarsState(btnState);
      });
    });

    this.btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.updateCalendars(btn);
      });
    });

    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 820;
      this.handleWindowResize();
    });
  };
}
