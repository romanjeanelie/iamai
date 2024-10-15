// Components
import VoiceConv from "../VoiceConv";
import InputImage from "./InputImage";

// Utils
import isMobile from "../../utils/isMobile";

import InputAnimations from "./InputAnimations";

import { calculateInputTextWidth } from "../../utils/calculateInputTextWidth";
import InputVideo from "./InputVideo";

function isLetterKey(event) {
  // console.log("event.key", event.key);
  // console.log("event.key.length", event.key.length);
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

    // State
    this.isInputExtanded = false;

    // Front input
    this.imageUploadBtn = this.inputEl.querySelector(".camera-btn");
    this.videoBtn = this.inputFrontEl.querySelector(".video-btn");

    // Image
    this.currentImages = [];
    this.inputImageEl = this.pageEl.querySelector(".input__image");

    // Write
    this.inputText = this.inputEl.querySelector(".input-text");

    this.onClickOutside = {
      animInitial: false,
    };
    this.currentStatus = STATUS.INITIAL;

    // Anims
    this.anims = new InputAnimations({
      pageEl: this.pageEl,
      emitter: this.emitter,
    });

    // Drop Image
    this.inputImage = new InputImage(
      {
        reset: (delay) => this.anims.toImageReset(delay),
        toLoadingImage: () => this.anims.toLoadingImage(),
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

    // Video Conversation
    this.inputVideo = new InputVideo(this.emitter);

    // Voice Conversation
    this.voiceConv = new VoiceConv({
      pageEl: this.pageEl,
      discussion: this.discussion,
      emitter: this.emitter,
      photos: this.inputVideo.photos,
      anims: {
        toStartVoiceConv: () => this.anims.toStartVoiceConv(),
        toStopVoiceConv: () => this.anims.toStopVoiceConv(),
      },
    });

    this.addListeners();
  }

  // Write
  toWrite({ delay = 0, animButtons = true, animLogos = true, type = null, placeholder = "", focus = true } = {}) {
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

  // Images Questions
  updateImages(imgs) {
    this.currentImages = imgs;
  }

  // Submit
  resetInputText() {
    this.inputText.value = "";
    this.inputText.style.height = "auto";
    this.inputFrontEl.classList.remove("extended");
  }

  onSubmit(event) {
    event.preventDefault();
    // console.log("ON SUBMIT FUNCTION : ", this.inputText.value);
    console.time("input");
    if (this.isPageBlue) {
      this.toPageGrey({ duration: 1200 });
    }
    if (this.currentStatus === STATUS.IMAGE_QUESTION) {
      this.emitter.emit("slider:close");
    }
    this.discussion.addUserElement({ text: this.inputText.value, imgs: this.currentImages });
    this.resetInputText();
    this.currentImages = [];

    if (this.inputImage.isEnabled) {
      this.inputImage.disable();
    }

    this.goToInitial({ disableInput: false });
  }

  goToInitial({ disableInput = true } = {}) {
    this.currentStatus = STATUS.INITIAL;
    this.anims.toInitial();
    this.onClickOutside.animInitial = false;
    if (disableInput) {
      this.inputText.disabled = false;
    }
  }

  updateInputFieldSize() {
    this.inputText.style.height = "1px";
    this.inputText.style.height = `${this.inputText.scrollHeight}px`;

    if (!isMobile()) {
      this.inputFrontEl.classList.remove("extended");
      return;
    }

    const SIZE_THRESHOLD = 82;
    const textWidth = calculateInputTextWidth(this.inputText);

    if (textWidth > this.inputText.clientWidth) {
      this.isInputExtanded = true;
      this.inputFrontEl.classList.add("extended");
    } else if (this.isInputExtanded && textWidth + SIZE_THRESHOLD < this.inputText.clientWidth) {
      this.isInputExtanded = false;
      this.inputFrontEl.classList.remove("extended");
    }
  }

  // Listeners
  addListeners() {
    // Write
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

    // Image
    this.imageUploadBtn.addEventListener("click", () => {
      this.currentStatus = STATUS.UPLOAD_IMAGE;
      this.inputImage.enable();
      this.inputImage.triggerFileUpload();
    });

    // Video
    this.videoBtn.addEventListener("click", () => {
      this.emitter.emit("input:displayVideoInput");

      //initailse the video workflow api
      this.discussion.Chat.StartVideoWorkflow();
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
        if (!this.inputEl.contains(event.target)) {
          if (this.onClickOutside.animInitial) {
            if (this.inputText.value) return;
            this.goToInitial();
          }
        }
      },
      { capture: true }
    );

    // Input text
    this.inputText.addEventListener("input", this.updateInputFieldSize.bind(this));

    this.inputText.addEventListener("keydown", (event) => {
      if (this.inputText.value.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
        this.onSubmit(event);
      }
    });

    window.addEventListener("resize", this.updateInputFieldSize.bind(this));

    // Emitter
    this.emitter.on("input:imagesQuestionAsked", () => {
      this.toWrite({ placeholder: "How can I help you?", animLogos: true, animButtons: true });
    });

    this.emitter.on("input:toWrite", (data) => {
      if (data && data.type === "imageQuestions") {
        this.toWrite({ type: data.type });
      } else {
        this.toWrite();
      }
    });
    this.emitter.on("input:updateImages", this.updateImages.bind(this));
    this.emitter.on("app:initialized", () => this.anims.showInput());
    this.emitter.on("Navigation:openTasks", () => this.anims.hideInput());
    this.emitter.on("Navigation:closeTasks", () => this.anims.showInput());
  }
}
