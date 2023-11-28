import AudioRecorder from "../../AudioRecorder";
import minSecStr from "../../utils/minSecStr";
import InputAnimations from "./InputAnimations";
import InputImage from "./InputImage";
import sendToWispher from "../../utils/sendToWhisper";
import TypingText from "../../TypingText";
import { colorMain } from "../../../scss/variables/_colors.module.scss";
import isMobile from "../../utils/isMobile";

const STATUS = {
  INITIAL: "INITIAL",
  RECORD_AUDIO: "RECORD_AUDIO",
  UPLOAD_IMAGE: "UPLOAD_IMAGE",
  WRITE: "WRITE",
};

export default class Input {
  constructor({ pageEl, addUserElement }) {
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
    this.addUserElement = addUserElement;

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

    this.addListeners();

    // TEMP
    this.minTranscriptingTime = 1400; //ms
    this.tempTextRecorded = "text recorded";

    if (this.isPageBlue) {
      this.anims.toPageGrey();
    }
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

    this.inputText.value += this.tempTextRecorded;
    this.updateInputHeight();

    // TODO Call this function when audio is transcripted
    if (this.isSmallRecording) {
      this.isSmallRecording = false;
      this.inputText.focus();
      this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
      return;
    }

    if (this.typingText) this.typingText.reverse();
    this.anims.toWrite({ delay: 1200, animButtons: false, animLogos: false });

    this.onClickOutside.animInitial = true;
  }

  async onCompleteRecording(blob) {
    if (this.isRecordCanceled) return;

    // TODO : send audio to API endpoint
    console.log("TODO add url endpoint to send audio file:", blob);
    this.tempTextRecorded = await sendToWispher(blob);
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
      this.goToPageGrey();
    }
    this.addUserElement({ text: this.inputText.value, img: this.currentImage });
    this.inputText.value = "";
    this.currentImage = null;
    this.updateInputHeight();
    this.cancelBtn.classList.remove("show");
    this.navbarEl.classList.remove("hidden");
    // if (this.inputText.value && this.inputText.value.trim().length > 0) {
    //   window.location.replace("https://ai.iamplus.services/chatbot/webchat/chat.html?q=" + this.inputText.value.trim());
    // }
  }

  updateInputHeight() {
    // Simulate input event to have split lines
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    this.inputText.dispatchEvent(event);
  }

  goToPageGrey() {
    this.anims.toPageGrey();
  }

  // Listeners
  addListeners() {
    // Write
    this.centerBtn.addEventListener("click", () => {
      this.currentStatus = STATUS.WRITE;
      this.anims.toWrite();
      this.onClickOutside.animInitial = true;
    });

    // Record
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
    this.inputImageEl.addEventListener("focus", (e) => {
      document.documentElement.style.overflow = "unset";
      window.scrollTo(0, document.body.scrollHeight);
    });
    this.inputImageEl.addEventListener("blur", (e) => {
      document.documentElement.style.overflow = "hidden";
      window.scrollTo(0, 0);
    });

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
            this.currentStatus = STATUS.INITIAL;
            this.anims.toInitial();
            this.onClickOutside.animInitial = false;
          }
        }
      },
      { capture: true }
    );

    // Input text
    this.inputText.addEventListener("focus", () => {
      this.submitBtn.disabled = !this.inputText.value.trim().length > 0;
    });
    this.inputText.addEventListener("input", (e) => {
      this.submitBtn.disabled = !this.inputText.value.trim().length > 0;
    });

    this.submitBtn.addEventListener("click", (event) => this.onSubmit(event));
  }
}
