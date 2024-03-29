import isMobile from "../../utils/isMobile";
import anim from "../../utils/anim";

export default class InputAnimations {
  constructor({ pageEl }) {
    this.pageEl = pageEl;
    this.isPageBlue = this.pageEl.classList.contains("page-blue");

    this.inputEl = this.pageEl.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");

    this.centerBtn = this.inputFrontEl.querySelector(".center-btn");
    this.frontCameraBtn = this.inputFrontEl.querySelector(".camera-btn");
    this.frontMicBtn = this.inputFrontEl.querySelector(".mic-btn") || this.inputFrontEl.querySelector(".phone-btn");
    this.frontCenterBtn = this.inputFrontEl.querySelector(".center-btn");

    this.inputFrontHeight = this.inputFrontEl.offsetHeight;

    // Record
    // Front input
    if (this.isPageBlue) {
      this.recordCounter = this.inputEl.querySelector(".record-counter");
      this.infoTextEl = document.querySelector(".info-text");
    } else {
      this.overlayRecordingEl = this.pageEl.querySelector(".overlay__recording");
      this.recordCircle = this.overlayRecordingEl.querySelector(".circle");
      this.recordCounter = this.overlayRecordingEl.querySelector(".record-counter");
      this.infoTextEl = this.overlayRecordingEl.querySelector(".info-text");
    }

    // Write
    this.inputText = this.inputBackEl.querySelector(".input-text");

    // Image
    this.inputImageContainer = this.inputEl.querySelector(".input__image--container");
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container");

    // Phone
    this.phoneContainer = this.pageEl.querySelector(".phone__container");

    // Other dom elements
    this.pageBlue = document.querySelector(".page-blue");
    this.pageGrey = document.querySelector(".page-grey");
    this.cancelBtn = document.querySelector(".cancel-btn");
    this.logoEl = document.querySelector(".logo__main");
    this.logoMobileEl = document.querySelector(".logo__mobile");
    this.categoriesListEl = document.querySelector(".categories__list--container");
    console.log(this.categoriesListEl, this.carousselEl)
    this.carousselEl = document.querySelector(".caroussel__container");
    this.navbarEl = document.querySelector(".nav");
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

  /**
   * Initial
   */
  toInitial({ delay = 0, animButtons = true, animBottom = true, animLogo = true } = {}) {
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

    if (animLogo) {
      this.fadeInLogo(delay + 300);
    }
  }

  fromRecordAudioToInitial() {
    this.inputFrontEl.style.pointerEvents = "auto";
    this.inputBackEl.style.pointerEvents = "none";

    this.fadeInButtons(1000);
    this.fadeInCategoriesAndCaroussel(1000);
    this.fadeInLogo(1000);
  }

  /**
   * Write
   */
  toWrite({ delay = 0, animButtons = true, animLogos = true, placeholder = "", focus = true } = {}) {
    this.inputText.placeholder = placeholder;
    this.inputFrontEl.style.pointerEvents = "none";
    this.inputBackEl.style.pointerEvents = "auto";
    this.inputEl.style.overflow = "hidden";

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

    // Fix when we come back from image input to not hav break lines on input
    setTimeout(() => {
      this.inputText.disabled = false;
    }, 1);

    if (!focus) return;
    if (isMobile() && !this.isPageBlue) {
      this.inputText.click();
    } else {
      this.inputText.focus();
      this.inputText.setSelectionRange(this.inputText.value.length, this.inputText.value.length);
    }
  }

  /**
   * Record audio
   */
  toStartRecorginBluePage() {
    this.inputEl.style.overflow = "unset";

    this.fadeOutLogo();
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

  toStartRecordingGreyPage() {
    this.overlayRecordingEl.classList.add("show");
    this.inputEl.classList.add("hidden");

    this.animCircleYoyo = anim(
      this.recordCircle,
      [
        { transform: "translate3d(-50%, -50%, 0) scale(1.3)" },
        { transform: "translate3d(-50%, -50%, 0) scale(1)" },
        { transform: "translate3d(-50%, -50%, 0) scale(1.3)" },
      ],
      {
        duration: 800,
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
        duration: 700,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );
  }

  toStartRecording() {
    this.cancelBtn.classList.add("show");
    this.navbarEl.classList.add("hidden");

    this.fadeOutButtons(0, 100);
    this.inputEl.style.pointerEvents = "none";

    if (this.isPageBlue) {
      this.toStartRecorginBluePage();
    } else {
      this.toStartRecordingGreyPage();
    }
  }

  toStopRecording(callback) {
    this.cancelBtn.classList.remove("show");
    this.navbarEl.classList.remove("hidden");
    this.inputEl.style.pointerEvents = "unset";

    this.animCircleYoyo.cancel();

    if (this.isPageBlue) {
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

      if (callback?.onComplete) {
        lastStep.onfinish = callback.onComplete;
      }
    } else {
      this.overlayRecordingEl.classList.remove("show");
      this.inputEl.classList.remove("hidden");
      if (callback?.onComplete) {
        callback.onComplete();
      }
    }
  }

  /**
   * Phone
   */
  toStartPhoneRecording() {
    this.inputEl.classList.add("hidden");
    this.phoneContainer.classList.add("show");
  }
  toStopPhoneRecording() {
    const fadeOutPhoneContainer = anim(
      this.phoneContainer,
      [
        { opacity: 1, transform: "translateY(0px)" },
        { topacity: 0, transform: "translateY(100%)" },
      ],
      {
        duration: 300,
        ease: "ease-in-out",
        fill: "forwards",
      }
    );

    fadeOutPhoneContainer.onfinish = () => {
      const fadeInIput = anim(
        this.inputEl,
        [
          { opacity: 0, transform: "translateY(100%)" },
          { topacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 300,
          ease: "ease-in-out",
          fill: "forwards",
        }
      );
      fadeOutPhoneContainer.cancel();
      this.inputEl.classList.remove("hidden");
      this.phoneContainer.classList.remove("show");

      fadeInIput.onfinish = () => {
        fadeInIput.cancel();
      };
    };
  }

  /**
   * Image
   */
  toDragImage({ animBottom = true, delay = 0 } = {}) {
    // Prvent break lines when we enter url
    this.inputText.disabled = true;

    this.imageDroppedContainer.classList.remove("visible");

    setTimeout(() => {
      this.frontCameraBtn.classList.add("active-imagedrop");
      this.inputImageContainer.classList.add("show");
    }, delay);

    if (animBottom) {
      this.fadeOutCategoriesAndCaroussel(0, 500);
    }
  }

  leaveDragImage({ animBottom = true } = {}) {
    this.frontCameraBtn.classList.remove("active-imagedrop");
    this.inputImageContainer.classList.remove("show");
    this.fadeInButtons();

    if (animBottom) {
      this.fadeInCategoriesAndCaroussel(0, 500);
    }
  }

  toImageDroped() {
    this.inputImageContainer.classList.remove("show");

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
    // this.cancelBtn.classList.add("show");
    // this.cancelBtn.classList.add("image-drop");
    this.navbarEl.classList.add("hidden");

    this.animCircleYoyo.cancel();

    const step3 = this.fadeInInputFront({ delay: 0, duration: 300 });

    this.expandWidthInputFront({ delay: step3.effect.getComputedTiming().duration + 500, duration: 250 });

    this.toWrite({ delay: 1200, animButtons: false, animLogos: false, placeholder: "Ask a question about the image" });
    this.imageDroppedContainer.classList.add("visible");
  }

  toRemoveImage() {
    this.imageDroppedContainer.classList.remove("visible");
    // this.cancelBtn.classList.remove("show");
    // this.cancelBtn.classList.remove("image-drop");

    this.navbarEl.classList.remove("hidden");
    this.toInitial({ animLogo: false });
  }

  toImageReset(delay = 0) {
    this.animCircleYoyo.cancel();

    const step1 = this.fadeInInputFront({ delay: 0, duration: 300 });
    const step2 = this.expandWidthInputFront({ delay: step1.effect.getComputedTiming().duration + 500, duration: 250 });

    this.fadeInButtons(
      step1.effect.getComputedTiming().duration + step2.effect.getComputedTiming().duration + 500,
      delay
    );
  }
}
