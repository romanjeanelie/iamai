"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _User = require("../User");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Navigation =
/*#__PURE__*/
function () {
  function Navigation(_ref) {
    var user = _ref.user;

    _classCallCheck(this, Navigation);

    this.user = user;
    this.headerNav = document.querySelector(".header-nav");
    this.footerNav = document.querySelector(".footer-nav");
    this.historyButton = this.headerNav.querySelector(".header-nav__history-container");
    this.tasksButton = this.footerNav.querySelector(".footer-nav__tasks-container");
    this.historyContainer = document.querySelector(".history__container");
    this.userPicture = this.headerNav.querySelector(".user-logo img");
    this.currentSection = null; // State to track the current section

    this.addListeners();
    this.setUserImage();
  }

  _createClass(Navigation, [{
    key: "setUserImage",
    value: function setUserImage() {
      if (!this.user.picture) return;
      this.userPicture.src = this.user.picture;
    }
  }, {
    key: "scrollToHistory",
    value: function scrollToHistory() {
      var containerRect = this.historyContainer.getBoundingClientRect();
      var scrollTarget = containerRect.height - window.innerHeight + 202;
      window.scrollTo({
        top: scrollTarget,
        behavior: "smooth"
      });
    }
  }, {
    key: "updateButtonVisibility",
    value: function updateButtonVisibility() {
      [this.tasksButton, this.historyButton].forEach(function (button) {
        button.classList.remove("hidden");
      }); // if the currentSection is the one affiliated to the button, hide it

      if (this.currentSection === "tasks") {
        this.tasksButton.classList.add("hidden");
      } else if (this.currentSection === "history") {
        this.historyButton.classList.add("hidden");
      }
    }
  }, {
    key: "setupIntersectionObserver",
    value: function setupIntersectionObserver() {
      var _this = this;

      var options = {
        root: null,
        rootMargin: "-200px",
        threshold: 0
      };
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            _this.currentSection = entry.target.id;

            _this.updateButtonVisibility();
          }
        });
      }, options); // Observe the sections

      ["history", "discussion", "tasks"].forEach(function (sectionId) {
        var section = document.getElementById(sectionId);

        if (section) {
          observer.observe(section);
        }
      });
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      this.setupIntersectionObserver();
      this.userPicture.addEventListener("click", _User.signOutUser);
      this.historyButton.addEventListener("click", this.scrollToHistory.bind(this));
    }
  }]);

  return Navigation;
}();

exports["default"] = Navigation;