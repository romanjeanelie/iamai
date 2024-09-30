"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _truncate = _interopRequireDefault(require("../../utils/truncate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ProductUI =
/*#__PURE__*/
function () {
  function ProductUI(productsData) {
    _classCallCheck(this, ProductUI);

    this.productsData = productsData; // DOM Elements

    this.mainContainer = null;
    this.stars = []; // Init Methods

    this.initUI();
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
      var _this = this;

      this.mainContainer = document.createElement("div");
      this.mainContainer.classList.add("products-ui__main-container");
      this.createHeaderUI();
      var productcardcontainerdiv = document.createElement("div");
      productcardcontainerdiv.className = "products-ui__products-container";
      this.mainContainer.appendChild(productcardcontainerdiv);
      this.productsData.forEach(function (element) {
        var productCard = _this.createProductCard(element);

        productcardcontainerdiv.appendChild(productCard);
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
      console.log(productData);
      var productCardContainer = document.createElement("div");
      productCardContainer.className = "products-ui__product-container";
      var price = this.formatPrice(productData.price);
      var ratings = this.createRatingUI(productData.rating);
      var linkWrapper = document.createElement("a");
      linkWrapper.setAttribute("href", productData.link);
      linkWrapper.setAttribute("target", "_blank");
      linkWrapper.innerHTML = "\n      <div class=\"products-ui__product-infos\">\n        <div class=\"products-ui__product-details\">\n          <h3>".concat(productData.title, "</h3>\n          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>\n        </div>\n        <div class=\"products-ui__product-image\">\n          <img src=\"").concat(productData.imageUrl, "\" alt=\"").concat(productData.title, "\">\n        </div>\n      </div>\n      <div class=\"products-ui__product-footer\">\n        <div class=\"products-ui__product-price-rating\">\n          <p class=\"products-ui__product-price\">").concat(price, "</p>\n          ").concat(ratings.outerHTML, "\n        </div>\n\n        <p class=\"products-ui__product-source\">").concat(productData.source, "</p>\n      </div>\n    ");
      productCardContainer.appendChild(linkWrapper);
      return productCardContainer;
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
  }, {
    key: "getElement",
    value: function getElement() {
      return this.mainContainer;
    }
  }]);

  return ProductUI;
}();

exports["default"] = ProductUI;