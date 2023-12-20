// Components
import InputImage from "./InputImage";
import Phone from "../Phone";
import TypingText from "../../TypingText";

// Utils
import minSecStr from "../../utils/minSecStr";
import isMobile from "../../utils/isMobile";
import { isTouch } from "../../utils/detectNavigators";

import AudioRecorder from "../../AudioRecorder";
import InputAnimations from "./InputAnimations";
import sendToWispher from "../../utils/audio/sendToWhisper";

import { colorMain } from "../../../scss/variables/_colors.module.scss";

function isLetterKey(event) {
  const keyCode = event.keyCode;
  return keyCode >= 65 && keyCode <= 90; // Key codes for A-Z
}

const STATUS = {
  INITIAL: "INITIAL",
  RECORD_AUDIO: "RECORD_AUDIO",
  UPLOAD_IMAGE: "UPLOAD_IMAGE",
  WRITE: "WRITE",
};

export default class Input {
  constructor({ pageEl, isActive, toPageGrey, discussion, emitter }) {
    this.isActive = isActive;

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

    // Image
    this.backCameraBtn = this.inputBackEl.querySelector(".camera-btn");
    this.closeInputImageBtn = this.pageEl.querySelector(".input__image--closeBtn");
    this.currentImage = null;
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
    });

    // Drop Image
    this.inputImage = new InputImage(
      {
        reset: () => this.anims.toImageReset(),
        toImageDroped: () => this.anims.toImageDroped(),
        toImageAnalyzed: () => this.anims.toImageAnalyzed(),
      },
      {
        onImageUploaded: (img) => {
          this.currentImage = img;
        },
      },
      this.pageEl
    );

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

    this.addListeners();

    // TEMP
    this.minTranscriptingTime = 1400; //ms
    this.textRecorded = "text recorded";

    if (this.isPageBlue) {
      //   this.toPageGrey();
    }
  }

  // Write
  toWrite({ delay = 0, animButtons = true, animLogos = true } = {}) {
    this.currentStatus = STATUS.WRITE;
    this.anims.toWrite({ delay, animButtons, animLogos });
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
      onComplete: this.typingText.blink,
    });
  }

  onCompleteTranscripting() {
    this.inputText.disabled = false;
    this.timecodeAudioEl.textContent = "00:00";

    this.inputText.value += this.textRecorded;
    this.updateInputHeight();

    // TODO Call this function when audio is transcripted
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

    this.textRecorded = await sendToWispher(blob);
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

  // Submit
  onSubmit(event) {
    event.preventDefault();
    if (this.isPageBlue) {
      this.toPageGrey({ duration: 1200 });
    }
    this.discussion.addUserElement({ text: this.inputText.value, img: this.currentImage });
    this.inputText.value = "";
    this.currentImage = null;
    this.updateInputHeight();
    this.cancelBtn.classList.remove("show");
    this.navbarEl.classList.remove("hidden");

    this.goToInitial();
  }

  updateInputHeight() {
    // Simulate input event to have split lines
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    this.inputText.dispatchEvent(event);
  }

  goToInitial() {
    this.currentStatus = STATUS.INITIAL;
    this.anims.toInitial();
    this.onClickOutside.animInitial = false;
    this.inputText.disabled = false;
  }

  // Listeners
  addListeners() {
    // Write
    this.centerBtn.addEventListener("click", () => {
      this.toWrite();
    });
    document.addEventListener(
      "keydown",
      () => {
        if (!this.isActive) return;
        if (!isLetterKey(event)) return;
        if (this.currentStatus !== STATUS.WRITE && !this.inputText.disabled) {
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
        this.currentImage = null;
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

    // Prevent input hidden by keyboard on mobile
    if (isMobile() && isTouch()) {
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
    // this.inputText.addEventListener("input", (e) => {
    //   this.submitBtn.disabled = !this.inputText.value.trim().length > 0;
    // });
    this.inputText.addEventListener("keyup", (event) => {
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
