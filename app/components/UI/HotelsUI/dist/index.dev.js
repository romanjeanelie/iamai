"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HotelCard = _interopRequireDefault(require("./HotelCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HotelsUI =
/*#__PURE__*/
function () {
  function HotelsUI(HotelsSearch, HotelsSearchResults) {
    _classCallCheck(this, HotelsUI);

    this.hotelsSearch = HotelsSearch;
    this.hotelsSearchResults = HotelsSearchResults; // State

    this.filter = "all"; // DOM Elements

    this.mainContainer = null;
    this.hotelsContainer = null;
    this.initUI();
  }

  _createClass(HotelsUI, [{
    key: "initUI",
    value: function initUI() {
      var _this = this;

      // Initialize the UI
      this.mainContainer = document.createElement("div"); // Build the HTML content as a string

      var htmlContent = "\n      <div class=\"hotels-ui__filter-container\">\n        <button class=\"hotels-ui__filter-item active\" data-filter=\"all\">\n          All\n        </button>\n        <button class=\"hotels-ui__filter-item\" data-filter=\"airbnb\">\n          Airbnb\n        </button>\n        <button class=\"hotels-ui__filter-item\" data-filter=\"accor\">\n          Hotels\n        </button>\n      </div>\n    "; // Set the innerHTML of hotelsContainer

      this.mainContainer.innerHTML = htmlContent; // Append the hotel cards UI

      this.hotelsContainer = this.getHotelsCardsUI();
      this.mainContainer.appendChild(this.hotelsContainer);
      this.filters = this.mainContainer.querySelectorAll(".hotels-ui__filter-item");
      this.filters.forEach(function (element) {
        var filter = element.getAttribute("data-filter");
        element.addEventListener("click", function (event) {
          return _this.filterHotels(event, filter);
        });
      });
      return this.mainContainer;
    }
  }, {
    key: "filterHotels",
    value: function filterHotels(event, filter) {
      this.filter = filter;
      this.filters.forEach(function (f) {
        f.classList.remove("active");

        if (f.getAttribute("data-filter") === filter) {
          f.classList.add("active");
        }
      }); // TO DO - Update the hotelsContainer with the new filter
    }
  }, {
    key: "getHotelsCardsUI",
    value: function getHotelsCardsUI() {
      var hotelcardcontainerdiv = document.createElement("div");
      hotelcardcontainerdiv.className = "hotelscard-container";
      this.hotelsSearchResults.all.forEach(function (element) {
        var hotelCard = new _HotelCard["default"](element).getElement();
        hotelcardcontainerdiv.appendChild(hotelCard);
      });
      return hotelcardcontainerdiv;
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.mainContainer;
    }
  }]);

  return HotelsUI;
}();

exports["default"] = HotelsUI;