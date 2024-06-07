// TO DO
// [X] MAKE THE GRADIENT ANIMATION ON THE MOBILE VERSION
// [X] BLOCK THE INPUT WHEN PRESS FOR TOO LONG AND UNBLOCK IN HANDLE CANCEL PRESS
// [X] MAKE THE SWIPE EVENT HANDLER
// [X] STUDY THE PHONE CLASS TO SEE IF WE CAN REPLICATE IT OR IF WE NEED TO MOVE IT AS IT IS IN THE VIDEO INPUT
// [X] INTEGRATE THE VIDEO INPUT
// [X] trigger the phone process when launching video input
// [X] INTEGRATE THE PHONE ANIMATION
// [] LINK THE CANCEL BUTTON WITH GOING BACK
// [] LINK THE PAUSE BUTTON WITH PAUSING THE CONVERSATION
// [] LINK THE REVERSE BUTTON WITH REVERSING THE CAMERA
// [] LINK THE MUTE BUTTON WITH MUTING THE AI
// [] ON START : LAUNCH THE TIMER
// [] FOR SLIDE EVENT : USE A LIB
// [] MAKE THE VIDEO TAKE 1 PHOTO EACH SECOND
// [] when resize the video the video-btn is still opacity: 0 and translateX: 50

import PhoneAnimations from "../Phone/PhoneAnimations";

export default class InputVideo {
  constructor(emitter) {
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";

    // Dom elements
    this.container = document.querySelector(".input__video--container");
    this.video = document.querySelector(".input__video--camera video");
    this.pauseBtn = document.querySelector(".input__video--button.pause-btn");
    this.reverseBtn = document.querySelector(".input__video--button.reverse-btn");
    this.muteBtn = document.querySelector(".input__video--button.mute-btn");
    this.exitBtn = document.querySelector(".input__video--button.exit-btn");

    // Phone Animations
    this.phoneAnimations = new PhoneAnimations({
      pageEl: this.container,
    });

    // Bindings
    this.displayVideoInput = this.displayVideoInput.bind(this);

    // Init Methods
    this.phoneAnimations.toConnecting();
    this.phoneAnimations.newInfoText("connecting");
    this.addEvents();

    if (this.debug) {
      this.displayVideoInput();
    }
  }

  // PROTO VERSION OF THE FUNCTION
  linkCameraToVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
  }

  displayVideoInput() {
    this.container.classList.add("visible");
    this.linkCameraToVideo();
  }

  hideVideoInput() {
    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
    }
    this.container.classList.remove("visible");
    this.emitter.emit("videoInput:leave");
  }

  addEvents() {
    // Emitter events
    this.emitter.on("input:displayVideoInput", this.displayVideoInput);
    this.emitter.on("phone:connected", () => {
      this.phoneAnimations.toConnected();
      this.phoneAnimations.newInfoText("connected");
    });

    this.emitter.on("phone:talkToMe", () => {
      this.phoneAnimations.toTalkToMe();
      this.phoneAnimations.newInfoText("Talk to me");
    });

    this.emitter.on("phone:listening", () => {
      this.phoneAnimations.toListening();
      this.phoneAnimations.newInfoText("I'm listening");
    });

    this.emitter.on("phone:processing", () => {
      this.phoneAnimations.newInfoText("processing");
      this.phoneAnimations.toProcessing();
    });

    this.emitter.on("phone:AItalking", () => {
      this.phoneAnimations.newInfoText("Click to interrupt");
      this.phoneAnimations.toAITalking();
    });

    this.emitter.on("phone:leave", this.phoneAnimations.leave.bind(this.phoneAnimations));

    // DOM events
    this.exitBtn.addEventListener("click", this.hideVideoInput.bind(this));
  }
}
