export const days = ["S", "M", "T", "W", "T", "F", "S"];
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getNumberOfDays = (year, month) => {
  return 40 - new Date(year, month, 40).getDate();
};

export const getDayDetails = (args) => {
  // Calculate a temporary date value by subtracting the first day of the week from the index of the day in the month
  let date = args.index - args.firstDay;

  // Calculate the day of the week (0-6, where 0 is Sunday and 6 is Saturday) by taking the modulus of the index with 7
  let day = args.index % 7;

  // Calculate the previous month and year
  let prevMonth = args.month - 1;
  let prevYear = args.year;

  // If the previous month is less than 0 (i.e., it's currently January), set the previous month to December (11) and decrement the year
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }

  // Get the number of days in the previous month
  let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

  // Determine the actual date. If 'date' is negative, it's a day from the previous month.
  // If 'date' is not negative, it's a day from the current or next month.
  // Add 1 to adjust because dates start from 1, not 0.
  let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;

  // Determine whether the day belongs to the previous month (-1), the current month (0), or the next month (1) based on the temporary date
  let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;

  // Calculate the timestamp of the day by creating a new Date object with the year, month, and date, and then calling the getTime method
  let timestamp = new Date(args.year, args.month, _date).getTime();

  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: days[day],
  };
};

export const getMonthDetails = (year, month) => {
  let firstDay = new Date(year, month).getDay();
  let numberOfDays = getNumberOfDays(year, month);
  let monthArray = [];
  let rows = 5;
  let currentDay = null;
  let index = 0;
  let cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index,
        numberOfDays,
        firstDay,
        year,
        month,
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
};

export const getMonthStr = (month) => months[Math.max(Math.min(11, month), 0)] || "Month";

export const formatDate = (date, options = { day: "numeric", month: "long" }) => {
  return date.toLocaleDateString("en-US", options);
};

export const formatDateString = (dateStr) => {
  // Split the date string into components
  const [day, month, year] = dateStr.split("-");

  // Create a new Date object (Note: month is 0-indexed)
  const date = new Date(year, month - 1, day);

  // Format the date to "01 Oct"
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  return formattedDate;
};

export const getDayLabel = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Remove time part for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) {
    return "Today";
  } else if (inputDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return inputDate.toLocaleDateString("en-GB", { weekday: "long" });
  }
};
