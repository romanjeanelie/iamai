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
        removeStatus = _ref.removeStatus,
        scrollToBottom = _ref.scrollToBottom,
        emitter = _ref.emitter;

    _classCallCheck(this, DiscussionTabs);

    this.container = container;
    this.emitter = emitter;
    this.removeStatus = removeStatus;
    this.scrollToBottom = scrollToBottom;
    this.selectedTab = "";
    this.tabsHeaderContainer = null;
    this.tabsContentContainer = null;
    this.tabs = [];
    this.imagesSkeletons = [];
    this.sources = null;
    this.imagesContainer = null;
    this.init();
  }

  _createClass(DiscussionTabs, [{
    key: "init",
    value: function init() {
      if (this.tabsHeaderContainer || this.tabsContentContainer) return;
      this.tabsContainer = document.createElement("div");
      this.tabsContainer.className = "discussion__tabs-container none";
      this.tabsHeaderContainer = document.createElement("ul");
      this.tabsHeaderContainer.className = "discussion__tabs-header";
      this.tabsContentContainer = document.createElement("div");
      this.tabsContentContainer.className = "discussion__tabs-content";
      this.tabsContainer.appendChild(this.tabsHeaderContainer);
      this.tabsContainer.appendChild(this.tabsContentContainer);
      this.container.appendChild(this.tabsContainer);
    }
  }, {
    key: "addTab",
    value: function addTab(tabName) {
      this.tabsContainer.classList.remove("none");
      var li = document.createElement("li");
      li.className = tabName;

      if (tabName === "Images") {
        li.style.order = 0;
      } else {
        li.style.order = 1;
        li.className = "sourcesTab";
      }

      li.textContent = tabName;
      this.tabs.push(tabName);
      this.tabsHeaderContainer.appendChild(li);

      if (tabName === "Images") {
        this.createImageSkeletons(li);
      }
    }
  }, {
    key: "initSources",
    value: function initSources(sourcesData) {
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

      this.tabsContentContainer.appendChild(this.sources);
    }
  }, {
    key: "initImages",
    value: function initImages(srcs) {
      var _this = this;

      var successfulSrcs, imgs;
      return regeneratorRuntime.async(function initImages$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.tabsContainer.classList.remove("none");
              this.imagesContainer = document.createElement("div");
              this.imagesContainer.className = "images__container"; // console.time("loadImages");

              _context.next = 5;
              return regeneratorRuntime.awrap((0, _loadImages["default"])(srcs));

            case 5:
              successfulSrcs = _context.sent;
              // console.timeEnd("loadImages");
              this.imagesSkeletons.forEach(function (skeleton) {
                return _this.skeletonContainer.removeChild(skeleton);
              });
              imgs = successfulSrcs.map(function (src) {
                var img = document.createElement("img");
                img.src = src;

                _this.imagesContainer.appendChild(img);

                return img;
              });
              this.handleImgClick(imgs);
              this.tabsContentContainer.appendChild(this.imagesContainer);

            case 10:
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

      for (var i = 0; i < 4; i++) {
        var skeleton = document.createElement("div");
        skeleton.classList.add("image__skeleton-item");
        this.imagesSkeletons.push(skeleton);
      }

      this.imagesSkeletons.forEach(function (skeleton) {
        return _this3.skeletonContainer.appendChild(skeleton);
      });
      this.tabsContentContainer.appendChild(this.skeletonContainer);
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
  }]);

  return DiscussionTabs;
}();

exports["default"] = DiscussionTabs;