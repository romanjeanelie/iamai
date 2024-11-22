"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HeroBentoItems =
/*#__PURE__*/
function () {
  function HeroBentoItems(item) {
    _classCallCheck(this, HeroBentoItems);

    this.item = item; // Map item names to their respective methods

    var itemHandlers = {
      "tagline-item": this.getTaglineItem.bind(this),
      "multitasking-item": this.getMultitaskingItem.bind(this),
      "talk-item": this.getTalkItem.bind(this),
      "travel-item": this.getTravelItem.bind(this),
      "entertainment-item": this.getEntertainmentItem.bind(this)
    };
    var handler = itemHandlers[item.name];

    if (handler) {
      return handler();
    } else {
      console.error("No handler found for item ".concat(item.name));
    }
  }

  _createClass(HeroBentoItems, [{
    key: "getTaglineItem",
    value: function getTaglineItem() {
      var container = document.createElement("div");
      container.className = "heroBentoGrid__grid-item  square-item tagline-item";
      container.innerHTML = "\n      <h3>Get things <br />done in the real world.</h3>\n      <p>\n        Ask me to call your friends. I\u2019ll set up meetups etc.\n      </p>\n    ";
      return container;
    }
  }, {
    key: "getMultitaskingItem",
    value: function getMultitaskingItem() {
      var container = document.createElement("div");
      container.className = "heroBentoGrid__grid-item wide-item multitasking-item";
      container.innerHTML = "\n      <h3>Your Multitasking<br /> Marvel!</h3> \n      <p>\n        Watch me juggle multiple tasks simultaneously, no matter how many you throw my way.\n      </p>\n    ";
      return container;
    }
  }, {
    key: "getTalkItem",
    value: function getTalkItem() {
      var container = document.createElement("div");
      container.className = "heroBentoGrid__grid-item high-item talk-item";
      container.innerHTML = "\n      <div class=\"feature-box\">\n        <h3>Just Talk.</h3>\n        <p>\n          Ask anything, in any language. No search, just direct conversation.\n        </p>\n      </div>\n      <div class=\"feature-illustration conversation-widget\">\n        <p>Hello</p>\n        <div class=\"mic-icon\">\n          <img src=\"/icons/mic-icon.svg\" alt=\"mic icon\">\n        </div>\n      </div>\n    ";
      return container;
    }
  }, {
    key: "getTravelItem",
    value: function getTravelItem() {
      var container = document.createElement("div");
      container.className = "heroBentoGrid__grid-item wide-item travel-item";
      container.innerHTML = "\n      <div class=\"feature-box\">\n        <h3>Plan Travel. <br />Effortlessly.</h3>\n        <p>\n          Need London trip help? Ask me to find the cheapest flights, hotels, and best spots to eat and explore\n        </p>\n      </div>\n      <div class=\"feature-illustration travel-pictures\">\n        <div class=\"travel-picture\">\n          <img src=\"https://res.cloudinary.com/dfdqiqn98/image/upload/v1724312644/Home/bento-illu-beatch_oufrei.png\" alt=\"beatch\">\n        </div>\n        <div class=\"travel-picture\">\n          <img src=\"https://res.cloudinary.com/dfdqiqn98/image/upload/v1724312644/Home/bento-illu-sea_akahuh.png\" alt=\"sea\">\n        </div>\n        <div class=\"travel-picture\">\n          <img src=\"https://res.cloudinary.com/dfdqiqn98/image/upload/v1724312644/Home/bento-illu-girl_fsdl1s.png\" alt=\"girl in front of the sea\">\n        </div>\n      </div>\n    ";
      return container;
    }
  }, {
    key: "getEntertainmentItem",
    value: function getEntertainmentItem() {
      var container = document.createElement("div");
      container.className = "heroBentoGrid__grid-item square-item entertainment-item";
      container.innerHTML = "\n      <h3>Your<br class=\"desktop-break\" /> Entertainment <br /> Guru</h3>\n      <p>\n        Want to watch a movie but need to fit your schedule?\n      </p>\n    ";
      return container;
    }
  }]);

  return HeroBentoItems;
}();

exports["default"] = HeroBentoItems;