import PhoneAnimations from "../../components/Phone/PhoneAnimations";

export default class AccorSearchBarPhone {
  constructor({ debug }) {
    // States
    this.debug = debug;

    // Debug btns
    this.phoneDebugContainer = document.querySelector(".phone__debug");
    this.btnToConnected = document.querySelector("#btn-toConnected");
    this.btnToTalkToMe = document.querySelector("#btn-toTalkToMe");
    this.btnToListening = document.querySelector("#btn-toListening");
    this.btnFinishTalk = document.querySelector("#btn-finishTalk");
    this.btnFinishProcessing = document.querySelector("#btn-finishProcessing");

    // Phone Animations
    this.phoneAnimations = new PhoneAnimations({
      pageEl: document,
    });

    // Events Listener
    this.addEventListener();
  }

  startConnecting() {
    this.phoneAnimations.toConnecting();
    this.phoneAnimations.newInfoText("connecting");
  }

  connected() {
    this.phoneAnimations.toConnected();
    this.phoneAnimations.newInfoText("connected");
  }

  talkToMe() {
    this.phoneAnimations.toTalkToMe();
    this.phoneAnimations.newInfoText("Talk to me");
  }

  listening() {
    this.phoneAnimations.toListening();
    this.phoneAnimations.newInfoText("I'm listening");
  }

  processing() {
    this.phoneAnimations.newInfoText("processing");
    this.phoneAnimations.toProcessing();
  }

  AItalking() {
    this.phoneAnimations.newInfoText("Speak to interrupt");
    this.phoneAnimations.toAITalking();
  }

  leave() {
    this.phoneAnimations.leave();
  }

  addEventListener() {
    if (this.debug) {
      // Tests
      this.btnToConnected.addEventListener("click", this.connected.bind(this));
      this.btnToTalkToMe.addEventListener("click", this.talkToMe.bind(this));
      this.btnToListening.addEventListener("click", this.listening.bind(this));
      this.btnFinishTalk.addEventListener("click", this.processing.bind(this));
      this.btnFinishProcessing.addEventListener("click", this.AItalking.bind(this));
    }
  }
}
