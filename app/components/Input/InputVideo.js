// TO DO
// [X] MAKE THE GRADIENT ANIMATION ON THE MOBILE VERSION
// [X] BLOCK THE INPUT WHEN PRESS FOR TOO LONG AND UNBLOCK IN HANDLE CANCEL PRESS
// [X] MAKE THE SWIPE EVENT HANDLER
// [X] STUDY THE PHONE CLASS TO SEE IF WE CAN REPLICATE IT OR IF WE NEED TO MOVE IT AS IT IS IN THE VIDEO INPUT
// [X] INTEGRATE THE VIDEO INPUT
// [] trigger the phone process when launching video input
// [] INTEGRATE THE PHONE ANIMATION
// [] ON START : LAUNCH THE TIMER
// [] LINK THE CANCEL BUTTON WITH GOING BACK
// [] LINK THE PAUSE BUTTON WITH PAUSING THE CONVERSATION
// [] LINK THE REVERSE BUTTON WITH REVERSING THE CAMERA
// [] LINK THE MUTE BUTTON WITH MUTING THE AI
// [] MAKE THE VIDEO TAKE 1 PHOTO EACH SECOND
// [] when resize the video the video-btn is still opacity: 0

import PhoneAnimations from "../Phone/PhoneAnimations";

export default class InputVideo {
  constructor(emitter) {
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";

    // Dom elements
    this.container = document.querySelector(".input__video--container");
    this.video = document.querySelector(".input__video--camera video");
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
  }

  addEvents() {
    // Emitter events
    this.emitter.on("input:displayVideoInput", this.displayVideoInput);

    // DOM events
    this.exitBtn.addEventListener("click", this.hideVideoInput.bind(this));
  }
}
