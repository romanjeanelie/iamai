"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _PhoneAnimations = _interopRequireDefault(require("../../components/Phone/PhoneAnimations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AccorSearchBarPhone =
/*#__PURE__*/
function () {
  function AccorSearchBarPhone(_ref) {
    var debug = _ref.debug;

    _classCallCheck(this, AccorSearchBarPhone);

    // States
    this.debug = debug; // Debug btns

    this.phoneDebugContainer = document.querySelector(".phone__debug");
    this.btnToConnected = document.querySelector("#btn-toConnected");
    this.btnToTalkToMe = document.querySelector("#btn-toTalkToMe");
    this.btnToListening = document.querySelector("#btn-toListening");
    this.btnFinishTalk = document.querySelector("#btn-finishTalk");
    this.btnFinishProcessing = document.querySelector("#btn-finishProcessing"); // Phone Animations

    this.phoneAnimations = new _PhoneAnimations["default"]({
      pageEl: document
    }); // Events Listener

    this.addEventListener();
  }

  _createClass(AccorSearchBarPhone, [{
    key: "startConnecting",
    value: function startConnecting() {
      this.phoneAnimations.toConnecting();
      this.phoneAnimations.newInfoText("connecting");
    }
  }, {
    key: "connected",
    value: function connected() {
      this.phoneAnimations.toConnected();
      this.phoneAnimations.newInfoText("connected");
    }
  }, {
    key: "talkToMe",
    value: function talkToMe() {
      this.phoneAnimations.toTalkToMe();
      this.phoneAnimations.newInfoText("Talk to me");
    }
  }, {
    key: "listening",
    value: function listening() {
      this.phoneAnimations.toListening();
      this.phoneAnimations.newInfoText("I'm listening");
    }
  }, {
    key: "processing",
    value: function processing() {
      this.phoneAnimations.newInfoText("processing");
      this.phoneAnimations.toProcessing();
    }
  }, {
    key: "AItalking",
    value: function AItalking() {
      this.phoneAnimations.newInfoText("Speak to interrupt");
      this.phoneAnimations.toAITalking();
    }
  }, {
    key: "leave",
    value: function leave() {
      this.phoneAnimations.leave();
    }
  }, {
    key: "addEventListener",
    value: function addEventListener() {
      if (this.debug) {
        // Tests
        this.btnToConnected.addEventListener("click", this.connected.bind(this));
        this.btnToTalkToMe.addEventListener("click", this.talkToMe.bind(this));
        this.btnToListening.addEventListener("click", this.listening.bind(this));
        this.btnFinishTalk.addEventListener("click", this.processing.bind(this));
        this.btnFinishProcessing.addEventListener("click", this.AItalking.bind(this));
      }
    }
  }]);

  return AccorSearchBarPhone;
}();

exports["default"] = AccorSearchBarPhone;