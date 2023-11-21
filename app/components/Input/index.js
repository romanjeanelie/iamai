import AudioRecorder from "../../AudioRecorder";
import minSecStr from "../../utils/minSecStr";
import InputAnimations from "./InputAnimations";
import InputImage from "./InputImage";

export default class Input {
  constructor() {
    this.inputEl = document.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");

    // Front input
    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontLeftBtn = this.inputFrontEl.querySelector(".left-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");

    // Record
    this.audioRecorder = new AudioRecorder({
      onComplete: this.onCompleteRecording.bind(this),
    });
    this.isRecordCanceled = false;
    this.recordCounter = this.inputEl.querySelector(".record-counter");
    this.backMicBtnContainer = this.inputBackEl.querySelector(".mic-btn__container");
    this.backMicBtn = this.backMicBtnContainer.querySelector(".mic-btn");
    this.backMicText = this.backMicBtnContainer.querySelector("p");
    this.isSmallRecording = false;

    // Write
    this.inputText = this.inputBackEl.querySelector(".input-text");

    // Other dom elements
    this.navEl = document.querySelector(".nav");
    this.navBtn = this.navEl.querySelector(".nav__btn");

    this.onClickOutside = {
      stopAudio: false,
      animInitial: false,
    };

    //TEMP
    this.transcriptingTime = 3000; //ms
    this.tempTextRecorded = "text recorded";

    // Anims
    this.anims = new InputAnimations();

    // Drop Image
    this.inputImage = new InputImage({
      onDroped: () => this.anims.toImageDroped(),
      onImageAnalyzed: () => this.anims.toImageAnalyzed(),
    });

    this.addListeners();
  }

  // Audio
  startRecording() {
    this.isRecordCanceled = false;
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

  onCompleteRecording(blob) {
    if (this.isRecordCanceled) return;

    // TODO : send audio to API endpoint
    console.log("TODO add url endpoint to send audio file:", blob);

    this.timeoutTranscripting = setTimeout(() => {
      this.timecodeAudioEl.textContent = "00:00";
      // TODO Call this function when audio is transcripted
      if (this.isSmallRecording) {
        this.isSmallRecording = false;
        this.inputText.textContent = this.tempTextRecorded;
        this.inputText.focus();
        this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);

        return;
      }

      this.anims.toStopTranscripting({
        textTranscripted: this.tempTextRecorded,
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
    // Write
    this.centerBtn.addEventListener("click", () => {
      this.anims.toWrite();
      this.onClickOutside.animInitial = true;
    });

    // Record
    this.frontMicBtn.addEventListener("click", () => {
      this.startRecording();
      this.anims.toStartRecording();
      this.onClickOutside.stopAudio = true;
    });

    this.navBtn.addEventListener("click", () => {
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

    // Image
    this.frontLeftBtn.addEventListener("click", () => {
      this.inputImage.enable();
      this.anims.toReadyForDragImage();
    });

    // Click outside
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
            if (this.inputText.value) return;
            this.anims.toInitial();
            this.onClickOutside.animInitial = false;
          }
        }
      },
      { capture: true }
    );

    // Drop Image
    this.inputImage.addListeners();
  }
}
