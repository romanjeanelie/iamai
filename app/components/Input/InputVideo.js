import VoiceConvAnimations from "../VoiceConv/VoiceConvDotAnimations";

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
    this.intervalTime = 1000; //2500//1000
    this.currentPhotoIndex = 0;

    // Dom elements
    this.headerNav = document.querySelector(".header-nav");
    this.container = document.querySelector(".input__video--container");
    this.cameraLoader = document.querySelector(".input__video--camera-loader");
    this.timer = document.querySelector(".input__video--timer");
    this.video = document.querySelector(".input__video--camera video");
    this.canvas = document.querySelector(".input__video--canvas");
    this.pauseBtn = document.querySelector(".input__video--button.pause-btn");
    this.reverseBtn = document.querySelector(".input__video--button.reverse-btn");
    this.exitBtn = document.querySelector(".input__video--button.exit-btn");

    // Voice Conversation Animations
    this.voiceConvAnimations = new VoiceConvAnimations({
      pageEl: this.container,
    });

    // Bindings
    this.displayVideoInput = this.displayVideoInput.bind(this);

    // Init Methods
    this.pauseBtn.setAttribute("disabled", true);
    this.voiceConvAnimations.toConnecting();
    this.voiceConvAnimations.newInfoText("connecting");
    this.addEvents();

    if (this.debug) {
      // this.displayVideoInput();
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

    this.voiceConvAnimations.toResume("user");
    this.voiceConvAnimations.newInfoText("Start talking");
    this.currentFacingMode = this.currentFacingMode === "user" ? "environment" : "user";
    this.initCamera();
  }

  captureImage() {
    // Ensure the canvas dimensions match the video's dimensions
    this.canvas.width = this.video.videoWidth / 4;
    this.canvas.height = this.video.videoHeight / 4;

    // Draw the video frame to the canvas
    const ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Convert the canvas to an image (base64 encoded webp)
    const imageData = this.canvas.toDataURL("image/webp");
    const imgTag = document.createElement("img");
    imgTag.src = imageData;

    // Add the imageData to the photos array in a rotating manner
    this.photos[this.currentPhotoIndex] = imgTag;
    this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.maxPhotos;
    this.emitter.emit("videoInput:captureImage", imageData);
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
    this.headerNav.classList.add("hidden");
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
        this.voiceConvAnimations.newInfoText("Click to resume");
        this.voiceConvAnimations.toPause("AI");
      } else {
        this.isAIPaused = false;
        this.voiceConvAnimations.newInfoText("I'm talking");
        this.voiceConvAnimations.toResume("AI");
      }
    } else {
      if (!this.isMicMuted) {
        this.isMicMuted = true;
        this.voiceConvAnimations.toPause("user");
        this.voiceConvAnimations.newInfoText("Click to resume");
      } else {
        this.isMicMuted = false;
        this.voiceConvAnimations.toResume("user");
        this.voiceConvAnimations.newInfoText("Start talking");
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
    this.headerNav.classList.remove("hidden");
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
      this.voiceConvAnimations.toConnected();
      this.voiceConvAnimations.newInfoText("connected");
    });

    this.emitter.on("phone:talkToMe", () => {
      // console.log("talk to me");
      this.pauseBtn.removeAttribute("disabled");
      this.currentState = states.TALKTOME;
      this.voiceConvAnimations.toTalkToMe();
      this.voiceConvAnimations.newInfoText("Talk to me");
    });

    this.emitter.on("phone:listening", () => {
      this.currentState = states.LISTENING;
      this.isAITalking = false;
      this.voiceConvAnimations.toListening();
      this.voiceConvAnimations.newInfoText("I'm listening");
    });

    this.emitter.on("phone:processing", () => {
      this.pauseBtn.setAttribute("disabled", true);
      this.currentState = states.PROCESSING;
      this.voiceConvAnimations.newInfoText("processing");
      this.voiceConvAnimations.toProcessing();
    });

    this.emitter.on("phone:AITalking", () => {
      this.currentState = states.AITALKING;
      this.isAITalking = true;
      this.voiceConvAnimations.newInfoText("Speak to interrupt");
      this.voiceConvAnimations.toAITalking();
    });

    this.emitter.on("phone:leave", () => {
      this.currentState = states.LEAVE;
      this.voiceConvAnimations.leave();
    });
  }
}
