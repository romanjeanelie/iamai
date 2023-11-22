import AudioRecorder from "../../AudioRecorder-1e53bb0d.js";
import minSecStr from "../../utils/minSecStr-3b9ae0f7.js";
import InputAnimations from "./InputAnimations-497a828d.js";
import InputImage from "./InputImage-68b0509d.js";
import sendtowispher from "../../utils/sendToWhisper-92b3f1e2.js";
class Input {
  constructor() {
    this.inputEl = document.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");
    this.submitBtn = this.inputBackEl.querySelector(".submit");
    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontCameraBtn = this.inputFrontEl.querySelector(".camera-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");
    this.backCameraBtn = this.inputBackEl.querySelector(".camera-btn");
    this.closeInputImageBtn = document.querySelector(".input__image--closeBtn");
    this.audioRecorder = new AudioRecorder({
      onComplete: this.onCompleteRecording.bind(this)
    });
    this.isRecordCanceled = false;
    this.recordCounter = this.inputEl.querySelector(".record-counter");
    this.backMicBtnContainer = this.inputBackEl.querySelector(".mic-btn__container");
    this.backMicBtn = this.backMicBtnContainer.querySelector(".mic-btn");
    this.backMicText = this.backMicBtnContainer.querySelector("p");
    this.cancelAudioBtn = document.querySelector(".cancel-audio__btn");
    this.isSmallRecording = false;
    this.inputText = this.inputBackEl.querySelector(".input-text");
    this.onClickOutside = {
      stopAudio: false,
      animInitial: false
    };
    this.transcriptingTime = 2e3;
    this.tempTextRecorded = "text recorded";
    this.anims = new InputAnimations();
    this.inputImage = new InputImage({
      reset: () => this.anims.toImageReset(),
      onDroped: () => this.anims.toImageDroped(),
      onImageAnalyzed: () => this.anims.toImageAnalyzed()
    });
    this.addListeners();
  }
  // Audio
  startRecording() {
    this.isRecordCanceled = false;
    this.inputText.disabled = true;
    this.audioRecorder.startRecording();
    this.timecodeAudioEl = this.isSmallRecording ? this.backMicText : this.recordCounter;
    this.audioRecorder.onUpdate((sec) => {
      const time = minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60);
      this.timecodeAudioEl.textContent = time;
    });
  }
  stopRecording() {
    this.audioRecorder.stopRecording();
  }
  onCompleteTranscripting() {
    this.inputText.disabled = false;
    this.timecodeAudioEl.textContent = "00:00";
    if (this.isSmallRecording) {
      this.isSmallRecording = false;
      this.inputText.textContent = this.tempTextRecorded;
      this.inputText.focus();
      this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
      return;
    }
    this.anims.toStopTranscripting({
      textTranscripted: this.tempTextRecorded
    });
    this.onClickOutside.animInitial = true;
  }
  async onCompleteRecording(blob) {
    if (this.isRecordCanceled)
      return;
    console.log("TODO add url endpoint to send audio file:", blob);
    this.tempTextRecorded = await sendtowispher(blob);
    this.timeoutTranscripting = setTimeout(() => {
      this.onCompleteTranscripting();
    }, this.transcriptingTime);
  }
  cancelRecord() {
    this.isRecordCanceled = true;
    this.onClickOutside.stopAudio = false;
    this.stopRecording();
    this.anims.toStopRecording({ transcipting: false });
    this.anims.fromRecordAudioToInitial();
  }
  // Listeners
  addListeners() {
    this.centerBtn.addEventListener("click", () => {
      this.anims.toWrite();
      this.onClickOutside.animInitial = true;
    });
    this.frontMicBtn.addEventListener("click", () => {
      this.startRecording();
      this.anims.toStartRecording();
      this.onClickOutside.stopAudio = true;
    });
    this.cancelAudioBtn.addEventListener("click", () => {
      this.cancelRecord();
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
    this.frontCameraBtn.addEventListener("click", () => {
      this.inputImage.enable();
      this.anims.toDragImage();
    });
    this.backCameraBtn.addEventListener("click", () => {
      if (this.isSmallRecording)
        return;
      this.anims.toInitial({ animBottom: false, animButtons: false });
      this.anims.toDragImage({ animBottom: false, delay: 1e3 });
    });
    this.closeInputImageBtn.addEventListener("click", () => {
      this.inputImage.disable();
      this.anims.leaveDragImage();
    });
    document.body.addEventListener(
      "click",
      (event) => {
        if (this.isSmallRecording)
          return;
        if (!this.inputEl.contains(event.target) && !this.cancelAudioBtn.contains(event.target)) {
          if (this.onClickOutside.stopAudio) {
            this.stopRecording();
            this.anims.toStopRecording();
            this.onClickOutside.stopAudio = false;
          }
          if (this.onClickOutside.animInitial) {
            if (this.inputText.value)
              return;
            this.anims.toInitial();
            this.onClickOutside.animInitial = false;
          }
        }
      },
      { capture: true }
    );
    this.inputImage.addListeners();
    this.inputText.addEventListener("focus", () => {
      this.submitBtn.disabled = !this.inputText.value;
    });
    this.inputText.addEventListener("input", () => {
      this.submitBtn.disabled = !this.inputText.value;
    });
    this.submitBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (this.inputText.value && this.inputText.value.trim().length > 0) {
        window.location.replace(
          "https://ai.iamplus.services/chatbot/webchat/chat.html?q=" + this.inputText.value.trim()
        );
      }
    });
  }
}
export {
  Input as default
};
