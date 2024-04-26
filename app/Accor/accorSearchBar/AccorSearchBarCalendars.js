import Calendar from "../../components/Calendar";

const CALENDARS_STATES = {
  DATES: "dates",
  MONTHS: "months",
  YEARS: "years",
};

export default class AccorSearchBarCalendars {
  constructor({ selectedDay, key, setGlobalInputValues, emitter }) {
    this.key = key;
    this.setGlobalInputValues = setGlobalInputValues;
    this.emitter = emitter;

    // States
    this.calendars = [];
    this.isTablet = window.innerWidth < 820;
    this.isMobile = window.innerWidth < 640;
    this.selectedDay = selectedDay;

    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.centeredYear = this.currentYear;
    this.state = CALENDARS_STATES.DATES;

    // Dom Elements
    this.surWrapper = document.querySelector(".accorSearchBar__calendar-wrapper");
    this.background = document.querySelector(".accorSearchBar__calendar-bg");
    this.wrapper = document.querySelector(".accorSearchBar__calendar");
    this.yearsContainer = document.querySelector(".years_pick-container");
    this.calContainer = document.querySelector(".date_pick-container");
    this.headerBtns = document.querySelectorAll(".calendar_nav-item");
    this.btns = document.querySelectorAll(".cal-btn");

    const calendarCount = this.isMobile ? 1 : 2;

    this.updateHeader(CALENDARS_STATES.DATES);
    this.selectedDay === null
      ? this.initDates(this.currentMonth, this.currentYear, calendarCount)
      : this.initDates(new Date(this.selectedDay).getMonth(), new Date(this.selectedDay).getFullYear(), calendarCount);
    this.show();
    this.addEventListeners();
  }

  // Initialize the calendars
  initDates(month, year, calendarCount) {
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

    if (this.isMobile) {
      this.selectedDay === null
        ? this.initDates(this.currentMonth, this.currentYear, 2)
        : this.initDates(new Date(this.selectedDay).getMonth(), new Date(this.selectedDay).getFullYear(), 2);
    } else {
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
          console.log(this.currentYear);
          this.updateCalendarsState(CALENDARS_STATES.DATES, i, this.currentYear);
        });
      }
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
    this.surWrapper.style.display = "block";
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
    month = this.selectedDay ? new Date(this.selectedDay).getMonth() : this.currentMonth,
    year = this.selectedDay ? new Date(this.selectedDay).getFullYear() : this.currentYear
  ) => {
    if (this.state === newState) return;
    this.state = newState;
    this.updateHeader(newState);
    this.destroyCalendars();
    if (newState === CALENDARS_STATES.DATES) {
      const calendarCount = this.isMobile ? 1 : 2;

      this.initDates(month, year, calendarCount);
    } else if (newState === CALENDARS_STATES.MONTHS) {
      this.initMonths();
    } else if (newState === CALENDARS_STATES.YEARS) {
      this.initYears();
    }
  };

  updateHeader = (newState) => {
    // Remove active class from all buttons
    let btn;
    this.headerBtns?.forEach((headerBtn) => {
      headerBtn.classList.remove("active");
      // get the button with data-state equal to newState
      if (headerBtn.getAttribute("data-state") === newState) {
        btn = headerBtn;
      }
    });

    btn?.classList.add("active");
    // Update wrapper class
    this.wrapper?.classList.remove("dates", "months", "years");
    this.wrapper?.classList.add(newState);
  };

  // Navigate through the calendars (clicking the back and next buttons)
  updateCalendars = (btn) => {
    if (this.state === CALENDARS_STATES.DATES || (this.state === CALENDARS_STATES.MONTHS && this.isMobile)) {
      this.calendars.forEach((calendar) => {
        if (btn.target.classList.contains("back")) {
          calendar.updateCalendarMonth(-1);
        } else {
          calendar.updateCalendarMonth(1);
        }
      });
    } else if (this.state === CALENDARS_STATES.MONTHS) {
      this.destroyCalendars();
      const isBack = btn.target.classList.contains("back");
      this.currentYear = isBack ? this.currentYear - 1 : this.currentYear + 1;
      this.initMonths();
    } else if (this.state === CALENDARS_STATES.YEARS) {
      const isBack = btn.target.classList.contains("back");
      this.centeredYear = this.centeredYear + (isBack ? -4 : 4);
      this.destroyCalendars();
      this.initYears();
    }
  };

  destroyCalendars = () => {
    // this.wrapper.style.display = "none";
    // Clear inner HTML of all calendar bodies
    this.calendars?.forEach((calendar) => {
      calendar.destroy();
    });
    this.calendars = [];

    if (this.yearsContainer) this.yearsContainer.innerHTML = "";
  };

  destroy = () => {
    if (this.surWrapper) this.surWrapper.style.display = "none";

    // Destroy all calendars
    this.destroyCalendars();

    // remove all event listeners
    this.headerBtns?.forEach((btn) => {
      btn.removeEventListener("click", this.handleHeaderBtnClick.bind(this));
    });
    this.btns?.forEach((btn) => {
      btn.removeEventListener("click", this.updateCalendars.bind(this));
    });
    this.background?.removeEventListener("click", this.closeOnClickOutside);
    window.removeEventListener("resize", this.handleWindowResize.bind(this));

    // Nullify properties that could be holding large amounts of data
    this.calendars = null;
    this.surWrapper = null;
    this.wrapper = null;
    this.yearsContainer = null;
    this.calContainer = null;
    this.headerBtns = null;
    this.btns = null;
  };

  // HANDLERS
  handleWindowResize() {
    this.isMobile = window.innerWidth < 640;
    this.isTablet = window.innerWidth < 820;
    // only when state is DATES
    if (this.state === CALENDARS_STATES.DATES) {
      if (!this.isMobile && this.calendars?.length === 1) {
        const newCalendar = new Calendar({
          container: this.calContainer,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          selectedDay: this.selectedDay,
          setSelectedDay: this.handleSelectedDayChange.bind(this),
        });
        this.calendars.push(newCalendar);
      } else if (this.isMobile && this.calendars?.length === 2) {
        const removedCalendar = this.calendars.pop();
        removedCalendar.destroy();
      }
    } else if (this.state === CALENDARS_STATES.MONTHS) {
      this.destroyCalendars();
      this.initMonths();
    }
  }

  closeOnClickOutside = () => {
    this.emitter.emit("closeCalendar");
    this.destroy();
  };

  handleHeaderBtnClick = (btn) => {
    const btnState = btn.target.getAttribute("data-state");
    if (this.state === btnState) return;
    this.updateCalendarsState(btnState);
  };

  addEventListeners = () => {
    this.headerBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleHeaderBtnClick.bind(this));
    });

    this.btns.forEach((btn) => {
      btn.addEventListener("click", this.updateCalendars.bind(this));
    });

    this.background.addEventListener("click", this.closeOnClickOutside);

    window.addEventListener("resize", this.handleWindowResize.bind(this));
  };
}
