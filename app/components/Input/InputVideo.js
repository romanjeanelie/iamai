// TO DO
// [X] MAKE THE GRADIENT ANIMATION ON THE MOBILE VERSION
// [] BLOCK THE INPUT WHEN PRESS FOR TOO LONG AND UNBLOCK IN HANDLE CANCEL PRESS
// [] MAKE THE SWIPE EVENT HANDLER
// [] STUDY THE PHONE CLASS TO SEE IF WE CAN REPLICATE IT OR IF WE NEED TO MOVE IT AS IT IS IN THE VIDEO INPUT
// [] INTEGRATE THE VIDEO INPUT
// [] MAKE THE VIDEO TAKE 1 PHOTO EACH SECOND

export default class InputVideo {
  constructor(emitter) {
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";

    // Dom elements
    this.container = document.querySelector(".input__video--container");
    this.video = document.querySelector(".input__video--camera video");

    // Bindings
    this.displayVideoInput = this.displayVideoInput.bind(this);

    // Init Methods
    this.addEvents();

    if (this.debug) {
      // this.displayVideoInput();
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
  }

  hideVideoInput() {
    this.container.classList.remove("visible");
  }

  addEvents() {
    this.emitter.on("input:displayVideoInput", this.displayVideoInput);
  }
}
