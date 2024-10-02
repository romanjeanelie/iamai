"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskCardAccordion =
/*#__PURE__*/
function () {
  function TaskCardAccordion(_ref) {
    var container = _ref.container;

    _classCallCheck(this, TaskCardAccordion);

    this.container = container; // States

    this.panels = [];
    this.activePanel = null; // Init Methods

    this.addListeners();
  }

  _createClass(TaskCardAccordion, [{
    key: "addNewPanel",
    value: function addNewPanel(title, imgSrc) {
      var _this = this;

      var panelContainer = document.createElement("div");
      panelContainer.setAttribute("data-title", title);
      panelContainer.className = "task-accordion__container"; // Insert the panel Header

      var header = document.createElement("div");
      header.classList.add("task-accordion__header");
      var label = document.createElement("div");
      label.classList.add("task-accordion__header-label");
      label.innerHTML = "\n      <div class = \"task-accordion__header-icon\">\n        <img src=\"".concat(imgSrc, "\" alt=\"header-icon\" />\n      </div>\n      <h3 class=\"task-accordion__header-title\">").concat(title, "</h3>\n    ");
      var chevron = document.createElement("button");
      chevron.className = "task-accordion__header-chevron hidden";
      chevron.innerHTML = "\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"7\" viewBox=\"0 0 12 7\" fill=\"none\">\n        <path d=\"M11 1L6 6L1 0.999999\" stroke=\"#676E7F\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    ";
      chevron.addEventListener("click", function () {
        _this.togglePanel(title);
      });
      header.appendChild(label);
      header.appendChild(chevron);
      var content = document.createElement("div");
      content.classList.add("task-accordion__content");
      panelContainer.appendChild(header);
      panelContainer.appendChild(content); // Close the panel by default

      content.style.maxHeight = 0;
      this.panels.push(panelContainer);
      this.container.appendChild(panelContainer);
      this.openPanel(title);
      return content;
    }
  }, {
    key: "togglePanel",
    value: function togglePanel(panelTitle) {
      var panelContainer = this.panels.find(function (panel) {
        return panel.getAttribute("data-title") === panelTitle;
      });
      this.activePanel = !panelContainer.classList.contains("active") ? panelContainer : null;
      var panelContent = panelContainer.querySelector(".task-accordion__content");

      if (!this.activePanel) {
        // Close the panel
        panelContent.style.maxHeight = 0;
      } else {
        // Close any previously opened panel
        this.panels.forEach(function (panel) {
          var content = panel.querySelector(".task-accordion__content");
          content.style.maxHeight = 0;
          var chevron = panel.querySelector(".task-accordion__header-chevron");
          chevron.classList.remove("open");
          panel.classList.remove("active");
        }); // Open the panel

        panelContent.style.maxHeight = panelContent.scrollHeight + "px";
      } // Toggle the active state


      panelContainer.classList.toggle("active");
    }
  }, {
    key: "openPanel",
    value: function openPanel(panelTitle) {
      var panelContainer = this.panels.find(function (panel) {
        return panel.getAttribute("data-title") === panelTitle;
      });
      var panelContent = panelContainer.querySelector(".task-accordion__content"); // Close any previously opened panel

      this.panels.forEach(function (panel) {
        var content = panel.querySelector(".task-accordion__content");
        content.style.maxHeight = 0;
        var chevron = panel.querySelector(".task-accordion__header-chevron");
        chevron.classList.remove("open");
        panel.classList.remove("active");
      }); // Open the panel

      panelContent.style.maxHeight = panelContent.scrollHeight + "px";
      panelContainer.classList.add("active");
      this.activePanel = panelContainer;
    }
  }, {
    key: "closePanel",
    value: function closePanel(panelContainer, panelContent) {
      var chevron = panelContainer.querySelector(".task-accordion__header-chevron");
      panelContent.style.maxHeight = 0;
      chevron.classList.remove("open");
      panelContainer.classList.remove("active");
    }
  }, {
    key: "displayChevrons",
    value: function displayChevrons() {
      this.panels.forEach(function (panel) {
        var chevron = panel.querySelector(".task-accordion__header-chevron");
        chevron.classList.remove("hidden");
      });
    } // Method to update panel height dynamically if content changes

  }, {
    key: "updateActivePanelHeight",
    value: function updateActivePanelHeight() {
      if (!this.activePanel) return;
      console.log("Updating panel height");
      var panelContent = this.activePanel.querySelector(".task-accordion__content");
      console.log(panelContent.scrollHeight);
      panelContent.style.maxHeight = panelContent.scrollHeight + "px";
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      window.addEventListener("resize", this.updateActivePanelHeight.bind(this));
    }
  }]);

  return TaskCardAccordion;
}();

exports["default"] = TaskCardAccordion;