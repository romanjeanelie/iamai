import AudioRecorder from "../../AudioRecorder-1e53bb0d.js";
import minSecStr from "../../utils/minSecStr-3b9ae0f7.js";
import InputAnimations from "./InputAnimations-6f2b0e97.js";
import ImageDrop from "./ImageDrop-b5b05607.js";
class Input {
  constructor() {
    this.inputEl = document.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");
    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontLeftBtn = this.inputFrontEl.querySelector(".left-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");
    this.audioRecorder = new AudioRecorder({
      onComplete: this.onCompleteRecording.bind(this)
    });
    this.isRecordCanceled = false;
    this.recordCounter = this.inputEl.querySelector(".record-counter");
    this.inputText = this.inputBackEl.querySelector(".input-text");
    this.navEl = document.querySelector(".nav");
    this.navBtn = this.navEl.querySelector(".nav__btn");
    this.anims = new InputAnimations();
    this.imageDrop = new ImageDrop({
      onDroped: () => this.anims.toImageDroped(),
      onImageAnalyzed: () => this.anims.toImageAnalyzed()
    });
    this.addListeners();
    this.onClickOutside = {
      stopAudio: false,
      animInitial: false
    };
    this.transcriptingTime = 3e3;
    this.tempTextRecorded = "text recorded";
  }
  // Audio
  startRecording() {
    this.isRecordCanceled = false;
    this.audioRecorder.startRecording();
    this.audioRecorder.onUpdate((sec) => {
      const time = minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60);
      this.recordCounter.textContent = time;
    });
  }
  stopRecording() {
    this.audioRecorder.stopRecording();
  }
  onCompleteRecording(blob) {
    if (this.isRecordCanceled)
      return;
    console.log("TODO add url endpoint to send audio file:", blob);
    this.timeoutTranscripting = setTimeout(() => {
      this.anims.toStopTranscripting({
        textTranscripted: this.tempTextRecorded
      });
      this.onClickOutside.animInitial = true;
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
    this.navBtn.addEventListener("click", () => {
      this.cancelRecord();
    });
    this.frontLeftBtn.addEventListener("click", () => {
      this.imageDrop.enable();
      this.anims.toReadyForDragImage();
    });
    document.body.addEventListener(
      "click",
      (event) => {
        if (!this.inputEl.contains(event.target) && !this.navBtn.contains(event.target)) {
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
    this.imageDrop.addListeners();
  }
}
export {
  Input as default
};
