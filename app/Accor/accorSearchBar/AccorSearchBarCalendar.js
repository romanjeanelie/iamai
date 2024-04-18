import { days, getMonthDetails, getMonthStr } from "../../utils/dateUtils";

const oneDay = 60 * 60 * 24 * 1000;

let todayTimestamp = Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60;

export default class AccorSearchBarCalendar {
  constructor() {
    // States
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.monthDetails = getMonthDetails(this.year, this.month);

    this.selectedDay = todayTimestamp;

    // DOM Elements
    this.calendar = document.querySelector(".calendar_main");
    this.input = document.querySelector(".date");
    this.calHeader = document.querySelector(".calendar_header");
    this.calHeaderTitle = document.querySelector(".calendar_header span");
    this.calDays = document.querySelector(".cal_days");
    this.btns = document.querySelectorAll(".cal-btn");

    // Initialize
    this.setHeader(this.year, this.month);
    this.setCalDays();
    this.setCalBody(this.monthDetails);
    this.addEventListeners();
  }

  // Utils
  isCurrentDay = (day, cell) => {
    if (day.timestamp === todayTimestamp) {
      cell.classList.add("active");
      cell.classList.add("isCurrent");
    }
  };

  isSelectedDay = (day, cell) => {
    if (day.timestamp === selectedDay) {
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
      let div = document.createElement("div"),
        span = document.createElement("span");

      div.classList.add("cell_wrapper");
      div.classList.add("cal_date");
      monthDetails[i].month === 0 && div.classList.add("current");
      monthDetails[i].month === 0 && this.isCurrentDay(monthDetails[i], div);
      span.classList.add("cell_item");

      span.innerText = monthDetails[i].date;

      div.appendChild(span);
      this.calendar.appendChild(div);
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

  updateCalendar = (btn) => {
    let newCal, offset;
    if (btn.classList.contains("back")) {
      offset = -1;
    } else if (btn.classList.contains("front")) {
      offset = 1;
    }
    newCal = this.handleHeaderChange(offset);
    // console.log(monthDetails)
    this.setHeader(newCal.year, newCal.month);
    this.calendar.innerHTML = "";
    this.setCalBody(newCal.monthDetails);
  };

  addEventListeners = () => {
    this.btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.updateCalendar(btn);
      });
    });
  };
}
