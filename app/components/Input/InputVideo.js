// TO DO
// [X] MAKE THE GRADIENT ANIMATION ON THE MOBILE VERSION
// [X] BLOCK THE INPUT WHEN PRESS FOR TOO LONG AND UNBLOCK IN HANDLE CANCEL PRESS
// [X] MAKE THE SWIPE EVENT HANDLER
// [X] STUDY THE PHONE CLASS TO SEE IF WE CAN REPLICATE IT OR IF WE NEED TO MOVE IT AS IT IS IN THE VIDEO INPUT
// [X] INTEGRATE THE VIDEO INPUT
// [X] trigger the phone process when launching video input
// [X] INTEGRATE THE PHONE ANIMATION
// [X] LINK THE CANCEL BUTTON WITH GOING BACK
// [X] ON START : LAUNCH THE TIMER
// [X] when resize the video the video-btn is still opacity: 0 and translateX: 50
// [X] LINK THE REVERSE BUTTON WITH REVERSING THE CAMERA
// [] LINK THE PAUSE BUTTON WITH PAUSING THE CONVERSATION
// [] MAKE THE VIDEO TAKE 1 PHOTO EACH SECOND

import PhoneAnimations from "../Phone/PhoneAnimations";

import isMobile from "../../utils/isMobile.js";
import minSecStr from "../../utils/minSecStr";

const states = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  TALKTOME: "talkToMe",
  LISTENING: "listening",
  PROCESSING: "processing",
  AITALKING: "AITalking",
  LEAVE: "leave",
};

export default class InputVideo {
  constructor(emitter) {
    this.emitter = emitter;

    // States
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.isAITalking = false;
    this.isMicMuted = false;
    this.isAIPaused = false;
    this.stream = null;
    this.currentState = states.CONNECTED;

    // camera facing state
    this.currentFacingMode = "user"; // Start with the front camera

    // photos states
    this.isEnvCam = null;
    this.captureInterval = null;
    this.photos = [];
    this.maxPhotos = 5;
    this.intervalTime = 1000;
    this.currentPhotoIndex = 0;

    // Dom elements
    this.container = document.querySelector(".input__video--container");
    this.cameraLoader = document.querySelector(".input__video--camera-loader");
    this.timer = document.querySelector(".input__video--timer");
    this.video = document.querySelector(".input__video--camera video");
    this.canvas = document.querySelector(".input__video--canvas");
    this.pauseBtn = document.querySelector(".input__video--button.pause-btn");
    this.reverseBtn = document.querySelector(".input__video--button.reverse-btn");
    this.exitBtn = document.querySelector(".input__video--button.exit-btn");

    // Phone Animations
    this.phoneAnimations = new PhoneAnimations({
      pageEl: this.container,
    });

    // Bindings
    this.displayVideoInput = this.displayVideoInput.bind(this);

    // Init Methods
    this.pauseBtn.setAttribute("disabled", true);
    this.phoneAnimations.toConnecting();
    this.phoneAnimations.newInfoText("connecting");
    this.addEvents();

    if (this.debug) {
      this.displayVideoInput();
    }
  }

  toggleLoading(isLoading) {
    if (isLoading) {
      this.cameraLoader.style.display = "block";
    } else {
      this.cameraLoader.style.display = "none";
    }
  }

  // CAMERA
  async initCamera() {
    try {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
      this.toggleLoading(true);

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.currentFacingMode },
        audio: false,
      });

      if (!this.isEnvCam) {
        // Check if the device has more than one camera
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((device) => device.kind === "videoinput");
        this.isEnvCam = videoInputs.length > 1;
        // if so enable the reverse button that switches between cameras
        this.reverseBtn.classList.add(this.isEnvCam ? "visible" : "hidden");
      }

      // Set the new stream to the video element and start playing it
      this.video.srcObject = this.stream;
      await this.video.play();

      this.toggleLoading(false);

      // Set up an interval to capture image every 1 second
      this.captureInterval = setInterval(() => {
        this.captureImage();
      }, this.intervalTime);
    } catch (err) {
      console.error(`An error occurred: ${err}`);
    }
  }

  toggleCamera() {
    // Clear the previous interval to avoid multiple intervals running simultaneously
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }

    this.phoneAnimations.toResume("user");
    this.phoneAnimations.newInfoText("Start talking");
    this.currentFacingMode = this.currentFacingMode === "user" ? "environment" : "user";
    this.initCamera();
  }

  captureImage() {
    // Ensure the canvas dimensions match the video's dimensions
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Draw the video frame to the canvas
    const ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Convert the canvas to an image (base64 encoded PNG)
    const imageData = this.canvas.toDataURL("image/png");
    const imgTag = document.createElement("img");
    imgTag.src = imageData;

    // Add the imageData to the photos array in a rotating manner
    this.photos[this.currentPhotoIndex] = imgTag;
    this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.maxPhotos;
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.captureInterval) clearInterval(this.captureInterval);
    this.photos.splice(0, this.photos.length);
  }

  // START
  displayVideoInput() {
    this.container.classList.add("visible");
    this.initCamera();
    this.startTimer();
  }

  // TIMER
  startTimer() {
    let sec = 0;
    function updateTime() {
      sec += 1;
      const time = minSecStr((sec / 60) | 0) + ":" + minSecStr(sec % 60);
      this.timer.textContent = time;
    }

    // Fix bind
    this.timeInterval = window.setInterval(updateTime.bind(this), 1000);
  }

  stopTimer() {
    clearInterval(this.timeInterval);
    this.timer.textContent = "00:00";
  }

  // PAUSE / RESUME
  pauseVideoConversation() {
    // Determine the actor based on the current state
    // const isProcessing = this.currentState === states.PROCESSING;
    const isAiTalking = this.currentState === states.AITALKING;
    const actor = this.isAITalking ? "AI" : "user";
    this.emitter.emit("videoInput:pause", this.isMicMuted, isAiTalking, this.isAIPaused);

    // If not paused, handle pause logic
    if (this.isAITalking) {
      if (!this.isAIPaused) {
        this.isAIPaused = true;
        this.phoneAnimations.newInfoText("Click to resume");
        this.phoneAnimations.toPause("AI");
      } else {
        this.isAIPaused = false;
        this.phoneAnimations.newInfoText("I'm talking");
        this.phoneAnimations.toResume("AI");
      }
    } else {
      if (!this.isMicMuted) {
        this.isMicMuted = true;
        this.phoneAnimations.toPause("user");
        this.phoneAnimations.newInfoText("Click to resume");
      } else {
        this.isMicMuted = false;
        this.phoneAnimations.toResume("user");
        this.phoneAnimations.newInfoText("Start talking");
      }
    }
  }

  // EXIT
  hideVideoInput() {
    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
    }
    this.container.classList.remove("visible");
    this.stopCamera();
    this.stopTimer();
    this.emitter.emit("videoInput:leave");
  }

  addEvents() {
    // DOM events
    this.pauseBtn.addEventListener("click", () => {
      this.pauseVideoConversation();
    });

    this.reverseBtn.addEventListener("click", () => {
      this.toggleCamera();
    });

    this.exitBtn.addEventListener("click", this.hideVideoInput.bind(this));

    // Emitter events
    this.emitter.on("input:displayVideoInput", this.displayVideoInput);
    this.emitter.on("phone:connected", () => {
      this.currentState = states.CONNECTED;
      this.phoneAnimations.toConnected();
      this.phoneAnimations.newInfoText("connected");
    });

    this.emitter.on("phone:talkToMe", () => {
      console.log("talk to me");
      this.pauseBtn.removeAttribute("disabled");
      this.currentState = states.TALKTOME;
      this.phoneAnimations.toTalkToMe();
      this.phoneAnimations.newInfoText("Talk to me");
    });

    this.emitter.on("phone:listening", () => {
      this.currentState = states.LISTENING;
      this.isAITalking = false;
      this.phoneAnimations.toListening();
      this.phoneAnimations.newInfoText("I'm listening");
    });

    this.emitter.on("phone:processing", () => {
      this.pauseBtn.setAttribute("disabled", true);
      this.currentState = states.PROCESSING;
      this.phoneAnimations.newInfoText("processing");
      this.phoneAnimations.toProcessing();
    });

    this.emitter.on("phone:AITalking", () => {
      this.currentState = states.AITALKING;
      this.isAITalking = true;
      this.phoneAnimations.newInfoText("Click to interrupt");
      this.phoneAnimations.toAITalking();
    });

    this.emitter.on("phone:leave", () => {
      this.currentState = states.LEAVE;
      this.phoneAnimations.leave();
    });
  }
}
