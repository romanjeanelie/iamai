"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlightUI = void 0;

var _dateUtils = require("../../utils/dateUtils");

var _UIComponent2 = _interopRequireDefault(require("./UIComponent"));

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

var FlightUI =
/*#__PURE__*/
function (_UIComponent) {
  _inherits(FlightUI, _UIComponent);

  function FlightUI(FlightSearch, FlightSearchResults) {
    var _this;

    _classCallCheck(this, FlightUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FlightUI).call(this));
    _this.FlightSearch = FlightSearch;
    _this.FlightSearchResults = FlightSearchResults; // Init Methods

    _this.initUI();

    return _this;
  }

  _createClass(FlightUI, [{
    key: "createNavButtons",
    value: function createNavButtons() {
      var _this2 = this;

      var flighttogglebuttoncontainerdiv = document.createElement("div");
      flighttogglebuttoncontainerdiv.className = "flight-toggle-button-container";
      this.mainContainer.appendChild(flighttogglebuttoncontainerdiv);
      var flighttogglebutton = document.createElement("button");
      flighttogglebutton.className = "flight-toggle-button active";
      flighttogglebutton.addEventListener("click", function (event) {
        return _this2.toggleflights(event);
      });
      flighttogglebutton.innerHTML = "Outbound";
      flighttogglebutton.id = "Outbound";
      flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton);
      var flighttogglebutton2 = document.createElement("button");
      flighttogglebutton2.className = "flight-toggle-button";
      flighttogglebutton2.addEventListener("click", function (event) {
        return _this2.toggleflights(event);
      });
      flighttogglebutton2.id = "Return";
      flighttogglebutton2.innerHTML = "Return";
      flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton2);
    }
  }, {
    key: "createFlightCard",
    value: function createFlightCard(FlightSearchResult) {
      var flightCard = document.createElement("div");
      flightCard.className = "flightCard";
      flightCard.setAttribute("onclick", "window.open('" + FlightSearchResult.link_url + "', '_blank');");
      var date = (0, _dateUtils.formatDateString)(FlightSearchResult.travel_date);
      var stops = FlightSearchResult.travel.stops === 0 ? "Direct" : FlightSearchResult.travel.stops + " stop";
      flightCard.innerHTML = "\n      <section class=\"flightCard__main\">\n        <div class=\"flightCard__main-header\">\n          <p class=\"flightCard__departure-date\">\n            ".concat(date, "\n          </p>\n\n          <p class=\"flightCard__duration\">\n            ").concat(FlightSearchResult.travel.duration, ", ").concat(stops, "\n          </p>\n\n          <p class=\"flightCard__arrival-date\">\n            ").concat(date, "\n          </p>\n        </div>\n\n        <div class=\"flightCard__main-body\">\n          <p class=\"flightCard__departure-time\">\n            ").concat(FlightSearchResult.travel.start_time, "\n          </p>\n          <div class=\"flightCard__progress-line\">\n            <div class=\"flightCard__progress-dot\"></div>\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"116\" height=\"8\" viewBox=\"0 0 116 8\" fill=\"none\">\n              <path d=\"M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM115.354 4.35354C115.549 4.15828 115.549 3.8417 115.354 3.64644L112.172 0.464456C111.976 0.269194 111.66 0.269194 111.464 0.464456C111.269 0.659719 111.269 0.976301 111.464 1.17156L114.293 3.99999L111.464 6.82842C111.269 7.02368 111.269 7.34026 111.464 7.53552C111.66 7.73079 111.976 7.73079 112.172 7.53552L115.354 4.35354ZM1 4.5L115 4.49999L115 3.49999L1 3.5L1 4.5Z\" \n              />\n            </svg>\n            <div class=\"flightCard__progress-dot\"></div>\n            <img class=\"flightCard__airline-logo\" src=\"").concat(FlightSearchResult.travel.airlines_logo, "\" alt=\"").concat(FlightSearchResult.travel.airlines, "\">\n          </div>\n\n          <p class=\"flightCard__arrival-time\">\n            ").concat(FlightSearchResult.travel.end_time, "\n          </p>\n        </div>\n\n        <div class=\"flightCard__main-footer\">\n          <p class=\"flightCard__departure-airport-code\">\n            ").concat(FlightSearchResult.airport1_code, "\n          </p>\n          <p> ").concat(FlightSearchResult.travel.airlines, " </p>\n          <p class=\"flightCard__arrival-airport-code\">\n            ").concat(FlightSearchResult.airport2_code, "\n          </p>\n        </div>\n      </section>\n      <section class=\"flightCard__footer\">\n        <p class=\"flightCard__source\">\n            ").concat(FlightSearchResult.website, "              \n        </p>\n\n        <div class=\"flightCard__price\">\n          <p>\n            Price\n          </p>\n          <p class=\"flightCard__price-value\">\n            ").concat(FlightSearchResult.price, "\n          </p>\n        </div>\n      </section>\n    ");
      return flightCard;
    }
  }, {
    key: "initUI",
    value: function initUI() {
      var _this3 = this;

      this.mainContainer = document.createElement("div");
      this.mainContainer.className = "FlightContainer Flight-Container";
      this.mainContainer.setAttribute("name", "flightResult");

      if (this.FlightSearch.departure_end_date.length > 0 && this.FlightSearch.return_end_date.length > 0) {
        this.createNavButtons();
      }

      var resultsArray = this.FlightSearchResults.Outbound;

      for (var i = 0; i < 2; i++) {
        if (i == 1) resultsArray = this.FlightSearchResults.Return;

        if (resultsArray && resultsArray.length > 0) {
          (function () {
            var flightResultdiv = document.createElement("div");
            flightResultdiv.className = "flightResult";

            if (i == 0) {
              flightResultdiv.className = "flightResult";
              flightResultdiv.setAttribute("id", "flightResultOutbound");

              _this3.mainContainer.appendChild(flightResultdiv);
            }

            if (i == 1) {
              flightResultdiv.setAttribute("id", "flightResultReturn");
              flightResultdiv.setAttribute("style", "display:None");

              _this3.mainContainer.appendChild(flightResultdiv);
            }

            resultsArray.forEach(function (FlightSearchResult) {
              var card = _this3.createFlightCard(FlightSearchResult);

              flightResultdiv.appendChild(card);
            });
          })();
        }
      }
    }
  }, {
    key: "toggleflights",
    value: function toggleflights(event) {
      var element = event.target;

      if (element.id == "Outbound") {
        element.classList.add("active");
        element.parentElement.querySelector("#Return").classList.remove("active");
        element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "grid";
        element.parentElement.parentElement.querySelector("#flightResultReturn").style.display = "none";
      } else {
        element.classList.add("active");
        element.parentElement.querySelector("#Outbound").classList.remove("active");
        element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "none";
        element.parentElement.parentElement.querySelector("#flightResultReturn").style.display = "grid";
      }
    }
  }]);

  return FlightUI;
}(_UIComponent2["default"]);

exports.FlightUI = FlightUI;