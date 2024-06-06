// Components
import TypingText from "../../TypingText";
import Phone from "../Phone";
import InputImage from "./InputImage";

// Utils
import isMobile from "../../utils/isMobile";
import minSecStr from "../../utils/minSecStr";

import AudioRecorder from "../../AudioRecorder";
import sendToWispher from "../../utils/audio/sendToWhisper";
import InputAnimations from "./InputAnimations";

import { colorMain } from "../../../scss/variables/_colors.module.scss";
import LongPress from "../../utils/longPress";
import InputVideo from "./InputVideo";

function isLetterKey(event) {
  console.log("event.key", event.key);
  console.log("event.key.length", event.key.length);
  const keyCode = event.keyCode;
  // return (keyCode >= 65 && keyCode <= 90); // Key codes for A-Z
  if (
    event.key.length === 1 &&
    event.key.match(/[a-z]/i) &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey &&
    !event.shiftKey
  )
    return event.key;
}

const STATUS = {
  INITIAL: "INITIAL",
  RECORD_AUDIO: "RECORD_AUDIO",
  UPLOAD_IMAGE: "UPLOAD_IMAGE",
  IMAGE_QUESTION: "IMAGE_QUESTION",
  WRITE: "WRITE",
};

export default class Input {
  constructor({ pageEl, isActive, toPageGrey, discussion, emitter }) {
    this.isActive = isActive;
    this.debug = import.meta.env.VITE_DEBUG === "true";

    this.toPageGrey = toPageGrey;
    this.discussion = discussion;
    this.emitter = emitter;

    this.pageEl = pageEl;
    this.inputEl = this.pageEl.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");
    this.submitBtn = this.inputBackEl.querySelector(".submit");

    // Front input
    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontCameraBtn = this.inputFrontEl.querySelector(".camera-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontVideoBtn = this.inputFrontEl.querySelector(".video-btn");

    // Image
    this.backCameraBtn = this.inputBackEl.querySelector(".camera-btn");
    this.closeInputImageBtn = this.pageEl.querySelector(".input__image--closeBtn");
    this.currentImages = [];
    this.inputImageEl = this.pageEl.querySelector(".input__image");

    // Record
    this.audioRecorder = new AudioRecorder({
      onComplete: this.onCompleteRecording.bind(this),
    });
    this.isRecordCanceled = false;
    this.recordCounter = this.pageEl.querySelector(".record-counter");
    this.backMicBtnContainer = this.inputBackEl.querySelector(".mic-btn__container");
    this.backMicBtn = this.backMicBtnContainer.querySelector(".mic-btn");
    this.backMicText = this.backMicBtnContainer.querySelector("p");
    this.isSmallRecording = false;

    // Write
    this.inputText = this.inputBackEl.querySelector(".input-text");

    // Other DOM elements
    this.cancelBtn = document.body.querySelector(".cancel-btn");
    this.navbarEl = document.querySelector(".nav");

    this.onClickOutside = {
      stopAudio: false,
      animInitial: false,
    };
    this.currentStatus = STATUS.INITIAL;
    this.isPageBlue = this.pageEl.classList.contains("page-blue");

    // Anims
    this.anims = new InputAnimations({
      pageEl: this.pageEl,
      emitter: this.emitter,
    });

    // Drop Image
    this.inputImage = new InputImage(
      {
        reset: (delay) => this.anims.toImageReset(delay),
        toImageDroped: () => this.anims.toImageDroped(),
        toImageAnalyzed: () => this.anims.toImageAnalyzed(),
      },
      {
        onImageUploaded: (img) => {
          this.currentImages.push(img);
        },
        onImageCancel: () => {
          this.currentImages = [];
          this.goToInitial({ disableInput: false });
        },
      },
      this.pageEl,
      this.emitter
    );

    this.inputVideo = new InputVideo(this.emitter);
    // Phone
    if (!this.isPageBlue) {
      this.phone = new Phone({
        pageEl: this.pageEl,
        discussion: this.discussion,
        emitter: this.emitter,
        anims: {
          toStartPhoneRecording: () => this.anims.toStartPhoneRecording(),
          toStopPhoneRecording: () => this.anims.toStopPhoneRecording(),
        },
      });
    }

    if (this.debug) {
      // this.anims.displaySwipeInfo();
    }

    this.addListeners();

    // Emitter
    this.emitter.on("input:toWrite", (data) => {
      if (data && data.type === "imageQuestions") {
        this.toWrite({ type: data.type });
      } else {
        this.toWrite();
      }
    });
    this.emitter.on("input:updateImages", this.updateImages.bind(this));

    // TEMP
    this.minTranscriptingTime = 1400; //ms
    this.textRecorded = "text recorded";

    if (this.isPageBlue) {
      this.toPageGrey();
    }
  }

  // Write
  toWrite({ delay = 0, animButtons = true, animLogos = true, type = null, placeholder = "", focus = true } = {}) {
    console.log("from TOWRITE : ", this.longPress.active);
    if (this.longPress.active) return;
    if (type === "imageQuestions") {
      if (this.currentStatus !== STATUS.UPLOAD_IMAGE) {
        this.anims.toWrite({ delay, animButtons, animLogos, placeholder, focus });
      }
      this.currentStatus = STATUS.IMAGE_QUESTION;
      return;
    }
    this.anims.toWrite({ delay, animButtons, animLogos, placeholder });
    this.currentStatus = STATUS.WRITE;
    this.onClickOutside.animInitial = true;
  }

  // Audio
  startRecording() {
    this.isRecordCanceled = false;
    this.inputText.disabled = true;
    this.audioRecorder.startRecording();
    this.timecodeAudioEl = this.isSmallRecording ? this.backMicText : this.recordCounter;
    this.audioRecorder.onUpdate((sec) => {
      const time = minSecStr((sec / 60) | 0) + ":" + minSecStr(sec % 60);
      this.timecodeAudioEl.textContent = time;
    });
  }

  stopRecording() {
    this.audioRecorder.stopRecording();
  }

  onTranscripting() {
    this.typingText = new TypingText({
      text: "Converting to text",
      container: this.inputFrontEl,
      backgroundColor: colorMain,
      marginLeft: 16,
    });
    this.typingText.writing({
      onComplete: this.typingText.fadeIn,
    });
  }

  onCompleteTranscripting() {
    this.inputText.disabled = false;
    this.timecodeAudioEl.textContent = "00:00";

    this.inputText.value += this.textRecorded;
    this.updateInputHeight();

    if (this.isSmallRecording) {
      this.isSmallRecording = false;
      this.inputText.focus();
      this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
      return;
    }

    if (this.typingText) this.typingText.reverse();
    this.toWrite({ delay: 1200, animButtons: false, animLogos: false });
  }

  async onCompleteRecording(blob) {
    if (this.isRecordCanceled) return;

    if (this.discussion.Chat.autodetect) this.textRecorded = await sendToWispher(blob);
    else this.textRecorded = await sendToWispher(blob, this.discussion.Chat.sourcelang);

    this.timeoutTranscripting = setTimeout(() => {
      this.onCompleteTranscripting();
    }, this.minTranscriptingTime);
  }

  cancelRecord() {
    this.isRecordCanceled = true;
    this.onClickOutside.stopAudio = false;
    this.stopRecording();

    this.anims.toStopRecording();
    this.anims.fromRecordAudioToInitial();
  }

  // Images Questions
  updateImages(imgs) {
    this.currentImages = imgs;
  }

  // Submit
  onSubmit(event) {
    event.preventDefault();
    console.log("ON SUBMIT FUNCTION : ", this.inputText.value);
    console.time("input");
    if (this.isPageBlue) {
      this.toPageGrey({ duration: 1200 });
    }
    if (this.currentStatus === STATUS.IMAGE_QUESTION) {
      this.emitter.emit("slider:close");
    }
    this.discussion.addUserElement({ text: this.inputText.value, imgs: this.currentImages });
    this.inputText.value = "";
    this.currentImages = [];
    this.updateInputHeight();
    this.cancelBtn.classList.remove("show");
    this.navbarEl.classList.remove("hidden");

    if (this.inputImage.isEnabled) {
      this.inputImage.disable();
    }

    this.goToInitial({ disableInput: false });
  }

  updateInputHeight() {
    // Simulate input event to have split lines
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    this.inputText.dispatchEvent(event);
  }

  goToInitial({ disableInput = true } = {}) {
    this.currentStatus = STATUS.INITIAL;
    this.anims.toInitial();
    this.onClickOutside.animInitial = false;
    if (disableInput) {
      this.inputText.disabled = false;
    }
  }

  // Listeners
  addListeners() {
    // Write
    this.centerBtn.addEventListener("click", () => {
      this.toWrite();
    });
    document.addEventListener(
      "keydown",
      (event) => {
        if (!this.isActive) return;
        if (!isLetterKey(event)) return;
        if (this.currentStatus === STATUS.INITIAL && !this.inputText.disabled) {
          this.toWrite();
        }
      },
      { capture: true }
    );

    // Record
    if (this.frontMicBtn)
      this.frontMicBtn.addEventListener("click", () => {
        this.currentStatus = STATUS.RECORD_AUDIO;
        this.startRecording();
        this.anims.toStartRecording();
        this.onClickOutside.stopAudio = true;
      });

    this.cancelBtn.addEventListener("click", () => {
      if (this.currentStatus === STATUS.RECORD_AUDIO) {
        this.cancelRecord();
      }

      if (this.currentStatus === STATUS.UPLOAD_IMAGE) {
        this.anims.toRemoveImage();
        this.inputImage.disable();
        this.currentImages = [];
      }

      this.currentStatus = STATUS.INITIAL;
    });

    this.backMicBtn.addEventListener("click", () => {
      if (!this.isSmallRecording) {
        this.isSmallRecording = true;
        this.startRecording();
        this.backMicBtnContainer.classList.add("active");
      } else {
        this.stopRecording();
        this.backMicBtnContainer.classList.remove("active");
      }
    });

    // Image
    this.frontCameraBtn.addEventListener("click", () => {
      this.currentStatus = STATUS.UPLOAD_IMAGE;
      this.inputImage.enable();
      this.anims.toDragImage();
    });

    this.backCameraBtn.addEventListener("click", () => {
      if (this.isSmallRecording) return;
      this.currentStatus = STATUS.UPLOAD_IMAGE;
      this.inputImage.enable();
      this.anims.toInitial({ animBottom: false, animButtons: false });
      this.anims.toDragImage({ animBottom: false, delay: 300 });
      this.onClickOutside.animInitial = false;
    });

    this.closeInputImageBtn.addEventListener("click", () => {
      this.currentStatus = STATUS.INITIAL;
      this.inputImage.disable();
      this.anims.leaveDragImage();
    });

    // Video

    this.longPress = new LongPress(this.inputFrontEl, this.anims.displaySwipeInfo, this.anims.removeSwipeInfo, 200);
    this.frontVideoBtn.addEventListener("click", () => {
      this.emitter.emit("input:displayVideoInput");
    });

    // Prevent input hidden by keyboard on mobile
    if (isMobile()) {
      this.inputImageEl.addEventListener("focus", (e) => {
        document.documentElement.style.overflow = "unset";
        window.scrollTo(0, document.body.scrollHeight);
      });
      this.inputImageEl.addEventListener("blur", (e) => {
        document.documentElement.style.overflow = "hidden";
        window.scrollTo(0, 0);
      });
    }

    // Click outside
    this.pageEl.addEventListener(
      "click",
      (event) => {
        if (this.isSmallRecording) return;
        if (!this.inputEl.contains(event.target) && !this.cancelBtn.contains(event.target)) {
          if (this.onClickOutside.stopAudio) {
            this.stopRecording();
            this.anims.toStopRecording({
              onComplete: this.onTranscripting.bind(this),
            });
            this.onClickOutside.stopAudio = false;
          }
          if (this.onClickOutside.animInitial) {
            if (this.inputText.value) return;
            this.goToInitial();
          }
        }
      },
      { capture: true }
    );

    // Input text
    this.inputText.addEventListener("focus", () => {
      this.submitBtn.disabled = !this.inputText.value.trim().length > 0;
    });

    this.inputText.addEventListener("input", (event) => {
      this.submitBtn.disabled = !this.inputText.value.trim().length > 0;
    });
    this.inputText.addEventListener("keydown", (event) => {
      if (this.inputText.value.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
        this.onSubmit(event);
      }
    });

    this.submitBtn.addEventListener("click", (event) => this.onSubmit(event));
  }
}
