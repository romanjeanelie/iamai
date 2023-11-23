import AudioRecorder from "../../AudioRecorder";
import minSecStr from "../../utils/minSecStr";
import InputAnimations from "./InputAnimations";
import InputImage from "./InputImage";
import sendtowispher from "../../utils/sendToWhisper";

const STATUS = {
  INITIAL: "INITIAL",
  RECORD_AUDIO: "RECORD_AUDIO",
  UPLOAD_IMAGE: "UPLOAD_IMAGE",
  WRITE: "WRITE",
};

export default class Input {
  constructor() {
    this.inputEl = document.querySelector(".input__container");
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
    this.closeInputImageBtn = document.querySelector(".input__image--closeBtn");

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

    this.cancelBtn = document.querySelector(".cancel-btn");

    this.onClickOutside = {
      stopAudio: false,
      animInitial: false,
    };
    this.currentStatus = STATUS.INITIAL;

    //TEMP
    this.transcriptingTime = 2000; //ms
    this.tempTextRecorded = "text recorded";

    // Anims
    this.anims = new InputAnimations();

    // Drop Image
    this.inputImage = new InputImage({
      reset: () => this.anims.toImageReset(),
      onDroped: () => this.anims.toImageDroped(),
      onImageAnalyzed: () => this.anims.toImageAnalyzed(),
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
      const time = minSecStr((sec / 60) | 0) + ":" + minSecStr(sec % 60);
      this.timecodeAudioEl.textContent = time;
    });
  }

  stopRecording() {
    this.audioRecorder.stopRecording();
  }

  onCompleteTranscripting() {
    this.inputText.disabled = false;
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
  }

  async onCompleteRecording(blob) {
    if (this.isRecordCanceled) return;

    // TODO : send audio to API endpoint
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

  // Submit
  onSubmit(event) {
    event.preventDefault();
    // if (this.inputText.value && this.inputText.value.trim().length > 0) {
    //   window.location.replace("https://ai.iamplus.services/chatbot/webchat/chat.html?q=" + this.inputText.value.trim());
    // }
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

      //   if (this.currentStatus === STATUS.UPLOAD_IMAGE) {
      //     this.inputImage.disable();
      //     this.anims.leaveDragImage();
      //   }

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

    // Click outside
    document.body.addEventListener(
      "click",
      (event) => {
        if (this.isSmallRecording) return;
        if (!this.inputEl.contains(event.target) && !this.cancelBtn.contains(event.target)) {
          if (this.onClickOutside.stopAudio) {
            this.stopRecording();
            this.anims.toStopRecording();
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
      this.submitBtn.disabled = !this.inputText.value;
    });
    this.inputText.addEventListener("input", () => {
      this.submitBtn.disabled = !this.inputText.value;
    });

    this.submitBtn.addEventListener("click", (event) => this.onSubmit(event));
  }
}
