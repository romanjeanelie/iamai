import Calendar from "../../components/Calendar";

export default class AccorSearchBarCalendars {
  constructor({ selectedDay, key, setGlobalInputValues }) {
    this.key = key;
    this.setGlobalInputValues = setGlobalInputValues;

    // States
    this.isCalendarInstanced = false;
    this.selectedDay = selectedDay;
    this.calendars = [];

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__calendar-wrapper");
    this.containers = document.querySelectorAll(".date_picker_calendar");
    this.btns = document.querySelectorAll(".cal-btn");

    this.init();
    this.show();
    this.addEventListeners();
  }

  init() {
    this.isCalendarInstanced = true;
    this.containers.forEach((container, i) => {
      const calendar = new Calendar({
        container,
        month: new Date().getMonth() + i,
        year: new Date().getFullYear(),
        selectedDay: this.selectedDay,
        setSelectedDay: this.handleSelectedDayChange.bind(this),
      });
      this.calendars.push(calendar);
    });
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
        calendar.updateCalendar(-1);
      } else {
        calendar.updateCalendar(1);
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

  addEventListeners = () => {
    this.btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.updateCalendars(btn);
      });
    });
  };
}
