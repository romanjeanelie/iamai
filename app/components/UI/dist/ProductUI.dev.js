"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getDomainAndFavicon2 = _interopRequireDefault(require("../../utils/getDomainAndFavicon"));

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

var ProductUI =
/*#__PURE__*/
function (_UIComponent) {
  _inherits(ProductUI, _UIComponent);

  function ProductUI(productsData) {
    var _this;

    _classCallCheck(this, ProductUI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProductUI).call(this));
    _this.productsData = productsData; // DOM Elements

    _this.stars = []; // Init Methods

    _this.initUI();

    return _this;
  }

  _createClass(ProductUI, [{
    key: "countSources",
    value: function countSources() {
      var sources = [];
      this.productsData.forEach(function (product) {
        // Normalize the source string
        var normalizedSource = product.source.trim().toLowerCase();

        if (!sources.includes(normalizedSource)) {
          sources.push(normalizedSource);
        }
      });
      return sources.length;
    }
  }, {
    key: "formatPrice",
    value: function formatPrice(price) {
      return price.includes(".00") ? price.substring(0, price.indexOf(".00")) : price;
    }
  }, {
    key: "initUI",
    value: function initUI() {
      var _this2 = this;

      this.mainContainer = document.createElement("div");
      this.mainContainer.classList.add("products-ui__main-container");
      this.createHeaderUI();
      var productcardcontainerdiv = document.createElement("div");
      productcardcontainerdiv.className = "products-ui__products-container";
      this.mainContainer.appendChild(productcardcontainerdiv);
      this.productsData.forEach(function _callee(element) {
        var productCard;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(_this2.createProductCard(element));

              case 2:
                productCard = _context.sent;
                productcardcontainerdiv.appendChild(productCard);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        });
      });
    }
  }, {
    key: "createHeaderUI",
    value: function createHeaderUI() {
      this.headerContainer = document.createElement("div");
      this.headerContainer.classList.add("products-ui__header");
      var sourcesTotal = this.countSources();
      this.headerContainer.innerHTML = "\n      <p class=\"products-ui__sources\">\n        Searched ".concat(sourcesTotal, " sites\n      </p>\n    ");
      this.mainContainer.appendChild(this.headerContainer);
    }
  }, {
    key: "createProductCard",
    value: function createProductCard(productData) {
      var productCardContainer, price, ratings, faviconContainer, linkWrapper;
      return regeneratorRuntime.async(function createProductCard$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              productCardContainer = document.createElement("div");
              productCardContainer.className = "products-ui__product-container";
              productCardContainer.style.order = productData.position;
              price = this.formatPrice(productData.price);
              ratings = this.createRatingUI(productData.rating);
              _context2.next = 7;
              return regeneratorRuntime.awrap(this.createSourceFavicon(productData.source));

            case 7:
              faviconContainer = _context2.sent;
              linkWrapper = document.createElement("a");
              linkWrapper.setAttribute("href", productData.link);
              linkWrapper.setAttribute("target", "_blank");
              linkWrapper.innerHTML = "\n      <div class=\"products-ui__product-header\">\n        ".concat(faviconContainer.outerHTML, "\n        <p class=\"products-ui__product-source\">").concat(productData.source, "</p>\n      </div> \n      <div class=\"products-ui__product-infos\">\n        <div class=\"products-ui__product-details\">\n          <h3>").concat(productData.title, "</h3>\n          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>\n        </div>\n        <div class=\"products-ui__product-image\">\n          <img src=\"").concat(productData.imageUrl, "\" alt=\"").concat(productData.title, "\">\n        </div>\n      </div>\n      <div class=\"products-ui__product-footer\">\n        <div class=\"products-ui__product-price-rating\">\n          <p class=\"products-ui__product-price\">").concat(price, "</p>\n          ").concat(ratings.outerHTML, "\n        </div>\n\n        <p class=\"products-ui__product-source\">").concat(productData.source, "</p>\n      </div>\n    ");
              productCardContainer.appendChild(linkWrapper);
              return _context2.abrupt("return", productCardContainer);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createSourceFavicon",
    value: function createSourceFavicon(source) {
      var _getDomainAndFavicon, favicon, faviconContainer;

      return regeneratorRuntime.async(function createSourceFavicon$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _getDomainAndFavicon = (0, _getDomainAndFavicon2["default"])(source), favicon = _getDomainAndFavicon.favicon;
              faviconContainer = document.createElement("div");
              faviconContainer.className = "products-ui__product-source-logo";
              _context3.next = 5;
              return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                var img = new Image();
                img.src = favicon;

                img.onload = function () {
                  faviconContainer.appendChild(img);
                  resolve();
                };

                img.onerror = function () {
                  resolve();
                };
              }));

            case 5:
              return _context3.abrupt("return", faviconContainer);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "createRatingUI",
    value: function createRatingUI(rating) {
      var ratingContainer = document.createElement("div");
      ratingContainer.classList.add("products-ui__product-rating");
      var wholeFill = Math.floor(rating);
      var decimalFill = rating % 1;
      if (rating === undefined) return ratingContainer;

      for (var i = 0; i < 5; i++) {
        var starContainer = document.createElement("div");
        starContainer.className = "products-ui__rating-star star-".concat(i);
        var yellow = document.createElement("div");
        yellow.className = "yellow";
        var grey = document.createElement("div");
        grey.className = "grey"; // we fill the stars yellow to the whole number of the rating

        if (i < wholeFill) {
          yellow.style.width = "100%"; // then we fill the decimal part in function of the decimal
        } else if (i === wholeFill) {
          yellow.style.width = "".concat(decimalFill * 100, "%");
        } // and then because the grey part is flex-grow 1, it will fill the rest of the stars


        starContainer.appendChild(yellow);
        starContainer.appendChild(grey);
        ratingContainer.appendChild(starContainer);
        this.stars.push(starContainer);
      }

      return ratingContainer;
    }
  }]);

  return ProductUI;
}(_UIComponent2["default"]);

exports["default"] = ProductUI;