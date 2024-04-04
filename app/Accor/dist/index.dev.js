"use strict";

var _accorData = require("./accorData");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// TO DO
// [] set up the city breaks with initCityBreaks
// [] manage all the different states for the search bar (create a search bar class)
// [] manage the filters carousel
var Accor =
/*#__PURE__*/
function () {
  function Accor() {
    _classCallCheck(this, Accor);

    // States
    this.filterSelected = ""; // DOM Elements

    this.filterContainer = document.querySelector(".accorFilters__items-container"); // Init

    this.initFilters();
  }

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
      console.log("".concat(filter, " is selected"));
      this.filterSelected = filter;
    }
  }]);

  return Accor;
}();

new Accor();