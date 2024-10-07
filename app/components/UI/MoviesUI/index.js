import { MovieDetails } from "./MovieDetail";

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
    this.movieDetails = new MovieDetails(movieData);
    this.emitter.emit("taskManager:showDetail");
  }

  getElement() {
    return this.mainContainer;
  }

  getResultsDetails() {
    return this.movieDetails.getElement();
  }
}
