import AudioRecorder from "../AudioRecorder";
import minSecStr from "../utils/minSecStr";
import anim from "../utils/anim";
import isMobile from "../utils/isMobile";

export default class InputText {
  constructor() {
    this.inputEl = document.querySelector(".input-text__container");
    this.inputFrontEl = this.inputEl.querySelector(".input-text__front");
    this.inputBackEl = this.inputEl.querySelector(".input-text__back");

    // Front input
    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontCameraBtn = this.inputFrontEl.querySelector(".camera-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");

    this.inputFrontHeight = this.inputFrontEl.offsetHeight;

    // Record
    this.audioRecorder = new AudioRecorder({
      onComplete: this.onCompleteRecording,
    });
    this.recordCounter = this.inputEl.querySelector(".record-counter");

    // Transcripting
    this.transcriptingEl = this.inputEl.querySelector(".transcripting__container");
    this.transcriptingCursor = this.transcriptingEl.querySelector(".transcripting__container--cursor");

    // Write
    this.inputText = this.inputBackEl.querySelector(".input-text");

    // Other dom elements
    this.logoEl = document.querySelector(".logo__main");
    this.logoMobileEl = document.querySelector(".logo__mobile");
    this.navEl = document.querySelector(".nav");
    this.categoriesListEl = document.querySelector(".categories__list--container");
    this.carousselEl = document.querySelector(".caroussel__container");
    this.infoTextEl = document.querySelector(".info-text");

    this.addListeners();

    this.isClickedOutside = false;

    //TEMP
    this.transcriptingTime = 2000; //ms
    this.textRecorded = "text recorded";
  }

  onClickOutside(callback) {
    document.body.addEventListener(
      "click",
      (event) => {
        if (!this.inputEl.contains(event.target)) {
          callback();
        }
      },
      { capture: true }
    );
  }

  // Audio
  startRecording() {
    this.animToStartRecording();

    this.audioRecorder.startRecording();

    this.audioRecorder.onUpdate((sec) => {
      const time = minSecStr((sec / 60) | 0) + ":" + minSecStr(sec % 60);
      this.recordCounter.textContent = time;
    });

    this.onClickOutside(() => {
      if (this.isClickedOutside) return;
      this.stopRecording();
      this.animToStopRecording();
      this.isClickedOutside = true;
    });
  }

  stopRecording() {
    this.audioRecorder.stopRecording();
  }

  onCompleteRecording(blob) {
    // TODO : send audio to API endpoint
    console.log("TODO add url endpoint to send audio file:", blob);
  }

  // Animations
  animToInitial() {
    this.inputFrontEl.style.pointerEvents = "auto";
    this.inputBackEl.style.pointerEvents = "none";

    anim(this.inputFrontEl, [{ height: "110px" }, { height: `${this.inputFrontHeight}px` }], {
      duration: 700,
      fill: "forwards",
      ease: "ease-in-out",
    });
    anim(this.inputBackEl, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      fill: "forwards",
      ease: "ease-in-out",
    });
    anim([this.frontMicBtn, this.frontCameraBtn, this.frontCenterBtn], [{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      fill: "forwards",
      ease: "ease-in-out",
    });

    if (isMobile()) {
      anim(this.logoMobileEl, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
      anim(this.logoEl, [{ opacity: 0 }, { opacity: 1 }], {
        delay: 300,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
    }
  }
  animToWrite({ delay = 0, animButtons = true, animLogos = false, text = "" }) {
    this.inputText.textContent = text;
    this.inputFrontEl.style.pointerEvents = "none";
    this.inputBackEl.style.pointerEvents = "auto";

    if (isMobile() && animLogos) {
      anim(this.logoEl, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
      anim(this.logoMobileEl, [{ opacity: 0 }, { opacity: 1 }], {
        delay: 300,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
    }

    anim(this.inputFrontEl, [{ height: `${this.inputFrontHeight}px` }, { height: "110px" }], {
      delay,
      duration: 700,
      fill: "forwards",
      ease: "ease-in-out",
    });
    if (animButtons) {
      anim([this.frontMicBtn, this.frontCameraBtn, this.frontCenterBtn], [{ opacity: 1 }, { opacity: 0 }], {
        delay,
        duration: 500,
        fill: "forwards",
        ease: "ease-in-out",
      });
    }
    anim(this.inputBackEl, [{ opacity: 0 }, { opacity: 1 }], {
      delay,
      duration: 500,
      delay: delay ? delay + 700 : 700,
      fill: "forwards",
      ease: "ease-in-out",
    });

    this.inputText.focus();
    this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
    this.isClickedOutside = false;

    this.onClickOutside(() => {
      if (this.isClickedOutside) return;
      this.animToInitial();
      this.isClickedOutside = true;
    });
  }

  animToStartRecording() {
    this.navEl.classList.remove("active");
    this.inputEl.style.overflow = "unset";
    this.inputEl.style.pointerEvents = "none";

    if (isMobile()) {
      anim(this.logoEl, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
      anim(this.logoMobileEl, [{ opacity: 0 }, { opacity: 1 }], {
        delay: 300,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
    }

    anim([this.frontMicBtn, this.frontCenterBtn, this.frontCameraBtn], [{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      fill: "forwards",
      ease: "ease-in-out",
    });

    anim([this.logoEl], [{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }], {
      duration: 200,
      fill: "forwards",
      ease: "ease-in-out",
    });

    const step1 = anim(
      this.inputFrontEl,
      [
        { width: `${this.inputFrontHeight}px`, offset: 0.45 },
        { width: `${this.inputFrontHeight}px`, offset: 1 },
      ],
      {
        duration: 800,
        fill: "forwards",
        ease: "ease-out",
      }
    );
    const step2 = anim(
      this.inputFrontEl,
      [
        { transform: "translate3d(-50%, -50%, 0) scale(1)", offset: 0 },
        { transform: "translate3d(-50%, -50%, 0) scale(3)", offset: 1 },
      ],
      {
        delay: 400,
        duration: 400,
        fill: "forwards",
        ease: "ease-out",
      }
    );

    this.animCircleYoyo = anim(
      this.inputFrontEl,
      [
        { transform: "translate3d(-50%, -50%, 0) scale(3)" },
        { transform: "translate3d(-50%, -50%, 0) scale(2.4)" },
        { transform: "translate3d(-50%, -50%, 0) scale(3)" },
      ],
      {
        delay: step1.effect.getComputedTiming().duration + step2.effect.getComputedTiming().duration * 0.2,
        duration: 1000,
        iterations: Infinity,
        ease: "ease-in-out",
      }
    );

    anim(
      [this.recordCounter, this.infoTextEl],
      [
        { opacity: 0, visibility: "visible" },
        { opacity: 1, visibility: "visible" },
      ],
      {
        delay: step1.effect.getComputedTiming().duration,
        duration: 700,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );
  }

  animToStopRecording() {
    this.animCircleYoyo.cancel();

    anim(
      [this.recordCounter, this.infoTextEl],
      [
        { opacity: 1, visibility: "visible" },
        { opacity: 0, visibility: "visible" },
      ],
      {
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );

    const step3 = anim(
      this.inputFrontEl,
      [{ transform: "translate3d(-50%, -50%, 0) scale(3)" }, { transform: "translate3d(-50%, -50%, 0) scale(1)" }],
      {
        duration: 300,
        ease: "ease-in-out",
        fill: "forwards",
      }
    );

    const lastStep = anim(this.inputFrontEl, [{ width: `${this.inputFrontHeight}px` }, { width: "100%" }], {
      delay: step3.effect.getComputedTiming().duration + 500,
      duration: 400,
      ease: "ease-in-out",
      fill: "forwards",
    });

    lastStep.onfinish = () => {
      this.animToStartTranscripting();
    };
  }

  animToStartTranscripting() {
    // TEMP
    this.timeoutTranscripting = setTimeout(() => {
      // TODO Call this function when audio is transcripted
      this.animToStopTranscripting();
    }, this.transcriptingTime);

    this.animShowTranscripting = anim(
      this.transcriptingEl,
      [
        { opacity: 0, visibility: "visible" },
        { opacity: 1, visibility: "visible" },
      ],
      {
        duration: 700,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );

    this.translateCursor = anim(
      this.transcriptingCursor,
      [{ transform: "translateX(0%)" }, { transform: "translateX(105%)" }],
      {
        delay: this.animShowTranscripting.effect.getComputedTiming().duration,
        duration: 400,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );

    this.blinkCursor = anim(this.transcriptingCursor, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
      delay:
        this.animShowTranscripting.effect.getComputedTiming().duration +
        this.translateCursor.effect.getComputedTiming().duration,
      duration: 500,
      iterations: Infinity,
      ease: "ease-in-out",
    });
  }

  animToStopTranscripting() {
    this.inputEl.style.overflow = "hidden";
    this.blinkCursor.cancel();
    this.translateCursor.reverse();
    anim(
      this.transcriptingEl,
      [
        { opacity: 1, visibility: "visible" },
        { opacity: 0, visibility: "hidden" },
      ],
      {
        delay: 500,
        duration: 700,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );

    this.animToWrite({ delay: 1200, animButtons: false, text: this.textRecorded });
  }

  // Listeners
  addListeners() {
    this.centerBtn.addEventListener("click", () => {
      this.animToWrite({ animLogos: true });
    });
    this.frontMicBtn.addEventListener("click", () => {
      this.startRecording();
    });
  }
}
