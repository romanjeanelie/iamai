"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _anim = _interopRequireDefault(require("../utils/anim"));

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
      this.tabsHeaderContainer = document.createElement("ul");
      this.tabsHeaderContainer.className = "discussion__tabs-header hidden";
      this.tabsContentContainer = document.createElement("div");
      this.tabsContentContainer.className = "discussion__tabs-content hidden";
      this.container.appendChild(this.tabsHeaderContainer);
      this.container.appendChild(this.tabsContentContainer);
    }
  }, {
    key: "addTab",
    value: function addTab(tabName) {
      var li = document.createElement("li");
      li.className = tabName;

      if (tabName === "Images") {
        li.style.order = 0;
      } else {
        li.style.order = 1;
      }

      li.textContent = tabName;
      this.tabs.push(tabName);
      this.tabsHeaderContainer.appendChild(li);

      if (tabName === "Images") {
        this.createImageSkeletons(li);
      }

      this.handleTabClick(li);
    }
  }, {
    key: "handleTabClick",
    value: function handleTabClick(tab) {
      var _this = this;

      tab.addEventListener("click", function () {
        _this.updateTabUi(tab);
      });
    }
  }, {
    key: "updateTabUi",
    value: function updateTabUi(tab) {
      if (!tab) return;

      if (this.selectedTab === tab.textContent) {
        // If the clicked tab is already the selected tab, remove 'active'
        tab.classList.remove("active");
        this.selectedTab = ""; // Reset selectedTab
      } else {
        // If the clicked tab is not the selected tab, make it active
        this.tabsHeaderContainer.querySelectorAll("li").forEach(function (li) {
          return li.classList.remove("active");
        });
        tab.classList.add("active");
        this.selectedTab = tab.textContent;
      } // displaying, or not, the section based on the selected tab


      if (this.selectedTab === "Sources") {// this.sources?.classList.remove("none");
        // this.imagesContainer?.classList.add("none");
      } else if (this.selectedTab === "Images") {// this.sources?.classList.add("none");
        // this.imagesContainer?.classList.remove("none");
      } else if (this.selectedTab === "") {// !this.sources?.classList.contains("none") && this.sources?.classList.add("none");
        // !this.imagesContainer?.classList.contains("none") && this.imagesContainer?.classList.add("none");
      }
    }
  }, {
    key: "displayDefaultTab",
    value: function displayDefaultTab() {
      // by default if there are images, we display the images tab
      var hasImages = this.tabs.some(function (tab) {
        return tab === "Images";
      });

      if (hasImages) {
        var defaultTab = this.tabsHeaderContainer.querySelector(".Images");
        this.updateTabUi(defaultTab);
      } else {
        // if there are no images, we display the first tab available
        var _defaultTab = this.tabsHeaderContainer.querySelector(".".concat(this.tabs[0]));

        this.updateTabUi(_defaultTab);
      }
    }
  }, {
    key: "showTabs",
    value: function showTabs() {
      this.tabsHeaderContainer.classList.remove("hidden");
      this.tabsContentContainer.classList.remove("hidden");
    }
  }, {
    key: "initSources",
    value: function initSources(sourcesData) {
      this.sources = document.createElement("div");
      this.sources.className = "images__sources none";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = sourcesData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var source = _step.value;
          if (!source) continue;
          var sourceEl = document.createElement("a");
          sourceEl.classList.add("source");
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
      var _this2 = this;

      var successfulSrcs, imgs;
      return regeneratorRuntime.async(function initImages$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.imagesContainer = document.createElement("div");
              this.imagesContainer.className = "images__container";
              _context.next = 4;
              return regeneratorRuntime.awrap(this.loadImages(srcs));

            case 4:
              successfulSrcs = _context.sent;
              this.imagesSkeletons.forEach(function (skeleton) {
                return _this2.skeletonContainer.removeChild(skeleton);
              });
              imgs = successfulSrcs.map(function (src) {
                var img = document.createElement("img");
                img.src = src;

                _this2.imagesContainer.appendChild(img);

                return img;
              });
              this.handleImgClick(imgs); // // this.removeStatus({ container: this.container });
              // if (aiStatus) this.container.remove(aiStatus);

              this.tabsContentContainer.appendChild(this.imagesContainer); // this.scrollToBottom();

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "handleImgClick",
    value: function handleImgClick(imgs) {
      var _this3 = this;

      imgs.forEach(function (img, i) {
        img.addEventListener("click", function () {
          _this3.openSlider(imgs, i);
        });
      });
    }
  }, {
    key: "openSlider",
    value: function openSlider(imgs, currentIndex) {
      console.log("---- in open slider ----");
      this.emitter.emit("slider:open", {
        imgs: imgs,
        currentIndex: currentIndex
      });
    }
  }, {
    key: "loadImage",
    value: function loadImage(src) {
      return new Promise(function (resolve, reject) {
        var img = new Image();

        img.onload = function () {
          return resolve();
        };

        img.onerror = function (error) {
          return reject(error);
        };

        img.src = src;
      });
    }
  }, {
    key: "loadImages",
    value: function loadImages(srcs) {
      var _this4 = this;

      var successfulSrcs, errors;
      return regeneratorRuntime.async(function loadImages$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              successfulSrcs = [];
              errors = [];
              _context2.next = 4;
              return regeneratorRuntime.awrap(Promise.all(srcs.map(function (src) {
                return _this4.loadImage(src).then(function () {
                  return successfulSrcs.push(src);
                })["catch"](function (error) {
                  errors.push({
                    src: src,
                    error: error
                  });
                  console.log("Error loading image:", error);
                });
              })));

            case 4:
              return _context2.abrupt("return", successfulSrcs);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "createImageSkeletons",
    value: function createImageSkeletons() {
      var _this5 = this;

      this.skeletonContainer = document.createElement("div");
      this.skeletonContainer.className = "typing__skeleton-container skeleton__image";

      for (var i = 0; i < 4; i++) {
        var skeleton = document.createElement("div");
        skeleton.classList.add("typing__skeleton");
        this.imagesSkeletons.push(skeleton);
      }

      this.imagesSkeletons.forEach(function (skeleton) {
        return _this5.skeletonContainer.appendChild(skeleton);
      });
      this.tabsHeaderContainer.appendChild(this.skeletonContainer);
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