"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _PopUp = _interopRequireDefault(require("../PhoneCall/PopUp"));

var _CardSliders = require("../PhoneCall/PopUp/CardSliders");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CardSlider =
/*#__PURE__*/
function () {
  function CardSlider(_ref) {
    var container = _ref.container,
        data = _ref.data;

    _classCallCheck(this, CardSlider);

    this.data = data;
    this.container = container; // DOM Elements

    this.sliderContainer = null;
    this.header = null;
    this.slider = null;
    this.slides = [];
    this.gutterRight = null; // Init methods

    this.generateSlider();
    this.handleSliderGutters();
    this.addEvents();
  }

  _createClass(CardSlider, [{
    key: "generateSlider",
    value: function generateSlider() {
      // Create container
      this.sliderContainer = document.createElement("div");
      this.sliderContainer.className = "cardSlider__container"; // Create header

      this.header = document.createElement("h2");
      this.header.className = "cardSlider__header";
      this.header.textContent = this.data.sliderHeader;
      this.sliderContainer.appendChild(this.header); // Create slider

      this.slider = document.createElement("div");
      this.slider.className = "cardSlider__slider no-scrollbar";
      this.sliderContainer.appendChild(this.slider); // Create slider cards

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.data.sliderCards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sliderCard = _step.value;
          var card = document.createElement("div");
          card.className = "cardSlider__slider-card";
          this.generateCard(sliderCard, card);
          this.slides.push(card);
          this.slider.appendChild(card);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.gutterRight = document.createElement("div");
      this.gutterRight.className = "right-gutter";
      this.slider.appendChild(this.gutterRight); // Append the container to the body or another parent element

      this.container.appendChild(this.sliderContainer);
    }
  }, {
    key: "generateCard",
    value: function generateCard(data, card) {
      switch (data.type) {
        case _CardSliders.cardsType.classic:
          card.classList.add("classic");
          var header = document.createElement("div");
          header.className = "cardSlider__slider-card-header";
          var title = document.createElement("h3");
          title.textContent = data.title;
          var subTitle = document.createElement("p");
          subTitle.textContent = data.subTitle;
          header.appendChild(title);
          header.appendChild(subTitle);
          var button = document.createElement("button");
          button.textContent = data.buttonText;
          button.addEventListener("click", function () {
            return new _PopUp["default"]({
              section: "dark",
              data: data
            });
          });
          card.style.backgroundImage = "url(".concat(data.imgCropped, ")");
          card.appendChild(header);
          card.appendChild(button);
          break;

        case _CardSliders.cardsType.language:
          card.classList.add("language");
          var languageP = document.createElement("p");
          languageP.textContent = data.title;
          languageP.style.background = data.gradient;
          card.appendChild(languageP);
          break;

        default:
          card.classList.add("empty");
          break;
      }
    }
  }, {
    key: "handleSliderGutters",
    value: function handleSliderGutters() {
      if (window.innerWidth >= 1280) {
        var x = (window.innerWidth - 1232) / 2;
        this.slider.style.paddingLeft = "".concat(x, "px");
      }

      var slideWidth = this.slides[0].offsetWidth;
      var padding = window.innerWidth < 560 ? 0 : (window.innerWidth - slideWidth) / 2;
      this.gutterRight.style.paddingRight = "".concat(padding, "px");
    }
  }, {
    key: "addEvents",
    value: function addEvents() {
      window.addEventListener("resize", this.handleSliderGutters.bind(this));
    }
  }]);

  return CardSlider;
}();

exports["default"] = CardSlider;