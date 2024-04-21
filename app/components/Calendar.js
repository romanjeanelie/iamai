import { days, getMonthDetails, getMonthStr } from "../utils/dateUtils";

export default class Calendar {
  constructor({ container, month, year, selectedDay, setSelectedDay }) {
    this.container = container;
    this.selectedDay = selectedDay;
    this.setSelectedDay = setSelectedDay;

    // States
    this.month = month;
    this.year = year;
    this.monthDetails = getMonthDetails(this.year, this.month);

    // DOM Elements
    this.calendar;
    this.input;
    this.calHeader;
    this.calHeaderTitle;
    this.calDays;

    // Initialize
    this.renderStructure();
    this.renderHeader(this.year, this.month);
    this.renderDays();
    this.renderBody(this.monthDetails);
    this.addEventListeners();
  }

  isSelectedDay = (day, cell) => {
    if (day.timestamp === this.selectedDay) {
      cell.classList.add("active");
      cell.classList.add("isSelected");
    }
  };

  // Initialize the calendar
  renderStructure = () => {
    // Create calendar elements
    this.calendarContainer = document.createElement("div");
    this.calendarContainer.classList.add("date_picker_calendar");

    this.calHeader = document.createElement("div");
    this.calHeader.classList.add("calendar_header");

    this.calHeaderTitle = document.createElement("span");
    this.calHeader.appendChild(this.calHeaderTitle);

    this.calDays = document.createElement("div");
    this.calDays.classList.add("cal_days");

    this.calendar = document.createElement("div");
    this.calendar.classList.add("calendar_main");

    const calWrapper = document.createElement("div");
    calWrapper.classList.add("cal_wrapper");
    calWrapper.appendChild(this.calDays);
    calWrapper.appendChild(this.calendar);

    // Append elements to the container
    this.calendarContainer.appendChild(this.calHeader);
    this.calendarContainer.appendChild(calWrapper);

    // Append the container to the parent element
    this.container.appendChild(this.calendarContainer);
  };

  renderHeader = (year, month) => {
    this.calHeaderTitle.innerHTML = getMonthStr(month) + " " + year;
  };

  renderDays = () => {
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

  renderBody = (monthDetails) => {
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

  clearCal = () => {
    this.calDays.innerHTML = "";
    this.calendar.innerHTML = "";
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

  updateCalendarMonth = (offset) => {
    let newCal;
    newCal = this.handleHeaderChange(offset);
    this.renderHeader(newCal.year, newCal.month);
    this.calendar.innerHTML = "";
    this.renderBody(newCal.monthDetails);
  };

  updateSelectedDay = (date, cell) => {
    // Call the callback function to notify the parent class of the change
    this.setSelectedDay(date.timestamp);

    document.querySelectorAll(".cell_wrapper").forEach((cell) => {
      cell.classList.remove("active");
    });
    this.isSelectedDay(date, cell);
  };

  destroy = () => {
    this.container.removeChild(this.calendarContainer);
  };

  addEventListeners = () => {
    document.addEventListener("resize", () => {});
  };
}
