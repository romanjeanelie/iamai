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

    this.mainContainer = null; // Init Methods

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
      var productCardContainer = document.createElement("div");
      productCardContainer.className = "shopping-card";
      var productcarddivA = document.createElement("a");
      productcarddivA.setAttribute("href", productData.link);
      productcarddivA.setAttribute("target", "_blank");
      productcarddivA.innerHTML = "\n      <div class=\"shopping-image-dev\">\n        <img class=\"shopping-image\" src=\"".concat(productData.imageUrl, "\" alt=\"").concat(productData.title, "\">\n      </div>\n      <h3 class=\"shopping-name\">").concat((0, _truncate["default"])(productData.title, 30), "</h3>\n      <p class=\"shopping-source\">").concat(productData.source, "</p>\n      <p class=\"shopping-price\">").concat(productData.price.includes(".00") ? productData.price.substring(0, productData.price.indexOf(".00")) : productData.price, "</p>\n      <div class=\"shopping-overlay\"></div>\n    ");
      productCardContainer.appendChild(productcarddivA);
      return productCardContainer;
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