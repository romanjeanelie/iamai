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
    key: "initUI",
    value: function initUI() {
      var _this = this;

      this.mainContainer = document.createElement("div");
      var productcardcontainerdiv = document.createElement("div");
      productcardcontainerdiv.className = "shopping-container";
      this.mainContainer.appendChild(productcardcontainerdiv);
      this.productsData.forEach(function (element) {
        var productCard = _this.initCardUI(element);

        productcardcontainerdiv.appendChild(productCard);
      });
    }
  }, {
    key: "initCardUI",
    value: function initCardUI(productData) {
      var productCardContainer = document.createElement("div");
      productCardContainer.className = "shopping-card";
      var productcarddivA = document.createElement("a");
      productcarddivA.setAttribute("href", productData.link);
      productcarddivA.setAttribute("target", "_blank");
      productCardContainer.appendChild(productcarddivA);
      var productimagediv = document.createElement("div");
      productimagediv.className = "shopping-image-dev";
      productcarddivA.appendChild(productimagediv);
      var productimage = document.createElement("img");
      productimage.className = "shopping-image";
      productimage.setAttribute("src", productData.imageUrl);
      productimage.setAttribute("alt", productData.title);
      productimagediv.appendChild(productimage);
      var productname = document.createElement("h3");
      productname.className = "shopping-name";
      var ptitle = (0, _truncate["default"])(productData.title, 30);
      productname.innerHTML = ptitle;
      productcarddivA.appendChild(productname);
      var productsource = document.createElement("p");
      productsource.className = "shopping-source";
      productsource.innerHTML = productData.source;
      productcarddivA.appendChild(productsource);
      var productprice = document.createElement("p");
      productprice.className = "shopping-price";
      if (productData.price.includes(".00")) productprice.innerHTML = productData.price.substring(0, productData.price.indexOf(".00"));else productprice.innerHTML = productData.price;
      productcarddivA.appendChild(productprice);
      var productoverlay = document.createElement("div");
      productoverlay.className = "shopping-overlay";
      productcarddivA.appendChild(productoverlay);
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