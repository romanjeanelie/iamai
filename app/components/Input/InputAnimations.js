import isMobile from "../../utils/isMobile";
import anim from "../../utils/anim";

export default class InputAnimations {
  constructor({ pageEl }) {
    this.pageEl = pageEl;
    this.inputEl = this.pageEl.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");

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

    // Image
    this.inputImageContainer = this.inputEl.querySelector(".input__image--container");

    // Other dom elements
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.logoEl = document.querySelector(".logo__main");
    this.logoMobileEl = document.querySelector(".logo__mobile");
    this.categoriesListEl = document.querySelector(".categories__list--container");
    this.carousselEl = document.querySelector(".caroussel__container");
    this.infoTextEl = document.querySelector(".info-text");
  }

  // Presets
  fadeInButtons(delay = 0, duration = 500) {
    anim([this.frontMicBtn, this.frontCameraBtn, this.frontCenterBtn], [{ opacity: 0 }, { opacity: 1 }], {
      delay,
      duration,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }

  fadeOutButtons(delay = 0, duration = 500) {
    anim([this.frontMicBtn, this.frontCameraBtn, this.frontCenterBtn], [{ opacity: 1 }, { opacity: 0 }], {
      delay,
      duration,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }

  fadeInCategoriesAndCaroussel(delay = 0) {
    anim([this.categoriesListEl, this.carousselEl], [{ opacity: 0 }, { opacity: 1 }], {
      delay,

      duration: 500,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }
  fadeOutCategoriesAndCaroussel(delay = 0) {
    anim([this.categoriesListEl, this.carousselEl], [{ opacity: 1 }, { opacity: 0 }], {
      delay,
      duration: 500,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }

  fadeOutLogo(delay = 0) {
    anim(this.logoEl, [{ opacity: 1 }, { opacity: 0 }], {
      duration: delay + 300,
      fill: "forwards",
      ease: "ease-in-out",
    });
    anim(this.logoMobileEl, [{ opacity: 0 }, { opacity: 1 }], {
      delay: delay + 300,
      duration: 300,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }
  fadeInLogo(delay = 0) {
    anim(this.logoEl, [{ opacity: 0 }, { opacity: 1 }], {
      delay,
      duration: 300,
      fill: "forwards",
      ease: "ease-in-out",
    });
    anim(this.logoMobileEl, [{ opacity: 1 }, { opacity: 0 }], {
      delay,
      duration: 300,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }

  collapseHeightInputFront({ delay = 0, duration = 400 } = {}) {
    return anim(this.inputFrontEl, [{ height: "110px" }, { height: `${this.inputFrontHeight}px` }], {
      delay,
      duration,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }

  expandHeightInputFront({ delay = 0, duration = 250, heighTarget = 110 } = {}) {
    return anim(this.inputFrontEl, [{ height: `${this.inputFrontHeight}px` }, { height: `${heighTarget}px` }], {
      delay,
      duration,
      fill: "forwards",
      ease: "ease-in-out",
    });
  }
  expandWidthInputFront({ delay = 0, duration = 400 } = {}) {
    return anim(this.inputFrontEl, [{ width: `${this.inputFrontHeight}px` }, { width: "100%" }], {
      delay,
      duration,
      ease: "ease-in-out",
      fill: "forwards",
    });
  }

  fadeInInputFront({ delay = 0, duration = 400 } = {}) {
    return anim(this.inputFrontEl, [{ opacity: 0 }, { opacity: 1 }], {
      delay,
      duration,
      ease: "ease-in-out",
      fill: "forwards",
    });
  }

  // To initial
  toInitial({ delay = 0, animButtons = true, animBottom = true } = {}) {
    this.inputFrontEl.style.pointerEvents = "auto";
    this.inputBackEl.style.pointerEvents = "none";

    this.collapseHeightInputFront({ duration: 250 });

    anim(this.inputBackEl, [{ opacity: 1 }, { opacity: 0 }], {
      delay,
      duration: 100,
      fill: "forwards",
      ease: "ease-in-out",
    });

    if (animButtons) {
      this.fadeInButtons(delay);
    }

    if (animBottom) {
      this.fadeInCategoriesAndCaroussel(delay);
    }

    // if (isMobile()) {
    this.fadeInLogo(delay + 300);
    // }
  }

  fromRecordAudioToInitial() {
    this.inputFrontEl.style.pointerEvents = "auto";
    this.inputBackEl.style.pointerEvents = "none";

    this.fadeInButtons(1000);
    this.fadeInCategoriesAndCaroussel(1000);
    this.fadeInLogo(1000);
  }

  toWrite({ delay = 0, animButtons = true, animLogos = true, placeholder = "" } = {}) {
    this.inputText.placeholder = placeholder;
    this.inputFrontEl.style.pointerEvents = "none";
    this.inputBackEl.style.pointerEvents = "auto";
    this.inputEl.style.overflow = "hidden";

    // if (isMobile() && animLogos) {
    if (animLogos) {
      this.fadeOutLogo();
    }

    this.expandHeightInputFront({ delay: delay, duration: 250 });

    if (animButtons) {
      this.fadeOutButtons(delay, 100);
      this.fadeOutCategoriesAndCaroussel(delay);
    }

    anim(this.inputBackEl, [{ opacity: 0 }, { opacity: 1 }], {
      delay,
      duration: 500,
      delay: delay ? delay + 400 : 400,
      fill: "forwards",
      ease: "ease-in-out",
    });

    this.inputText.focus();
    this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
  }

  toStartRecording({ animOpacity = false, animScale = true, displayTextAudioInfo = true } = {}) {
    this.cancelBtn.classList.add("show");
    this.inputEl.style.overflow = "unset";
    this.inputEl.style.pointerEvents = "none";

    // if (isMobile()) {
    this.fadeOutLogo();
    // }

    this.fadeOutButtons(0, 100);
    this.fadeOutCategoriesAndCaroussel();

    const step1 = anim(
      this.inputFrontEl,
      [
        { width: `${this.inputFrontHeight}px`, offset: 0.45 },
        { width: `${this.inputFrontHeight}px`, offset: 1 },
      ],
      {
        duration: 600,
        fill: "forwards",
        ease: "ease-out",
      }
    );

    if (animOpacity) {
      this.animCircleYoyo = anim(this.inputFrontEl, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
        delay: step1.effect.getComputedTiming().duration,
        duration: 400,
        iterations: Infinity,
        ease: "ease-in-out",
      });
    }

    if (animScale) {
      const step2 = anim(
        this.inputFrontEl,
        [
          { transform: "translate3d(-50%, -50%, 0) scale(1)", offset: 0 },
          { transform: "translate3d(-50%, -50%, 0) scale(3.5)", offset: 1 },
        ],
        {
          delay: step1.effect.getComputedTiming().duration - 300,
          duration: 400,
          fill: "forwards",
          ease: "ease-in",
        }
      );

      this.animCircleYoyo = anim(
        this.inputFrontEl,
        [
          { transform: "translate3d(-50%, -50%, 0) scale(3.5)" },
          { transform: "translate3d(-50%, -50%, 0) scale(2.4)" },
          { transform: "translate3d(-50%, -50%, 0) scale(3.5)" },
        ],
        {
          delay: step1.effect.getComputedTiming().duration + step2.effect.getComputedTiming().duration - 300,
          duration: 800,
          iterations: Infinity,
          ease: "ease-in-out",
        }
      );
    }

    if (displayTextAudioInfo) {
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
  }

  toStopRecording({ transcipting = true } = {}) {
    this.cancelBtn.classList.remove("show");

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

    const lastStep = this.expandWidthInputFront({
      delay: step3.effect.getComputedTiming().duration + 500,
      duration: 250,
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

  toStopTranscripting() {
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

    this.toWrite({ delay: 1200, animButtons: false, animLogos: false });
  }

  toDragImage({ animBottom = true, delay = 0 } = {}) {
    // this.cancelBtn.classList.add("show");

    setTimeout(() => {
      this.frontCameraBtn.classList.add("active-imagedrop");
      this.inputImageContainer.classList.add("active");
    }, delay);

    if (animBottom) {
      this.fadeOutCategoriesAndCaroussel(0, 500);
    }
  }

  leaveDragImage({ animBottom = true } = {}) {
    // this.cancelBtn.classList.remove("show");

    this.frontCameraBtn.classList.remove("active-imagedrop");
    this.inputImageContainer.classList.remove("active");
    this.fadeInButtons();

    if (animBottom) {
      this.fadeInCategoriesAndCaroussel(0, 500);
    }
  }

  toImageDroped() {
    this.inputImageContainer.classList.remove("active");
    this.inputImageContainer.classList.add("hidden");

    this.fadeOutButtons(0, 0);

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

    this.animCircleYoyo = anim(this.inputFrontEl, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
      delay: step1.effect.getComputedTiming().duration,
      duration: 400,
      iterations: Infinity,
      ease: "ease-in-out",
    });
  }

  toImageAnalyzed() {
    this.animCircleYoyo.cancel();

    const step3 = this.fadeInInputFront({ delay: 0, duration: 300 });

    this.expandWidthInputFront({ delay: step3.effect.getComputedTiming().duration + 500, duration: 250 });

    this.toWrite({ delay: 1200, animButtons: false, animLogos: false, placeholder: "Ask a question about the image" });
  }

  toImageReset() {
    this.animCircleYoyo.cancel();

    this.fadeInButtons(300, delay);

    const step1 = this.fadeInInputFront({ delay: 0, duration: 300 });
    const step2 = this.expandWidthInputFront({ delay: step1.effect.getComputedTiming().duration + 500, duration: 250 });

    this.fadeInButtons(step1.effect.getComputedTiming().duration + step2.effect.getComputedTiming().duration + 500, 0);
  }

  // Pages
  toPageGrey() {
    this.pageBlue.classList.add("hidden");
    this.pageGrey.classList.add("show");
  }
}
