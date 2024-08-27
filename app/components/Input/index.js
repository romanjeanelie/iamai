// Components
import Phone from "../Phone";
import InputImage from "./InputImage";

// Utils
import isMobile from "../../utils/isMobile";

import InputAnimations from "./InputAnimations";

import { calculateInputTextWidth } from "../../utils/calculateInputTextWidth";
import InputVideo from "./InputVideo";

function isLetterKey(event) {
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
    this.frontCameraBtn = this.inputEl.querySelector(".camera-btn");
    this.frontVideoBtn = this.inputFrontEl.querySelector(".video-btn");

    // Image
    this.closeInputImageBtn = this.pageEl.querySelector(".input__image--closeBtn");
    this.currentImages = [];
    this.inputImageEl = this.pageEl.querySelector(".input__image");

    // Write
    this.inputText = this.inputEl.querySelector(".input-text");

    this.onClickOutside = {
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

    // Video
    this.inputVideo = new InputVideo(this.emitter);

    // Phone
    if (!this.isPageBlue) {
      this.phone = new Phone({
        pageEl: this.pageEl,
        discussion: this.discussion,
        emitter: this.emitter,
        photos: this.inputVideo.photos,
        anims: {
          toStartPhoneRecording: () => this.anims.toStartPhoneRecording(),
          toStopPhoneRecording: () => this.anims.toStopPhoneRecording(),
        },
      });
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
  onSubmit(event) {
    event.preventDefault();
    console.time("input");
    if (this.currentStatus === STATUS.IMAGE_QUESTION) {
      this.emitter.emit("slider:close");
    }
    this.discussion.addUserElement({ text: this.inputText.value, imgs: this.currentImages });
    this.inputText.value = "";
    this.currentImages = [];

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
    this.frontCameraBtn.addEventListener("click", () => {
      this.currentStatus = STATUS.UPLOAD_IMAGE;
      this.inputImage.enable();
      this.anims.toDragImage();
    });

    this.closeInputImageBtn.addEventListener("click", () => {
      this.currentStatus = STATUS.INITIAL;
      this.inputImage.disable();
      this.anims.leaveDragImage();
    });

    // Video
    this.frontVideoBtn.addEventListener("click", () => {
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
    this.inputText.addEventListener("input", () => {
      const SIZE_THRESHOLD = 82;
      const textWidth = calculateInputTextWidth(this.inputText);

      if (textWidth > this.inputText.clientWidth) {
        this.isInputExtanded = true;
        this.inputFrontEl.classList.add("extended");
      } else if (this.isInputExtanded && textWidth + SIZE_THRESHOLD < this.inputText.clientWidth) {
        this.isInputExtanded = false;
        this.inputFrontEl.classList.remove("extended");
      }

      this.inputText.style.height = "1px";
      this.inputText.style.height = `${this.inputText.scrollHeight}px`;
    });

    this.inputText.addEventListener("keydown", (event) => {
      if (this.inputText.value.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
        this.onSubmit(event);
      }
    });
  }
}
