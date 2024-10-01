"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskAccordion =
/*#__PURE__*/
function () {
  function TaskAccordion(_ref) {
    var container = _ref.container;

    _classCallCheck(this, TaskAccordion);

    this.container = container; // States

    this.panels = [];
    this.activePanel = null; // Init Methods

    this.addListeners();
  }

  _createClass(TaskAccordion, [{
    key: "closeActivePanel",
    value: function closeActivePanel() {
      // Deactivate the previously active panel
      if (this.activePanel) {
        this.activePanel.classList.remove("active");
        var activeContent = this.activePanel.querySelector(".task-accordion__content");
        if (activeContent) activeContent.style.maxHeight = 0; // Close the content of the previously active panel
      }
    }
  }, {
    key: "addNewPanel",
    value: function addNewPanel(title, imgSrc) {
      var _this = this;

      // this.closeActivePanel();
      var panelContainer = document.createElement("div");
      panelContainer.className = "task-accordion__container active"; // Insert the panel Header

      var header = document.createElement("div");
      header.classList.add("task-accordion__header");
      var label = document.createElement("div");
      label.classList.add("task-accordion__header-label");
      label.innerHTML = "\n      <div class = \"task-accordion__header-icon\">\n        <img src=\"".concat(imgSrc, "\" alt=\"header-icon\" />\n      </div>\n      <h3 class=\"task-accordion__header-title\">").concat(title, "</h3>\n    ");
      var chevron = document.createElement("button");
      chevron.className = "task-accordion__header-chevron hidden";
      chevron.innerHTML = "\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"7\" viewBox=\"0 0 12 7\" fill=\"none\">\n        <path d=\"M11 1L6 6L1 0.999999\" stroke=\"#676E7F\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    ";
      chevron.addEventListener("click", function () {
        _this.togglePanel(panelContainer);
      });
      header.appendChild(label);
      header.appendChild(chevron);
      var content = document.createElement("div");
      content.classList.add("task-accordion__content");
      panelContainer.appendChild(header);
      panelContainer.appendChild(content);
      this.panels.push(panelContainer);
      this.container.appendChild(panelContainer);
      this.activePanel = panelContainer;
      return content;
    }
  }, {
    key: "togglePanel",
    value: function togglePanel(panelContainer) {
      var panelContent = panelContainer.querySelector(".task-accordion__content");

      if (panelContainer.classList.contains("active")) {
        // Close the panel
        panelContent.style.maxHeight = 0;
      } else {
        // Open the panel
        panelContent.style.maxHeight = panelContent.scrollHeight + "px"; // Close any previously opened panel

        if (this.activePanel && this.activePanel !== panelContainer) {
          var activeContent = this.activePanel.querySelector(".task-accordion__content");
          activeContent.style.maxHeight = 0;
          var activeChevron = this.activePanel.querySelector(".task-accordion__header-chevron");
          activeChevron.classList.remove("open");
          this.activePanel.classList.remove("active");
        }
      } // Toggle the active state


      panelContainer.classList.toggle("active");
      this.activePanel = panelContainer.classList.contains("active") ? panelContainer : null;
    }
  }, {
    key: "toggleChevrons",
    value: function toggleChevrons() {
      this.panels.forEach(function (panel) {
        var chevron = panel.querySelector(".task-accordion__header-chevron");
        chevron.classList.toggle("hidden");
      });
      this.togglePanel(this.panels[this.panels.length - 1]);
    } // Method to update panel height dynamically if content changes

  }, {
    key: "updatePanelHeight",
    value: function updatePanelHeight() {
      if (!this.activePanel) return;
      var panelContent = this.activePanel.querySelector(".task-accordion__content");
      panelContent.style.maxHeight = panelContent.scrollHeight + "px";
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      window.addEventListener("resize", this.updatePanelHeight.bind(this));
    }
  }]);

  return TaskAccordion;
}();

exports["default"] = TaskAccordion;