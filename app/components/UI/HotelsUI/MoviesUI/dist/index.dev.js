"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoviesUI = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MoviesUI =
/*#__PURE__*/
function () {
  function MoviesUI(MoviesResultData, emitter) {
    _classCallCheck(this, MoviesUI);

    this.moviesResultData = MoviesResultData;
    this.emitter = emitter; // State
    // DOM Elements

    this.mainContainer = null;
    this.movieDetailContainer = null; // Init Methods

    this.initUI();
  }

  _createClass(MoviesUI, [{
    key: "initUI",
    value: function initUI() {
      var _this = this;

      this.mainContainer = document.createElement("div");
      this.mainContainer.className = "movies-ui__main-container";
      var moviesGrid = document.createElement("div");
      moviesGrid.className = "movies-ui__movies-grid";
      this.moviesResultData.forEach(function (movieData) {
        var movieCard = _this.createMovieCard(movieData);

        moviesGrid.appendChild(movieCard);
      });
      this.mainContainer.appendChild(moviesGrid);
      var movieDetails = document.createElement("div");
      movieDetails.id = "movie-details";
      this.mainContainer.appendChild(movieDetails);
    }
  }, {
    key: "createMovieCard",
    value: function createMovieCard(movieData) {
      var _this2 = this;

      var card = document.createElement("div");
      card.className = "movies-card__container";
      card.setAttribute("data-movie-title", movieData.title);
      var infosContainer = document.createElement("div");
      infosContainer.className = "movies-card__infos-container";
      var poster = document.createElement("div");
      poster.className = "movies-card__poster";
      var img = document.createElement("img");
      img.alt = movieData.MovieTitle;
      img.src = movieData.MoviePoster;
      poster.appendChild(img);
      var details = document.createElement("div");
      details.className = "movies-card__details-container";
      var title = document.createElement("h4");
      title.className = "movies-card__title";
      title.textContent = movieData.MovieTitle;
      var button = document.createElement("button");
      button.className = "movies-card__cta-button";
      button.textContent = "See More";
      details.appendChild(title);
      details.appendChild(button);
      infosContainer.appendChild(poster);
      infosContainer.appendChild(details);
      card.appendChild(infosContainer); // Add event listener directly to the card

      card.addEventListener("click", function (event) {
        return _this2.handleMovieCardClick(event, movieData);
      });
      return card;
    }
  }, {
    key: "handleMovieCardClick",
    value: function handleMovieCardClick(event, movieData) {
      var data = {
        type: "movie",
        data: movieData
      };
      this.createMovieDetailUI(movieData);
      this.emitter.emit("taskManager:showDetail", event, data);
    }
  }, {
    key: "organizeShowtimesByDate",
    value: function organizeShowtimesByDate(movie) {
      var dateMap = new Map();
      movie.Theatre.forEach(function (theater) {
        theater.DateTime.forEach(function (dateTime) {
          var _theaterMap$get;

          var date = dateTime.Date;

          if (!dateMap.has(date)) {
            dateMap.set(date, new Map());
          }

          var theaterMap = dateMap.get(date);

          if (!theaterMap.has(theater.Name)) {
            theaterMap.set(theater.Name, []);
          }

          (_theaterMap$get = theaterMap.get(theater.Name)).push.apply(_theaterMap$get, _toConsumableArray(dateTime.Show));
        });
      });
      return dateMap;
    }
  }, {
    key: "displayOrganizedData",
    value: function displayOrganizedData(data) {
      var container = document.createElement("div");
      container.className = "showtimes-container";
      Object.keys(data).sort().forEach(function (date) {
        var dateElement = document.createElement("h4");
        dateElement.textContent = "Date: ".concat(date);
        container.appendChild(dateElement);
        var theatersContainer = document.createElement("div");
        theatersContainer.className = "theaters-container";
        Object.keys(organizedData[date]).forEach(function (theaterName) {
          var theaterElement = document.createElement("div");
          theaterElement.className = "theater";
          var theaterNameElement = document.createElement("h5");
          theaterNameElement.textContent = theaterName;
          theaterElement.appendChild(theaterNameElement);
          var showtimesElement = document.createElement("p");
          showtimesElement.textContent = "Showtimes: ".concat(organizedData[date][theaterName].join(", "));
          theaterElement.appendChild(showtimesElement);
          theatersContainer.appendChild(theaterElement);
        });
        container.appendChild(theatersContainer);
      });
      return container;
    }
  }, {
    key: "createMovieDetailUI",
    value: function createMovieDetailUI(movie) {
      this.movieDetailContainer = document.createElement("div");
      this.movieDetailContainer.className = "movie-details__container"; // Create movie header section

      var header = document.createElement("div");
      header.classList.add("movie-details__header");
      var moviePoster = document.createElement("div");
      moviePoster.classList.add("movie-details__poster");
      moviePoster.innerHTML = "<img src=\"".concat(movie.MoviePoster, "\" alt=\"").concat(movie.MovieTitle, " Poster\" />");
      var movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-details__info");
      var movieTitle = document.createElement("h3");
      movieTitle.textContent = movie.MovieTitle;
      movieInfo.appendChild(movieTitle);
      header.appendChild(moviePoster);
      header.appendChild(movieInfo); // Create showtimes section

      var organizedByDateData = this.organizeShowtimesByDate(movie);
      var showtimesContainer = this.organizeShowtimesByDate(organizedByDateData);
      showtimesContainer.classList.add("movie-details__showtimes-container"); // Append everything to the container

      this.movieDetailContainer.appendChild(header);
      this.movieDetailContainer.appendChild(showtimesContainer);
    }
  }, {
    key: "getMoviesDateShowtime",
    value: function getMoviesDateShowtime(MovieTitle, theatre, date, moviedetailsdatesdiv) {
      var _this3 = this;

      var moviedetailsdateselectordiv = document.createElement("div");
      moviedetailsdateselectordiv.className = "movie-details-date-selector";
      var moviedetailsdateleftbuttonbutton = document.createElement("button");
      moviedetailsdateleftbuttonbutton.className = "arrow left-arrow";
      moviedetailsdateleftbuttonbutton.innerHTML = "&lt;&nbsp;&nbsp;";
      moviedetailsdateleftbuttonbutton.addEventListener("click", function (event) {
        return _this3.getmovieshowtimes(event, -1, MovieTitle);
      });
      if (theatre.DateTime[0].Date == date) moviedetailsdateleftbuttonbutton.disabled = true;
      moviedetailsdateselectordiv.appendChild(moviedetailsdateleftbuttonbutton);
      var moviedetailsdatespan = document.createElement("span");
      moviedetailsdatespan.innerText = date;
      moviedetailsdateselectordiv.appendChild(moviedetailsdatespan);
      var moviedetailsdaterightbuttonbutton = document.createElement("button");
      moviedetailsdaterightbuttonbutton.className = "arrow right-arrow";
      moviedetailsdaterightbuttonbutton.innerHTML = "&nbsp;&nbsp;&gt;";
      moviedetailsdaterightbuttonbutton.addEventListener("click", function (event) {
        return _this3.getmovieshowtimes(event, 1, MovieTitle);
      });
      if (theatre.DateTime[theatre.DateTime.length - 1].Date == date) moviedetailsdaterightbuttonbutton.disabled = true;
      moviedetailsdateselectordiv.appendChild(moviedetailsdaterightbuttonbutton);
      moviedetailsdatesdiv.appendChild(moviedetailsdateselectordiv);
      theatre.DateTime.forEach(function (moviesdatetime) {
        if (moviesdatetime.Date == date) {
          var moviedetailsshowtimesdiv = document.createElement("div");
          moviedetailsshowtimesdiv.className = "movie-details-showtimes";
          moviesdatetime.Show.forEach(function (moviestime) {
            var moviedetailsshowtimebutton = document.createElement("button");
            moviedetailsshowtimebutton.className = "movie-details-showtime";
            moviedetailsshowtimebutton.innerHTML = moviestime.Time.slice(0, -3);
            moviedetailsshowtimebutton.setAttribute("onclick", "window.open('" + moviestime.BookingUrl + "', '_blank');"); // moviedetailsshowtimebutton.addEventListener("click", (event) =>
            //   this.submitmovieselection(MovieTitle, theatre.Name, moviesdatetime.Date, moviestime.Time.slice(0, -3),moviestime.BookingUrl)
            // );

            moviedetailsshowtimesdiv.appendChild(moviedetailsshowtimebutton);
          });
          moviedetailsdatesdiv.appendChild(moviedetailsshowtimesdiv);
        }
      });
    }
  }, {
    key: "getmovieshowtimes",
    value: function getmovieshowtimes(event, day, MovieTitle) {
      var element = event.target;
      var moviedetail = element.parentElement.parentElement.parentElement.querySelector(".movie-details-dates");
      var moviedetaildata = JSON.parse(moviedetail.getAttribute("data-details").replace("&#39;", /'/g));

      if (day == 1) {
        var previousSiblingSpan = element.previousElementSibling.tagName === "SPAN" ? element.previousElementSibling : null;
        var date = new Date(previousSiblingSpan.innerHTML);
        date.setDate(date.getDate() + 1);
        moviedetail.innerHTML = "";
        this.getMoviesDateShowtime(MovieTitle, moviedetaildata, date.toISOString().slice(0, 10), moviedetail);
      } else {
        var nextSiblingSpan = element.nextElementSibling.tagName === "SPAN" ? element.nextElementSibling : null;

        var _date = new Date(nextSiblingSpan.innerHTML);

        _date.setDate(_date.getDate() - 1);

        moviedetail.innerHTML = "";
        this.getMoviesDateShowtime(MovieTitle, moviedetaildata, _date.toISOString().slice(0, 10), moviedetail);
      }
    }
  }, {
    key: "submitmovieselection",
    value: function submitmovieselection(MovieTitle, Theatre, Date, Time, BookingUrl) {
      var _this4 = this;

      var texttosend, data;
      return regeneratorRuntime.async(function submitmovieselection$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              MovieTitle = MovieTitle.replace("’", "'");

              if (this.agentawaiting) {
                texttosend = "book movie ticket for " + JSON.stringify({
                  movie_name: MovieTitle,
                  theatre_name: Theatre,
                  movie_date: Date,
                  movie_time: Time
                });
                data = JSON.stringify({
                  message_type: "user_message",
                  user: "User",
                  message: {
                    type: "text",
                    json: {},
                    text: texttosend
                  }
                });
                this.user.user.getIdToken(true).then(function _callee(idToken) {
                  var xhr;
                  return regeneratorRuntime.async(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          xhr = new XMLHttpRequest();
                          xhr.withCredentials = true;
                          xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === 4) {
                              console.log(this.responseText);
                            }
                          });
                          xhr.open("POST", HOST + "/workflows/message/" + _this4.workflowID);
                          xhr.setRequestHeader("Content-Type", "application/json");
                          xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);
                          xhr.send(data);
                          _this4.agentawaiting = false;

                        case 8:
                        case "end":
                          return _context.stop();
                      }
                    }
                  });
                });
              } else {
                texttosend = "book movie ticket for " + JSON.stringify({
                  movie_name: MovieTitle,
                  theatre_name: Theatre,
                  movie_date: Date,
                  movie_time: Time
                });
                this.callsubmit(texttosend, "", this.container);
              }

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.mainContainer;
    }
  }, {
    key: "getResultsDetails",
    value: function getResultsDetails() {
      return this.movieDetailContainer;
    }
  }]);

  return MoviesUI;
}();

exports.MoviesUI = MoviesUI;