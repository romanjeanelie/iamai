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
      this.displayVideoInput();
    }
  }

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
    console.log("displayVideoInput");
    this.container.classList.add("visible");
  }

  hideVideoInput() {
    this.container.classList.remove("visible");
  }

  addEvents() {
    this.emitter.on("input:displayVideoInput", this.displayVideoInput);
  }
}
