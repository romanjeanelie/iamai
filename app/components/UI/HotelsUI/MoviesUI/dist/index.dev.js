"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoviesUI = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MoviesUI =
/*#__PURE__*/
function () {
  function MoviesUI(MoviesResultData) {
    _classCallCheck(this, MoviesUI);

    this.moviesResultData = MoviesResultData; // State
    // DOM Elements

    this.mainContainer = null; // Init Methods

    this.initUI();
  }

  _createClass(MoviesUI, [{
    key: "initUI",
    value: function initUI() {
      var _this = this;

      this.mainContainer = document.createElement("div");
      this.mainContainer.className = "movies-ui__main-container";
      var moviesCardContainerHTML = this.moviesResultData.map(function (element) {
        var movieDetails = JSON.stringify(element).replace(/'/g, "&#39;");
        var movieTitle = element.MovieTitle.replace(/'/g, "&#39;");
        return "\n        <div class=\"movies-card__container\">\n          <div class=\"movies-card__infos-container\">\n            <div class=\"movies-card__poster\">\n              <img alt=\"".concat(movieTitle, "\" src=\"").concat(element.MoviePoster, "\" />\n            </div>\n            <div class=\"movies-card__details-container\">\n              <h4 class=\"movies-card__title\">").concat(element.MovieTitle, "</h4> \n              <button class=\"movies-card__cta-button\">See More</button>\n            </div>\n          </div>\n        </div>\n      ");
      }).join("");
      this.mainContainer.innerHTML = "\n      <div class=\"movies-ui__movies-grid\">\n        ".concat(moviesCardContainerHTML, "\n      </div>\n      <div id=\"movie-details\"></div>\n    "); // Attach event listeners

      var movieCards = this.mainContainer.querySelectorAll(".movies-card");
      movieCards.forEach(function (card) {
        card.addEventListener("click", function (event) {
          return _this.showMovieDetail(event);
        });
      });
      return this.mainContainer;
    }
  }, {
    key: "showMovieDetail",
    value: function showMovieDetail(event) {
      var _this2 = this;

      var element = event.target;
      var moviedetail = element.parentElement.parentElement.parentElement.querySelector("#movie-details");
      moviedetail.innerHTML = "";
      var moviedetaildata = JSON.parse(element.parentElement.getAttribute("data-details").replace("&#39;", /'/g)); // let divinnerhtml = "";

      moviedetaildata.Theatre.forEach(function (theatre) {
        var moviedetailscarddiv = document.createElement("div");
        moviedetailscarddiv.className = "movie-details-card";
        var moviedetailstheaterdiv = document.createElement("div");
        moviedetailstheaterdiv.className = "movie-details-theater-header";
        moviedetailstheaterdiv.innerHTML = theatre.Name;
        moviedetailscarddiv.appendChild(moviedetailstheaterdiv);
        var moviedetailsdatesdiv = document.createElement("div");
        moviedetailsdatesdiv.className = "movie-details-dates";
        moviedetailsdatesdiv.setAttribute("data-details", JSON.stringify(theatre).replace(/'/g, "&#39;"));

        _this2.getMoviesDateShowtime(moviedetaildata.MovieTitle, theatre, theatre.DateTime[0].Date, moviedetailsdatesdiv);

        moviedetailsc;
        arddiv.appendChild(moviedetailsdatesdiv);
        moviedetail.appendChild(moviedetailscarddiv);
      });
      this.scrollToDiv(moviedetail);
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
  }]);

  return MoviesUI;
}();

exports.MoviesUI = MoviesUI;