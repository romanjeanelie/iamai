import { getDayLabel } from "../../../utils/dateUtils";

export class MovieDetails {
  constructor(movie) {
    this.movie = movie;

    // DOM Elements
    this.movieDetailContainer = null;

    // Init Methods
    this.createMovieDetailUI();
  }

  organizeTheatresByDate(movie) {
    const dateArray = [];

    movie.Theatre?.forEach((theater) => {
      theater.DateTime.forEach((dateTime) => {
        const date = dateTime.Date;
        let dateEntry = dateArray.find((entry) => entry.date === date);
        if (!dateEntry) {
          dateEntry = { date, theaters: [] };
          dateArray.push(dateEntry);
        }
        let theaterEntry = dateEntry.theaters.find((entry) => entry.name === theater.Name);
        if (!theaterEntry) {
          theaterEntry = { name: theater.Name, showtimes: [] };
          dateEntry.theaters.push(theaterEntry);
        }
        theaterEntry.showtimes.push(...dateTime.Show);
      });
    });

    return dateArray;
  }

  getFormattedDate(timestamp) {
    const date = new Date(timestamp);
    const dayLabel = getDayLabel(date);

    const dayValue = date.getDate().toString().padStart(2, "0");
    const monthValue = date.toLocaleString("default", { month: "long" });
    const formattedMonth = `${dayValue} ${monthValue}`;

    return { dayLabel, formattedMonth };
  }

  displayOrganizedData(data) {
    const container = document.createElement("div");
    container.classList.add("movie-details__showtimes-container");

    data.forEach((dateEntry) => {
      const dateElement = document.createElement("p");
      dateElement.className = "movie-details__showtimes-date animate";
      const { dayLabel, formattedMonth } = this.getFormattedDate(dateEntry.date);
      dateElement.innerHTML = `${dayLabel} <span> • ${formattedMonth} </span>`;

      container.appendChild(dateElement);

      dateEntry.theaters.forEach((theater) => {
        const theatreCard = this.createTheatreCard(theater);
        container.appendChild(theatreCard);
      });
    });

    return container;
  }

  createTheatreCard(theater) {
    const theatreCard = document.createElement("div");
    theatreCard.className = "movie-details__theatre-card animate";

    const theaterHeader = document.createElement("div");
    theaterHeader.className = "movie-details__theatre-header";

    const theaterName = document.createElement("h5");
    theaterName.textContent = theater.name;

    const theatreChevron = document.createElement("button");
    theatreChevron.className = "movie-details__theatre-chevron";
    theatreChevron.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M2 2L6 6L10 2" stroke="#979BAC" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    `;

    theaterHeader.appendChild(theaterName);
    // append the chevron only if there are more than 4 showtimes
    if (theater.showtimes.length > 4) theaterHeader.appendChild(theatreChevron);

    const showtimesContainer = document.createElement("div");
    showtimesContainer.className = "movie-details__showtimes";

    theatreChevron.addEventListener("click", () => this.toggleTheatreDetails(theatreCard));

    theater.showtimes.forEach((showtime) => {
      const showtimeElement = document.createElement("a");
      showtimeElement.className = "movie-details__showtime-item";
      // remove the extra :00 at the end of the time
      const formattedTime = showtime.Time.slice(0, -3);

      showtimeElement.textContent = formattedTime;
      showtimeElement.setAttribute("href", showtime.BookingUrl);
      showtimesContainer.appendChild(showtimeElement);
    });

    theatreCard.appendChild(theaterHeader);
    theatreCard.appendChild(showtimesContainer);

    return theatreCard;
  }

  toggleTheatreDetails(theatreCard) {
    theatreCard.classList.toggle("movie-details__theatre-card--open");
  }

  createMovieDetailUI() {
    this.movieDetailContainer = document.createElement("div");
    this.movieDetailContainer.className = "movie-details__container";

    // Create movie header section
    const header = document.createElement("div");
    header.className = "movie-details__header animate";

    const moviePoster = document.createElement("div");
    moviePoster.classList.add("movie-details__poster");
    moviePoster.innerHTML = `<img src="${this.movie.MoviePoster}" alt="${this.movie.MovieTitle} Poster" />`;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-details__info");

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = this.movie.MovieTitle;

    movieInfo.appendChild(movieTitle);

    header.appendChild(moviePoster);
    header.appendChild(movieInfo);

    // Create showtimes section
    const dataOrganizedByDate = this.organizeTheatresByDate(this.movie);
    const showtimesContainer = this.displayOrganizedData(dataOrganizedByDate);

    // Append everything to the container
    this.movieDetailContainer.appendChild(header);
    this.movieDetailContainer.appendChild(showtimesContainer);
  }

  getElement() {
    return this.movieDetailContainer;
  }
}
