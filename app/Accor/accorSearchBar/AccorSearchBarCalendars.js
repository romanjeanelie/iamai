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
    this.state = CALENDARS_STATES.DATES;

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__calendar-wrapper");
    this.calContainer = document.querySelector(".date_pick-container");
    this.btns = document.querySelectorAll(".cal-btn");

    this.init();
    this.show();
    this.addEventListeners();
  }

  init() {
    const calendarCount = this.isMobile ? 1 : 2;
    for (let i = 0; i < calendarCount; i++) {
      const calendar = new Calendar({
        container: this.calContainer,
        month: new Date().getMonth() + i,
        year: new Date().getFullYear(),
        selectedDay: this.selectedDay,
        setSelectedDay: this.handleSelectedDayChange.bind(this),
      });
      this.calendars.push(calendar);
    }
  }

  show = () => {
    this.wrapper.style.display = "block";
  };

  hide = () => {
    this.wrapper.style.display = "none";
  };

  handleSelectedDayChange(newSelectedDay) {
    this.selectedDay = newSelectedDay;
    // Update all calendars with the new selected day
    this.calendars.forEach((calendar) => {
      calendar.selectedDay = newSelectedDay;
    });

    this.setGlobalInputValues(this.key, newSelectedDay);
  }

  updateCalendars = (btn) => {
    this.calendars.forEach((calendar) => {
      if (btn.classList.contains("back")) {
        calendar.updateCalendarMonth(-1);
      } else {
        calendar.updateCalendarMonth(1);
      }
    });
  };

  destroy = () => {
    this.wrapper.style.display = "none";
    // Clear inner HTML of all calendar bodies
    this.calendars.forEach((calendar) => {
      calendar.clearCal();
    });
  };

  handleWindowResize() {
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
