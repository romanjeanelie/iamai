"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoviesUI = void 0;

var _UIComponent2 = _interopRequireDefault(require("../UIComponent"));

var _MovieDetail = require("./MovieDetail");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MoviesUI =
/*#__PURE__*/
function (_UIComponent) {
  _inherits(MoviesUI, _UIComponent);

  function MoviesUI(MoviesResultData, emitter) {
    var _this;

    _classCallCheck(this, MoviesUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MoviesUI).call(this));
    _this.moviesResultData = MoviesResultData;
    _this.emitter = emitter; // DOM Elements

    _this.movieDetailContainer = null; // Init Methods

    _this.initUI();

    return _this;
  }

  _createClass(MoviesUI, [{
    key: "initUI",
    value: function initUI() {
      var _this2 = this;

      this.mainContainer = document.createElement("div");
      this.mainContainer.className = "movies-ui__main-container";
      var moviesGrid = document.createElement("div");
      moviesGrid.className = "movies-ui__movies-grid";
      this.moviesResultData.forEach(function (movieData) {
        var movieCard = _this2.createMovieCard(movieData);

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
      var _this3 = this;

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
        return _this3.handleMovieCardClick(event, movieData);
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
    key: "getResultsDetails",
    value: function getResultsDetails() {
      return this.movieDetails.getElement();
    }
  }]);

  return MoviesUI;
}(_UIComponent2["default"]);

exports.MoviesUI = MoviesUI;