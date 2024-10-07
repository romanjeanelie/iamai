export class MoviesUI {
  constructor(MoviesResultData, emitter) {
    this.moviesResultData = MoviesResultData;
    this.emitter = emitter;

    // State

    // DOM Elements
    this.mainContainer = null;
    this.movieDetailContainer = null;

    // Init Methods
    this.initUI();
  }

  initUI() {
    this.mainContainer = document.createElement("div");
    this.mainContainer.className = "movies-ui__main-container";

    const moviesGrid = document.createElement("div");
    moviesGrid.className = "movies-ui__movies-grid";

    this.moviesResultData.forEach((movieData) => {
      const movieCard = this.createMovieCard(movieData);
      moviesGrid.appendChild(movieCard);
    });

    this.mainContainer.appendChild(moviesGrid);

    const movieDetails = document.createElement("div");
    movieDetails.id = "movie-details";
    this.mainContainer.appendChild(movieDetails);
  }

  createMovieCard(movieData) {
    const card = document.createElement("div");
    card.className = "movies-card__container";
    card.setAttribute("data-movie-title", movieData.title);

    const infosContainer = document.createElement("div");
    infosContainer.className = "movies-card__infos-container";

    const poster = document.createElement("div");
    poster.className = "movies-card__poster";
    const img = document.createElement("img");
    img.alt = movieData.MovieTitle;
    img.src = movieData.MoviePoster;
    poster.appendChild(img);

    const details = document.createElement("div");
    details.className = "movies-card__details-container";

    const title = document.createElement("h4");
    title.className = "movies-card__title";
    title.textContent = movieData.MovieTitle;

    const button = document.createElement("button");
    button.className = "movies-card__cta-button";
    button.textContent = "See More";

    details.appendChild(title);
    details.appendChild(button);

    infosContainer.appendChild(poster);
    infosContainer.appendChild(details);

    card.appendChild(infosContainer);

    // Add event listener directly to the card
    card.addEventListener("click", (event) => this.handleMovieCardClick(event, movieData));

    return card;
  }

  handleMovieCardClick(event, movieData) {
    const data = {
      type: "movie",
      data: movieData,
    };
    this.createMovieDetailUI(movieData);
    this.emitter.emit("taskManager:showDetail", event, data);
  }

  createMovieDetailUI(movie) {
    this.movieDetailContainer = document.createElement("div");
    this.movieDetailContainer.className = "movie-details";

    // Create movie header section
    const header = document.createElement("div");
    header.classList.add("movie-header");

    const moviePoster = document.createElement("img");
    moviePoster.src = movie.poster;
    moviePoster.alt = `${movie.title} Poster`;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");

    const movieTitle = document.createElement("h1");
    movieTitle.textContent = movie.title;

    const movieGenre = document.createElement("p");
    movieGenre.textContent = movie.genre;

    const movieIMDB = document.createElement("p");
    movieIMDB.textContent = `IMDB: ${movie.imdb}`;

    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieGenre);
    movieInfo.appendChild(movieIMDB);
    header.appendChild(moviePoster);
    header.appendChild(movieInfo);

    // Create showtimes section
    const showtimesContainer = document.createElement("div");
    showtimesContainer.classList.add("showtimes-container");

    movie.showtimes?.forEach((showtime) => {
      const showtimeRow = document.createElement("div");
      showtimeRow.classList.add("showtime");

      const cinemaName = document.createElement("div");
      cinemaName.classList.add("cinema-name");

      const cinemaLogo = document.createElement("img");
      cinemaLogo.src = showtime.cinemaLogo;
      cinemaLogo.alt = showtime.cinema;

      const cinemaText = document.createElement("span");
      cinemaText.textContent = showtime.cinema;

      cinemaName.appendChild(cinemaLogo);
      cinemaName.appendChild(cinemaText);

      const showtimeSlots = document.createElement("div");
      showtimeSlots.classList.add("showtime-slots");

      showtime.times.forEach((time) => {
        const timeSlot = document.createElement("span");
        timeSlot.textContent = time;
        showtimeSlots.appendChild(timeSlot);
      });

      showtimeRow.appendChild(cinemaName);
      showtimeRow.appendChild(showtimeSlots);
      showtimesContainer.appendChild(showtimeRow);
    });

    // Append everything to the container
    this.movieDetailContainer.appendChild(header);
    this.movieDetailContainer.appendChild(showtimesContainer);
  }

  getMoviesDateShowtime(MovieTitle, theatre, date, moviedetailsdatesdiv) {
    const moviedetailsdateselectordiv = document.createElement("div");
    moviedetailsdateselectordiv.className = "movie-details-date-selector";
    const moviedetailsdateleftbuttonbutton = document.createElement("button");
    moviedetailsdateleftbuttonbutton.className = "arrow left-arrow";
    moviedetailsdateleftbuttonbutton.innerHTML = "&lt;&nbsp;&nbsp;";
    moviedetailsdateleftbuttonbutton.addEventListener("click", (event) =>
      this.getmovieshowtimes(event, -1, MovieTitle)
    );
    if (theatre.DateTime[0].Date == date) moviedetailsdateleftbuttonbutton.disabled = true;
    moviedetailsdateselectordiv.appendChild(moviedetailsdateleftbuttonbutton);

    const moviedetailsdatespan = document.createElement("span");
    moviedetailsdatespan.innerText = date;
    moviedetailsdateselectordiv.appendChild(moviedetailsdatespan);

    const moviedetailsdaterightbuttonbutton = document.createElement("button");
    moviedetailsdaterightbuttonbutton.className = "arrow right-arrow";
    moviedetailsdaterightbuttonbutton.innerHTML = "&nbsp;&nbsp;&gt;";
    moviedetailsdaterightbuttonbutton.addEventListener("click", (event) =>
      this.getmovieshowtimes(event, 1, MovieTitle)
    );
    if (theatre.DateTime[theatre.DateTime.length - 1].Date == date) moviedetailsdaterightbuttonbutton.disabled = true;
    moviedetailsdateselectordiv.appendChild(moviedetailsdaterightbuttonbutton);
    moviedetailsdatesdiv.appendChild(moviedetailsdateselectordiv);

    theatre.DateTime.forEach((moviesdatetime) => {
      if (moviesdatetime.Date == date) {
        const moviedetailsshowtimesdiv = document.createElement("div");
        moviedetailsshowtimesdiv.className = "movie-details-showtimes";
        moviesdatetime.Show.forEach((moviestime) => {
          const moviedetailsshowtimebutton = document.createElement("button");
          moviedetailsshowtimebutton.className = "movie-details-showtime";
          moviedetailsshowtimebutton.innerHTML = moviestime.Time.slice(0, -3);
          moviedetailsshowtimebutton.setAttribute("onclick", "window.open('" + moviestime.BookingUrl + "', '_blank');");
          // moviedetailsshowtimebutton.addEventListener("click", (event) =>
          //   this.submitmovieselection(MovieTitle, theatre.Name, moviesdatetime.Date, moviestime.Time.slice(0, -3),moviestime.BookingUrl)
          // );
          moviedetailsshowtimesdiv.appendChild(moviedetailsshowtimebutton);
        });
        moviedetailsdatesdiv.appendChild(moviedetailsshowtimesdiv);
      }
    });
  }

  getmovieshowtimes(event, day, MovieTitle) {
    let element = event.target;
    let moviedetail = element.parentElement.parentElement.parentElement.querySelector(".movie-details-dates");
    let moviedetaildata = JSON.parse(moviedetail.getAttribute("data-details").replace("&#39;", /'/g));
    if (day == 1) {
      const previousSiblingSpan =
        element.previousElementSibling.tagName === "SPAN" ? element.previousElementSibling : null;
      let date = new Date(previousSiblingSpan.innerHTML);
      date.setDate(date.getDate() + 1);
      moviedetail.innerHTML = "";
      this.getMoviesDateShowtime(MovieTitle, moviedetaildata, date.toISOString().slice(0, 10), moviedetail);
    } else {
      const nextSiblingSpan = element.nextElementSibling.tagName === "SPAN" ? element.nextElementSibling : null;
      let date = new Date(nextSiblingSpan.innerHTML);
      date.setDate(date.getDate() - 1);
      moviedetail.innerHTML = "";
      this.getMoviesDateShowtime(MovieTitle, moviedetaildata, date.toISOString().slice(0, 10), moviedetail);
    }
  }

  async submitmovieselection(MovieTitle, Theatre, Date, Time, BookingUrl) {
    MovieTitle = MovieTitle.replace("’", "'");
    if (this.agentawaiting) {
      var texttosend =
        "book movie ticket for " +
        JSON.stringify({
          movie_name: MovieTitle,
          theatre_name: Theatre,
          movie_date: Date,
          movie_time: Time,
        });
      var data = JSON.stringify({
        message_type: "user_message",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: texttosend,
        },
      });
      this.user.user.getIdToken(true).then(async (idToken) => {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });

        xhr.open("POST", HOST + "/workflows/message/" + this.workflowID);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);

        xhr.send(data);
        this.agentawaiting = false;
      });
    } else {
      var texttosend =
        "book movie ticket for " +
        JSON.stringify({
          movie_name: MovieTitle,
          theatre_name: Theatre,
          movie_date: Date,
          movie_time: Time,
        });
      this.callsubmit(texttosend, "", this.container);
    }
  }

  getElement() {
    return this.mainContainer;
  }

  getResultsDetails() {
    return this.movieDetailContainer;
  }
}
