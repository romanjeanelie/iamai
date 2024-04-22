"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

var _Flip = _interopRequireDefault(require("gsap/Flip"));

var _anim = _interopRequireDefault(require("../utils/anim"));

var _loadImages = _interopRequireDefault(require("../utils/loadImages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_gsap["default"].registerPlugin(_Flip["default"]);

function getDomainAndFavicon(url) {
  var urlObj = new URL(url);
  var domain = urlObj.hostname;
  var favicon = "https://".concat(domain, "/favicon.ico");
  return {
    domain: domain,
    favicon: favicon
  };
}

var DiscussionMedia =
/*#__PURE__*/
function () {
  function DiscussionMedia(_ref) {
    var container = _ref.container,
        emitter = _ref.emitter;

    _classCallCheck(this, DiscussionMedia);

    this.container = container;
    this.emitter = emitter;
    this.imagesSkeletons = [];
    this.textContainer = this.container.querySelector(".text__container");
    console.log(this.textContainer);
    this.init();
  }

  _createClass(DiscussionMedia, [{
    key: "init",
    value: function init() {
      this.topWrapper = document.createElement("div");
      this.topWrapper.className = "discussion__top-wrapper none";
      this.bottomWrapper = document.createElement("div");
      this.bottomWrapper.className = "discussion__bottom-wrapper none";
      this.container.prepend(this.topWrapper);
      this.container.appendChild(this.bottomWrapper);
    }
  }, {
    key: "addSources",
    value: function addSources(sourcesData) {
      this.sourcesHeader = document.createElement("h3");
      this.sourcesHeader.className = "discussion__sources-header";
      this.sourcesHeader.innerText = "Sources";
      this.topWrapper.appendChild(this.sourcesHeader);
      this.sources = document.createElement("div");
      this.sources.className = "sources-container";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sourcesData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var source = _step.value;
          if (!source) continue;
          var sourceEl = document.createElement("a");
          sourceEl.classList.add("sources-item");
          sourceEl.href = source;
          sourceEl.target = "_blank";

          var _getDomainAndFavicon = getDomainAndFavicon(source),
              domain = _getDomainAndFavicon.domain,
              favicon = _getDomainAndFavicon.favicon;

          var faviconEl = document.createElement("img");
          faviconEl.src = favicon;
          sourceEl.appendChild(faviconEl);
          var sourceText = document.createElement("span");
          sourceText.textContent = domain;
          sourceEl.appendChild(sourceText);
          this.sources.appendChild(sourceEl);
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

      this.topWrapper.appendChild(this.sources);
      console.log("before initial State"); // const initialState = Flip.getState([this.topWrapper, this.textContainer]);
      // console.log("after iinitial");
      // this.topWrapper.classList.remove("none");
      // console.log("before flip");
      // Flip?.from(initialState, {
      //   duration: 0.3,
      //   ease: "power3.out",
      //   onEnter: () => {
      //     console.log("before gsap");
      //     gsap.fromTo(
      //       this.topWrapper,
      //       { opacity: 0, yPercent: -100 },
      //       {
      //         opacity: 1,
      //         yPercent: 0,
      //       }
      //     );
      //   },
      // });
    }
  }, {
    key: "initImages",
    value: function initImages() {
      this.bottomWrapper.classList.remove("none");
      this.imagesHeader = document.createElement("h3");
      this.imagesHeader.className = "discussion__images-header";
      this.imagesHeader.innerText = "Images";
      this.bottomWrapper.appendChild(this.imagesHeader);
      this.imagesContainer = document.createElement("div");
      this.imagesContainer.className = "discussion__images-container user-images";
      this.createImageSkeletons();
    }
  }, {
    key: "addImages",
    value: function addImages(srcs) {
      var _this = this;

      var successfulSrcs, imgs;
      return regeneratorRuntime.async(function addImages$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap((0, _loadImages["default"])(srcs));

            case 2:
              successfulSrcs = _context.sent;
              this.destroyImageSkeletons();
              imgs = successfulSrcs.map(function (src) {
                var img = document.createElement("img");
                img.src = src;

                _this.imagesContainer.appendChild(img);

                return img;
              });
              this.handleImgClick(imgs);
              this.bottomWrapper.appendChild(this.imagesContainer);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "addUserImages",
    value: function addUserImages(srcs) {
      var imagesContainer, successfulSrcs;
      return regeneratorRuntime.async(function addUserImages$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.topWrapper.classList.remove("none");
              imagesContainer = document.createElement("div");
              imagesContainer.classList.add("discussion__images-container");
              _context2.next = 5;
              return regeneratorRuntime.awrap((0, _loadImages["default"])(srcs));

            case 5:
              successfulSrcs = _context2.sent;
              successfulSrcs.map(function (src) {
                var img = document.createElement("img");
                img.src = src;
                imagesContainer.appendChild(img);
              });
              this.topWrapper.appendChild(imagesContainer);

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "handleImgClick",
    value: function handleImgClick(imgs) {
      var _this2 = this;

      imgs.forEach(function (img, i) {
        img.addEventListener("click", function () {
          _this2.openSlider(imgs, i);
        });
      });
    }
  }, {
    key: "openSlider",
    value: function openSlider(imgs, currentIndex) {
      this.emitter.emit("slider:open", {
        imgs: imgs,
        currentIndex: currentIndex
      });
    }
  }, {
    key: "createImageSkeletons",
    value: function createImageSkeletons() {
      var _this3 = this;

      this.skeletonContainer = document.createElement("div");
      this.skeletonContainer.className = "image__skeleton-container";

      for (var i = 0; i < 8; i++) {
        var skeleton = document.createElement("div");
        skeleton.classList.add("image__skeleton-item");
        this.imagesSkeletons.push(skeleton);
      }

      this.imagesSkeletons.forEach(function (skeleton) {
        return _this3.skeletonContainer.appendChild(skeleton);
      });
      this.bottomWrapper.appendChild(this.skeletonContainer);
      this.imagesSkeletons.forEach(function (skeleton, idx) {
        (0, _anim["default"])(skeleton, [{
          transform: "scaleY(0)"
        }, {
          transform: "scaleY(1)"
        }], {
          duration: 500,
          delay: 50 * idx,
          fill: "forwards",
          ease: "ease-out"
        });
      });
    }
  }, {
    key: "destroyImageSkeletons",
    value: function destroyImageSkeletons() {
      var _this4 = this;

      this.imagesSkeletons.forEach(function (skeleton) {
        return _this4.skeletonContainer.removeChild(skeleton);
      });
    }
  }]);

  return DiscussionMedia;
}();

exports["default"] = DiscussionMedia;