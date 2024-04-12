"use strict";

var _gsap = _interopRequireDefault(require("gsap"));

var _accorData = require("./accorData");

var _index = _interopRequireDefault(require("./accorSearchBar/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// TO DO
// [X] set up the city breaks with initCityBreaks
// [X] manage all the different states for the search bar (create a search bar class)
// [X] manage the filters carousel
// [] make the forgotten components responsive
// [] make the animations for the Call
// [] make the custom Date Picker
// [] make the search bar responsive
var Accor =
/*#__PURE__*/
function () {
  function Accor() {
    _classCallCheck(this, Accor);

    // States
    this.filterSelected = ""; // DOM Elements

    this.filterContainer = document.querySelector(".accorFilters__items-container");
    this.cityBreaksContainer = document.querySelector(".accorBreaks__container");
    this.filtersArrow = document.querySelector(".accorFilters__arrow"); // Init

    this.initFilters();
    this.initCityBreaks();
    this.addEventListeners();
    new _index["default"]();
  } // ------ Filters Section ------


  _createClass(Accor, [{
    key: "initFilters",
    value: function initFilters() {
      var _this = this;

      _accorData.filtersArray.forEach(function (filter) {
        var filterContainer = document.createElement("li");
        filterContainer.classList.add("accorFilters__item");
        filterContainer.dataset.filter = filter;
        var label = filter.toUpperCase();
        filterContainer.innerHTML = "\n      <img src=\"/icons/accorFilters/".concat(filter, "-icon.svg\" alt=\"arrow right icon\" />\n      <p>").concat(label, "</p>\n      ");

        _this.filterContainer.appendChild(filterContainer);

        filterContainer.addEventListener("click", function () {
          _this.updateSelectedFilter(filter);
        });
      });
    }
  }, {
    key: "updateSelectedFilter",
    value: function updateSelectedFilter(filter) {
      this.filterSelected = filter;
    }
  }, {
    key: "navigateThroughFilters",
    value: function navigateThroughFilters() {
      var filters = document.querySelectorAll(".accorFilters__item");
      var lastFilter = filters[filters.length - 1];
      var isLastFilterVisible = lastFilter.offsetLeft + lastFilter.clientWidth <= this.filterContainer.scrollLeft + this.filterContainer.clientWidth;

      if (isLastFilterVisible) {
        this.filtersArrow.style.transform = "translateY(-50%) rotate(0deg)"; // If the last filter is visible, animate the filters back to the start

        _gsap["default"].to(this.filterContainer, {
          scrollLeft: 0,
          duration: 1
        });
      } else {
        this.filtersArrow.style.transform = "translateY(-50%) rotate(180deg)"; // If the last filter is not visible, animate the filters to the left

        _gsap["default"].to(this.filterContainer, {
          scrollLeft: this.filterContainer.scrollLeft + this.filterContainer.clientWidth,
          duration: 1
        });
      }
    } // ------ City Breaks Section ------

  }, {
    key: "initCityBreaks",
    value: function initCityBreaks() {
      var _this2 = this;

      _accorData.cityBreaksData.forEach(function (cityBreak) {
        _this2.cityBreaksContainer.innerHTML += "\n      <div class=\"accorBreaks__item\">\n        <div\n          class=\"accorBreaks__item-location\"\n          style=\"background-image: url('".concat(cityBreak.bg, "')\"\n        >\n          <p>").concat(cityBreak.city, "</p>\n        </div>\n        <div class=\"accorBreaks__item-footer\">\n          <p class=\"accorBreaks__item-price\">\n            ").concat(cityBreak.price, "\n          </p>\n          <p class=\"accorBreaks__item-currency\">\n            ").concat(cityBreak.currency, "\n          </p>\n        </div>\n      </div>\n      ");
      });
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.filtersArrow.addEventListener("click", this.navigateThroughFilters.bind(this));
    }
  }]);

  return Accor;
}();

new Accor();