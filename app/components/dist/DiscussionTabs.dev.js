"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _anim = _interopRequireDefault(require("../utils/anim"));

var _loadImages = _interopRequireDefault(require("../utils/loadImages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function getDomainAndFavicon(url) {
  var urlObj = new URL(url);
  var domain = urlObj.hostname;
  var favicon = "https://".concat(domain, "/favicon.ico");
  return {
    domain: domain,
    favicon: favicon
  };
}

var DiscussionTabs =
/*#__PURE__*/
function () {
  function DiscussionTabs(_ref) {
    var container = _ref.container,
        emitter = _ref.emitter;

    _classCallCheck(this, DiscussionTabs);

    this.container = container;
    this.emitter = emitter;
    this.imagesSkeletons = [];
    this.init();
  }

  _createClass(DiscussionTabs, [{
    key: "init",
    value: function init() {
      this.sourcesWrapper = document.createElement("div");
      this.sourcesWrapper.className = "discussion__sources-wrapper none";
      this.imagesWrapper = document.createElement("div");
      this.imagesWrapper.className = "discussion__images-wrapper none";
      this.container.prepend(this.sourcesWrapper);
      this.container.appendChild(this.imagesWrapper);
    }
  }, {
    key: "addSources",
    value: function addSources(sourcesData) {
      console.log("from DiscussionTabs" + sourcesData);
      this.sourcesWrapper.classList.remove("none");
      this.sourcesHeader = document.createElement("h3");
      this.sourcesHeader.className = "discussion__sources-header";
      this.sourcesHeader.innerText = "Sources";
      this.sourcesWrapper.appendChild(this.sourcesHeader);
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

      this.sourcesWrapper.appendChild(this.sources);
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
              this.imagesWrapper.classList.remove("none");
              this.imagesHeader = document.createElement("h3");
              this.imagesHeader.className = "discussion__images-header";
              this.imagesHeader.innerText = "Images";
              this.imagesWrapper.appendChild(this.imagesHeader);
              this.imagesContainer = document.createElement("div");
              this.imagesContainer.className = "discussion__images-container";
              this.createImageSkeletons();
              _context.next = 10;
              return regeneratorRuntime.awrap((0, _loadImages["default"])(srcs));

            case 10:
              successfulSrcs = _context.sent;
              this.destroyImageSkeletons();
              imgs = successfulSrcs.map(function (src) {
                var img = document.createElement("img");
                img.src = src;

                _this.imagesContainer.appendChild(img);

                return img;
              });
              this.handleImgClick(imgs);
              this.imagesWrapper.appendChild(this.imagesContainer);

            case 15:
            case "end":
              return _context.stop();
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
      this.imagesWrapper.appendChild(this.skeletonContainer);
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

  return DiscussionTabs;
}();

exports["default"] = DiscussionTabs;