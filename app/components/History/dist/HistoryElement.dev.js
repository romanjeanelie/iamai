"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getMarked = _interopRequireDefault(require("../../utils/getMarked"));

var _DiscussionMedia = _interopRequireDefault(require("../DiscussionMedia"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var md = (0, _getMarked["default"])();

var isEmpty = function isEmpty(obj) {
  return Object.keys(obj).length === 0;
};

var HistoryElement =
/*#__PURE__*/
function () {
  function HistoryElement(data) {
    _classCallCheck(this, HistoryElement);

    this.data = data; // States
    // DOM Elements
    // Init Methods

    this.createUI();
  }

  _createClass(HistoryElement, [{
    key: "createUI",
    value: function createUI() {
      console.log("new history element"); // if (element.user.length > 0) {
      //   const userContainer = document.createElement("div");
      //   userContainer.classList.add("discussion__user");
      //   var userContainerspan = document.createElement("span");
      //   userContainerspan.classList.add("discussion__userspan");
      //   // const userTextMarkdowned = md.renderInline(element.user);
      //   userContainerspan.innerHTML = element.user;
      //   userContainer.appendChild(userContainerspan);
      //   this.historyContainer.appendChild(userContainer);
      //   // 1st way to figure out if an img comes from the video input - the length
      //   // const isImgsComingFromVideo = element.images.user_images?.length > 40000;
      //   // 2nd way to figure out if an img comes from the video input - the presence of 'data:image/png;base64,'
      //   const isImgsComingFromVideo = element.images.user_images?.includes("data:image/png;base64,");
      //   console.log(isImgsComingFromVideo);
      //   if (!isEmpty(element.images) && !isImgsComingFromVideo) {
      //     const media = new DiscussionMedia({
      //       container: userContainer,
      //       emitter: this.emitter,
      //     });
      //     if (element.images.user_images) media?.addUserImages(JSON.parse(element.images.user_images));
      //     this.historyContainer.appendChild(userContainer);
      //   }
      // }
      // if (element.assistant.length > 0) {
      //   const AIContainer = document.createElement("div");
      //   AIContainer.classList.add("discussion__ai");
      //   // Need to stringify
      //   const string = JSON.stringify(element.assistant);
      //   // Remove leading and trailing quotes
      //   const textWithoutQuotes = string.slice(1, -1);
      //   // Replace \n with <br>
      //   const assistantText = textWithoutQuotes.replace(/\\n/g, "<br>");
      //   // Render the markdown
      //   const assistantTextMardowned = md.parse(assistantText);
      //   AIContainer.innerHTML = assistantTextMardowned;
      //   this.historyContainer.appendChild(AIContainer);
      //   if (!isEmpty(element.sources) || !isEmpty(element.images)) {
      //     const media = new DiscussionMedia({
      //       container: AIContainer,
      //       emitter: this.emitter,
      //     });
      //     if (element.images.images) {
      //       media.initImages();
      //       media?.addImages(JSON.parse(element.images.images).slice(0, 8));
      //     }
      //     if (element.sources.sources) {
      //       media?.addSources(JSON.parse(element.sources.sources));
      //     }
      //     this.historyContainer.appendChild(AIContainer);
      //   }
      // }
    }
  }]);

  return HistoryElement;
}();

exports["default"] = HistoryElement;