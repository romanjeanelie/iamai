import { days, getMonthDetails, getMonthStr } from "../../utils/dateUtils";

const oneDay = 60 * 60 * 24 * 1000;

let todayTimestamp = Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60;

export default class AccorSearchBarCalendars {
  constructor() {
    // States
    this.selectedDay = todayTimestamp;
    this.calendars = [];

    // Dom Elements
    this.wrapper = document.querySelector(".accorSearchBar__calendar-wrapper");
    this.containers = document.querySelectorAll(".date_picker_calendar");
    this.btns = document.querySelectorAll(".cal-btn");

    this.init();
    this.addEventListeners();
  }

  init() {
    this.wrapper.style.display = "flex";
    this.containers.forEach((container, i) => {
      const calendar = new Calendar({
        container,
        offset: i,
        selectedDay: this.selectedDay,
        setSelectedDay: this.handleSelectedDayChange.bind(this),
      });
      this.calendars.push(calendar);
    });
  }

  handleSelectedDayChange(newSelectedDay) {
    this.selectedDay = newSelectedDay;
    // Update all calendars with the new selected day
    this.calendars.forEach((calendar) => {
      calendar.selectedDay = newSelectedDay;
    });

    console.log("from accorSearchBarCalendars" + this.selectedDay);
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
  };

  addEventListeners = () => {
    this.btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.updateCalendars(btn);
      });
    });

    document.addEventListener("click", (event) => {
      if (!this.wrapper.contains(event.target)) {
        console.log("ezdjn");
        this.wrapper.style.display = "none";

        // this.destroy().bind(this);
      }
    });
  };
}

class Calendar {
  constructor({ container, offset, selectedDay, setSelectedDay }) {
    this.container = container;
    this.offset = offset;
    this.selectedDay = selectedDay;
    this.setSelectedDay = setSelectedDay;

    // States
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + this.offset;
    this.monthDetails = getMonthDetails(this.year, this.month);

    // DOM Elements
    this.calendar = this.container.querySelector(".calendar_main");
    this.input = this.container.querySelector(".date");
    this.calHeader = this.container.querySelector(".calendar_header");
    this.calHeaderTitle = this.container.querySelector(".calendar_header");
    this.calDays = this.container.querySelector(".cal_days");

    // Initialize
    this.setHeader(this.year, this.month);
    this.setCalDays();
    this.setCalBody(this.monthDetails);
    this.addEventListeners();
  }

  isSelectedDay = (day, cell) => {
    if (day.timestamp === this.selectedDay) {
      cell.classList.add("active");
      cell.classList.add("isSelected");
    }
  };

  // Initialize the calendar
  setHeader = (year, month) => {
    this.calHeaderTitle.innerHTML = getMonthStr(month) + " " + year;
  };

  setCalDays = () => {
    for (let i = 0; i < days.length; i++) {
      let div = document.createElement("div"),
        span = document.createElement("span");

      div.classList.add("cell_wrapper");
      span.classList.add("cell_item");

      span.innerText = days[i];

      div.appendChild(span);
      this.calDays.appendChild(div);
    }
  };

  setCalBody = (monthDetails) => {
    // Add dates to calendar
    for (let i = 0; i < monthDetails.length; i++) {
      let div = document.createElement("div");
      let cellDate = monthDetails[i];

      div.classList.add("cell_wrapper");
      div.classList.add("cal_date");
      monthDetails[i].month === 0 && div.classList.add("current");
      monthDetails[i].month === 0 && this.isSelectedDay(monthDetails[i], div);

      div.innerText = cellDate.date;
      this.calendar.appendChild(div);

      div.addEventListener("click", () => {
        this.updateSelectedDay(cellDate, div);
      });
    }
  };

  handleHeaderChange = (offset) => {
    this.month = this.month + offset;
    if (this.month === -1) {
      this.month = 11;
      this.year--;
    } else if (this.month === 12) {
      this.month = 0;
      this.year++;
    }
    this.monthDetails = getMonthDetails(this.year, this.month);
    return {
      year: this.year,
      month: this.month,
      monthDetails: this.monthDetails,
    };
  };

  updateCalendar = (offset) => {
    let newCal;
    newCal = this.handleHeaderChange(offset);
    // console.log(monthDetails)
    this.setHeader(newCal.year, newCal.month);
    this.calendar.innerHTML = "";
    this.setCalBody(newCal.monthDetails);
  };

  updateSelectedDay = (date, cell) => {
    // Call the callback function to notify the parent class of the change
    this.setSelectedDay(date.timestamp);
    console.log("from calendar" + this.selectedDay);

    document.querySelectorAll(".cell_wrapper").forEach((cell) => {
      cell.classList.remove("active");
    });
    this.isSelectedDay(date, cell);
  };

  addEventListeners = () => {};
}
