"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoviesUI = void 0;

var _MovieDetail = require("./MovieDetail");

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

    this.isClass = true; // DOM Elements

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
    key: "addAIText",
    value: function addAIText(text) {
      var answerContainer = document.createElement("div");
      answerContainer.innerHTML = text || "";
      this.mainContainer.appendChild(answerContainer);
    }
  }, {
    key: "createMovieCard",
    value: function createMovieCard(movieData) {
      var _this2 = this;

      var card = document.createElement("div");
      card.className = "movies-card__container animate";
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
      movieData.type = "movie";
      this.movieDetails = new _MovieDetail.MovieDetails(movieData);
      this.emitter.emit("taskManager:showDetail", movieData);
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.mainContainer;
    }
  }, {
    key: "getResultsDetails",
    value: function getResultsDetails() {
      return this.movieDetails.getElement();
    }
  }]);

  return MoviesUI;
}();

exports.MoviesUI = MoviesUI;