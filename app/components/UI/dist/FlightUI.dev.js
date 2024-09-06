"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlightUI = void 0;

var _dateUtils = require("../../utils/dateUtils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FlightUI =
/*#__PURE__*/
function () {
  function FlightUI(FlightSearch, FlightSearchResults) {
    _classCallCheck(this, FlightUI);

    this.FlightSearch = FlightSearch;
    this.FlightSearchResults = FlightSearchResults;
    this.initUI();
  }

  _createClass(FlightUI, [{
    key: "initUI",
    value: function initUI() {
      var _this = this;

      this.FlightContainer = document.createElement("div");
      this.FlightContainer.className = "FlightContainer Flight-Container";
      this.FlightContainer.setAttribute("name", "flightResult");

      if (this.FlightSearch.departure_end_date.length > 0 && this.FlightSearch.return_end_date.length > 0) {
        var flighttogglebuttoncontainerdiv = document.createElement("div");
        flighttogglebuttoncontainerdiv.className = "flight-toggle-button-container";
        this.FlightContainer.appendChild(flighttogglebuttoncontainerdiv);
        var flighttogglebutton = document.createElement("button");
        flighttogglebutton.className = "flight-toggle-button active";
        flighttogglebutton.addEventListener("click", function (event) {
          return _this.toggleflights(event);
        });
        flighttogglebutton.innerHTML = "Outbound";
        flighttogglebutton.id = "Outbound";
        flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton);
        var flighttogglebutton2 = document.createElement("button");
        flighttogglebutton2.className = "flight-toggle-button";
        flighttogglebutton2.addEventListener("click", function (event) {
          return _this.toggleflights(event);
        });
        flighttogglebutton2.id = "Return";
        flighttogglebutton2.innerHTML = "Return";
        flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton2);
      }

      var FlightSearchResultsArr = this.FlightSearchResults.Outbound;

      for (var flightsi = 0; flightsi < 2; flightsi++) {
        if (flightsi == 1) FlightSearchResultsArr = this.FlightSearchResults.Return;

        if (FlightSearchResultsArr.length > 0) {
          (function () {
            var flightResultdiv = document.createElement("div");
            flightResultdiv.className = "flightResult";

            if (flightsi == 0) {
              flightResultdiv.className = "flightResult";
              flightResultdiv.setAttribute("id", "flightResultOutbound");

              _this.FlightContainer.appendChild(flightResultdiv);
            }

            if (flightsi == 1) {
              flightResultdiv.setAttribute("id", "flightResultReturn");
              flightResultdiv.setAttribute("style", "display:None");

              _this.FlightContainer.appendChild(flightResultdiv);
            }

            var flightcheapest = 0;
            FlightSearchResultsArr.forEach(function (FlightSearchResult) {
              var flightCarddiv = document.createElement("div");
              flightCarddiv.className = "flightCard";
              flightCarddiv.setAttribute("onclick", "window.open('" + FlightSearchResult.link_url + "', '_blank');");
              flightResultdiv.appendChild(flightCarddiv);
              var date = (0, _dateUtils.formatDateString)(FlightSearchResult.travel_date);
              var stops = FlightSearchResult.travel.stops === 0 ? "Direct" : FlightSearchResult.travel.stops + " stop";
              flightCarddiv.innerHTML = "\n            <section class=\"flightCard__main\">\n              <div class=\"flightCard__main-header\">\n                <p class=\"flightCard__departure-date\">\n                  ".concat(date, "\n                </p>\n\n                <p class=\"flightCard__duration\">\n                  ").concat(FlightSearchResult.travel.duration, ", ").concat(stops, "\n                </p>\n\n                <p class=\"flightCard__arrival-date\">\n                  ").concat(date, "\n                </p>\n              </div>\n\n              <div class=\"flightCard__main-body\">\n                <p class=\"flightCard__departure-time\">\n                  ").concat(FlightSearchResult.travel.start_time, "\n                </p>\n                <div class=\"flightCard__progress-line\">\n                  <div class=\"flightCard__progress-dot\"></div>\n                  <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"116\" height=\"8\" viewBox=\"0 0 116 8\" fill=\"none\">\n                    <path d=\"M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM115.354 4.35354C115.549 4.15828 115.549 3.8417 115.354 3.64644L112.172 0.464456C111.976 0.269194 111.66 0.269194 111.464 0.464456C111.269 0.659719 111.269 0.976301 111.464 1.17156L114.293 3.99999L111.464 6.82842C111.269 7.02368 111.269 7.34026 111.464 7.53552C111.66 7.73079 111.976 7.73079 112.172 7.53552L115.354 4.35354ZM1 4.5L115 4.49999L115 3.49999L1 3.5L1 4.5Z\" \n                    />\n                  </svg>\n                  <div class=\"flightCard__progress-dot\"></div>\n                  <img class=\"flightCard__airline-logo\" src=\"").concat(FlightSearchResult.travel.airlines_logo, "\" alt=\"").concat(FlightSearchResult.travel.airlines, "\">\n                </div>\n\n                <p class=\"flightCard__arrival-time\">\n                  ").concat(FlightSearchResult.travel.end_time, "\n                </p>\n              </div>\n\n              <div class=\"flightCard__main-footer\">\n                <p class=\"flightCard__departure-airport-code\">\n                  ").concat(FlightSearchResult.airport1_code, "\n                </p>\n                <p> ").concat(FlightSearchResult.travel.airlines, " </p>\n                <p class=\"flightCard__arrival-airport-code\">\n                  ").concat(FlightSearchResult.airport2_code, "\n                </p>\n              </div>\n            </section>\n            <section class=\"flightCard__footer\">\n              <p class=\"flightCard__source\">\n                  ").concat(FlightSearchResult.website, "              \n              </p>\n\n              <div class=\"flightCard__price\">\n                <p>\n                  Price\n                </p>\n                <p class=\"flightCard__price-value\">\n                  ").concat(FlightSearchResult.price, "\n                </p>\n              </div>\n            </section>\n          ");
            });
          })();
        }
      }
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.FlightContainer;
    }
  }]);

  return FlightUI;
}();

exports.FlightUI = FlightUI;