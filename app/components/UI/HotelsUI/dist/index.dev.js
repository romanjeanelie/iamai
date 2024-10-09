"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HotelsUI = void 0;

var _UIComponent2 = _interopRequireDefault(require("../UIComponent"));

var _HotelCard = _interopRequireDefault(require("./HotelCard"));

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

var HotelsUI =
/*#__PURE__*/
function (_UIComponent) {
  _inherits(HotelsUI, _UIComponent);

  function HotelsUI(HotelsSearch, HotelsSearchResults) {
    var _this;

    _classCallCheck(this, HotelsUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HotelsUI).call(this));
    _this.hotelsSearchData = HotelsSearch;
    _this.hotelsResultsData = HotelsSearchResults; // State

    _this.filter = "all"; // DOM Elements

    _this.hotelsContainer = null;

    _this.initUI();

    return _this;
  }

  _createClass(HotelsUI, [{
    key: "initUI",
    value: function initUI() {
      var _this2 = this;

      // Build the HTML content as a string
      var htmlContent = "\n      <div class=\"hotels-ui__filter-container\">\n        <button class=\"hotels-ui__filter-item active\" data-filter=\"all\">\n          All\n        </button>\n        <button class=\"hotels-ui__filter-item\" data-filter=\"airbnb\">\n          Airbnb\n        </button>\n        <button class=\"hotels-ui__filter-item\" data-filter=\"accor\">\n          Hotels\n        </button>\n      </div>\n    "; // We get the mainContainer from the parent class (UIComponent)

      this.mainContainer.innerHTML = htmlContent; // Append the hotel cards UI

      this.hotelsContainer = this.getHotelsCardsUI();
      this.mainContainer.appendChild(this.hotelsContainer);
      this.filters = this.mainContainer.querySelectorAll(".hotels-ui__filter-item");
      this.filters.forEach(function (element) {
        var filter = element.getAttribute("data-filter");
        element.addEventListener("click", function () {
          return _this2.filterHotels(filter);
        });
      });
      return this.mainContainer;
    }
  }, {
    key: "filterHotels",
    value: function filterHotels(filter) {
      var _this3 = this;

      this.filter = filter;
      this.filters.forEach(function (f) {
        f.classList.remove("active");

        if (f.getAttribute("data-filter") === filter) {
          f.classList.add("active");
        }
      }); // TO DO - Update the hotelsContainer with the new filter

      var newHotels = this.hotelsResultsData.all.filter(function (hotel) {
        return filter === "all" || hotel.website === filter;
      });
      this.hotelsContainer.innerHTML = "";
      newHotels.forEach(function (element) {
        var hotelCard = new _HotelCard["default"](element, _this3.hotelsSearchData).getElement();

        _this3.hotelsContainer.appendChild(hotelCard);
      });
      this.mainContainer.appendChild(this.hotelsContainer);
    }
  }, {
    key: "getHotelsCardsUI",
    value: function getHotelsCardsUI() {
      var _this4 = this;

      var hotelcardcontainerdiv = document.createElement("div");
      hotelcardcontainerdiv.className = "hotels-ui__main-container";
      this.hotelsResultsData.all.forEach(function (element) {
        var hotelCard = new _HotelCard["default"](element, _this4.hotelsSearchData).getElement();
        hotelcardcontainerdiv.appendChild(hotelCard);
      });
      return hotelcardcontainerdiv;
    }
  }]);

  return HotelsUI;
}(_UIComponent2["default"]);

exports.HotelsUI = HotelsUI;