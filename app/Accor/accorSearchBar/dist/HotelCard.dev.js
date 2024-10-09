"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HotelCard =
/*#__PURE__*/
function () {
  function HotelCard(_ref) {
    var data = _ref.data,
        container = _ref.container;

    _classCallCheck(this, HotelCard);

    this.container = container;
    this.hotelData = data; // State

    this.currentImg = 0; // DOM ELEMENTS

    this.hotelCardContainer;
    this.slider;
    this.navBtns;
    this.navIndicators = [];
    this.initHotelCard();
    this.populateSlider();
    this.addEventListener();
  }

  _createClass(HotelCard, [{
    key: "initHotelCard",
    value: function initHotelCard() {
      this.hotelCardContainer = document.createElement("div");
      this.hotelCardContainer.classList.add("accorHotels__hotel-card");
      this.hotelCardContainer.innerHTML = "\n      <div class=\"slider-container\">\n        <div class=\"slider-nav-button\" data-direction=\"back\">\n          <img src=\"/icons/card-chevron-left.svg\" alt=\"back chevron\" />\n        </div>\n        <div class=\"slider-nav-button forward\" data-direction=\"forward\">\n          <img src=\"/icons/card-chevron-left.svg\" alt=\"back chevron\" />\n        </div>\n        <div class=\"slider\"> </div>\n      </div>\n      <div class=\"content-container\">\n        <div class=\"hotel-infos\">\n          <h4>".concat(this.hotelData.hotel, "</h4>\n          <div class=\"hotel-wrapper\">\n            <div class=\"hotel-ratings\">\n              <div class=\"star-icon\">\n                <img src=\"/icons/star.svg\" alt=\"star\" />\n              </div>\n              <p>").concat(this.hotelData.ratings, " <span>/ 5 </span></p>\n            </div>\n            <div class=\"hotel-location\">\n              <div class=\"location-icon\">\n                <img src=\"/icons/location-icon.svg\" alt=\"location icon\" />\n              </div>\n              <p>").concat(this.hotelData.location, " km</p>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"hotel-footer\">\n          <div class=\"hotel-price\">\n            <p class=\"reduction\">").concat(this.hotelData.reduction, "</p>\n            <p>").concat(this.hotelData.price, "<span> ").concat(this.hotelData.currency, "</span></p>\n          </div>\n\n          <a class=\"hotel-cta\" href=\"#\">\n            VIEW\n          </a>\n\n        </div>\n      </div>\n    ");
      this.container.appendChild(this.hotelCardContainer);
      this.slider = this.hotelCardContainer.querySelector(".slider");
    }
  }, {
    key: "populateSlider",
    value: function populateSlider() {
      var _this = this;

      var nav = document.createElement("div");
      nav.className = "slider-nav";
      this.hotelData.imgs.forEach(function (element, idx) {
        _this.slider.innerHTML += "\n        <div class=\"slider-img\">\n          <img src=".concat(element, " />\n        </div>\n      ");
        var navIndic = document.createElement("div");
        navIndic.className = "image-nav-indicator ".concat(idx === 0 ? "active" : "");

        _this.navIndicators.push(navIndic);

        nav.appendChild(navIndic);
      });
      this.slider.appendChild(nav);
    }
  }, {
    key: "updateNavIndicators",
    value: function updateNavIndicators(i) {
      this.navIndicators.forEach(function (navI, idx) {
        navI.classList.remove("active");
        if (i === idx) navI.classList.add("active");
      });
    }
  }, {
    key: "goTo",
    value: function goTo(index) {
      var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.slider.scrollTo({
        left: index * this.slider.offsetWidth,
        behavior: immediate ? "auto" : "smooth"
      });
    }
  }, {
    key: "handleClickNavBtn",
    value: function handleClickNavBtn(btn) {
      var isBack = btn.currentTarget.dataset.direction === "back";

      if (isBack) {
        if (this.currentImg === 0) return;
        this.currentImg--;
        this.updateNavIndicators(this.currentImg);
      } else {
        if (this.currentImg === this.hotelData.imgs.length - 1) return;
        this.currentImg++;
        this.updateNavIndicators(this.currentImg);
      }

      this.goTo(this.currentImg);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener() {
      var _this2 = this;

      this.navBtns = this.hotelCardContainer.querySelectorAll(".slider-nav-button");
      this.navBtns.forEach(function (btn) {
        btn.addEventListener("click", _this2.handleClickNavBtn.bind(_this2));
      });
    }
  }]);

  return HotelCard;
}();

exports["default"] = HotelCard;