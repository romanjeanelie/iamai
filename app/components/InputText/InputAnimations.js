import isMobile from "../../utils/isMobile";
import anim from "../../utils/anim";

export default class InputAnimations {
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
    this.navBtn = this.navEl.querySelector(".nav__btn");
    this.categoriesListEl = document.querySelector(".categories__list--container");
    this.carousselEl = document.querySelector(".caroussel__container");
    this.infoTextEl = document.querySelector(".info-text");
  }

  toInitial({ delay = 0, transformInput = true } = {}) {
    this.inputFrontEl.style.pointerEvents = "auto";
    this.inputBackEl.style.pointerEvents = "none";

    anim(this.inputFrontEl, [{ height: "110px" }, { height: `${this.inputFrontHeight}px` }], {
      duration: 700,
      fill: "forwards",
      ease: "ease-in-out",
    });
    anim(this.inputBackEl, [{ opacity: 1 }, { opacity: 0 }], {
      delay,
      duration: 200,
      fill: "forwards",
      ease: "ease-in-out",
    });
    anim([this.frontMicBtn, this.frontCameraBtn, this.frontCenterBtn], [{ opacity: 0 }, { opacity: 1 }], {
      delay,

      duration: 500,
      fill: "forwards",
      ease: "ease-in-out",
    });

    if (isMobile()) {
      anim(this.logoMobileEl, [{ opacity: 1 }, { opacity: 0 }], {
        duration: delay + 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
      anim(this.logoEl, [{ opacity: 0 }, { opacity: 1 }], {
        delay: delay + 300,
        duration: 300,
        fill: "forwards",
        ease: "ease-in-out",
      });
    }
  }

  fromRecordAudioToInitial() {
    this.inputFrontEl.style.pointerEvents = "auto";
    this.inputBackEl.style.pointerEvents = "none";
    setTimeout(() => (this.inputEl.style.overflow = "hidden"), 300);

    anim([this.frontMicBtn, this.frontCameraBtn, this.frontCenterBtn], [{ opacity: 0 }, { opacity: 1 }], {
      delay: 1000,
      duration: 500,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }

  toWrite({ delay = 0, animButtons = true, animLogos = false, text = "" } = {}) {
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
  }

  toStartRecording() {
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

  toStopRecording({ transcipting = true } = {}) {
    this.navEl.classList.add("active");
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

    if (transcipting) {
      lastStep.onfinish = () => {
        this.toStartTranscripting();
      };
    }
  }

  toStartTranscripting() {
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

  toStopTranscripting({ textTranscripted = "" }) {
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

    this.toWrite({ delay: 1200, animButtons: false, text: textTranscripted });
  }
}
