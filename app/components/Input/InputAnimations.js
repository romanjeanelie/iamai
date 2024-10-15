import gsap, { Power2, Power3 } from "gsap";
import anim from "../../utils/anim";

export default class InputAnimations {
  constructor({ pageEl, emitter }) {
    this.pageEl = pageEl;
    this.emitter = emitter;

    // Dom Elements
    this.inputEl = this.pageEl.querySelector(".input__container");
    this.inputFrontEl = this.inputEl.querySelector(".input__front");
    this.inputBackEl = this.inputEl.querySelector(".input__back");

    this.imageUploadButton = this.inputFrontEl.querySelector(".camera-btn");
    this.videoBtn = this.inputFrontEl.querySelector(".video-btn");

    this.inputFrontHeight = this.inputFrontEl.offsetHeight;

    // Write
    this.inputText = this.inputEl.querySelector(".input-text");
    // Image
    this.inputImageContainer = this.inputEl.querySelector(".input__image--container");
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container");

    // Phone
    this.phoneWrapper = this.pageEl.querySelector(".phone__wrapper");

    // Other dom elements
    this.logoEl = document.querySelector(".logo__main");
    this.logoMobileEl = document.querySelector(".logo__mobile");
    this.categoriesListEl = document.querySelector(".categories__list--container");
    this.carousselEl = document.querySelector(".caroussel__container");
    this.navbarEl = document.querySelector(".nav");

    // Init methods
    this.initializeInputHidden();
  }

  initializeInputHidden() {
    gsap.set(this.inputEl, { opacity: 0 });
  }

  showInput() {
    gsap.fromTo(
      this.inputEl,
      { yPercent: 200, opacity: 0 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.75,
        ease: Power3.easeOut,
        onComplete: () => {
          this.inputEl.classList.remove("hidden");
        },
      }
    );
  }

  hideInput() {
    gsap.to(this.inputEl, {
      opacity: 0,
      yPercent: 100,
      duration: 0.5,
      ease: Power3.easeOut,
      onComplete: () => {
        this.inputEl.classList.add("hidden");
      },
    });
  }

  // Presets
  fadeInButtons(delay = 0, duration = 500) {
    gsap.to([this.imageUploadButton, this.videoBtn], {
      opacity: 1,
      duration: duration / 1000,
      ease: Power3.easeInOut,
      delay: delay / 1000,
      onComplete: () => {
        this.imageUploadButton.style.pointerEvents = "auto";
        this.videoBtn.style.pointerEvents = "auto";
      },
    });
  }

  fadeOutButtons(delay = 0, duration = 500) {
    gsap.to([this.imageUploadButton, this.videoBtn], {
      opacity: 0,
      duration: duration / 1000,
      ease: Power3.easeInOut,
      delay: delay / 1000,
      onComplete: () => {
        this.imageUploadButton.style.pointerEvents = "none";
        this.videoBtn.style.pointerEvents = "none";
      },
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
    this.emitter.emit("input:collapseHeight");
    return anim(
      this.inputFrontEl,
      [
        { height: "110px", opacity: 1 },
        { height: `${this.inputFrontHeight}px`, opacity: 1 },
      ],
      {
        delay,
        duration,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );
  }

  expandHeightInputFront({ delay = 0, duration = 250, heighTarget = 100 } = {}) {
    this.emitter.emit("input:expandHeight");
    return anim(
      this.inputFrontEl,
      [
        { height: `${this.inputFrontHeight}px`, opacity: 1 },
        { height: `${heighTarget}px`, opacity: 1 },
      ],
      {
        delay,
        duration,
        fill: "forwards",
        ease: "ease-in-out",
      }
    );
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
    if (animButtons) {
      this.fadeInButtons();
    }
    this.inputText.placeholder = placeholder;
  }

  /**
   * Phone
   */
  toStartPhoneRecording() {
    this.inputEl.classList.add("hidden");
    this.phoneWrapper.classList.add("show");
  }

  toStopPhoneRecording() {
    const fadeOutphoneWrapper = anim(
      this.phoneWrapper,
      [
        { opacity: 1, transform: "translateY(0px)" },
        { opacity: 0, transform: "translateY(100%)" },
      ],
      {
        duration: 150,
        ease: "ease-in-out",
        fill: "forwards",
      }
    );

    fadeOutphoneWrapper.onfinish = () => {
      const fadeInIput = anim(
        this.inputEl,
        [
          { opacity: 0, transform: "translateY(100%)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 300,
          ease: "ease-in-out",
          fill: "forwards",
        }
      );
      fadeOutphoneWrapper.cancel();
      this.inputEl.classList.remove("hidden");
      this.phoneWrapper.classList.remove("show");

      fadeInIput.onfinish = () => {
        fadeInIput.cancel();
      };
    };
  }

  leaveDragImage({ animBottom = true } = {}) {
    this.imageUploadButton.classList.remove("active-imagedrop");
    this.inputImageContainer.classList.remove("show");
    this.fadeInButtons();

    if (animBottom) {
      this.fadeInCategoriesAndCaroussel(0, 500);
    }
  }

  toLoadingImage() {
    this.inputText.disabled = false;
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
    this.animCircleYoyo.cancel();

    const step3 = this.fadeInInputFront({ delay: 0, duration: 300 });

    this.expandWidthInputFront({ delay: step3.effect.getComputedTiming().duration + 500, duration: 250 });

    this.toWrite({ delay: 1200, animButtons: false, animLogos: false, placeholder: "Ask a question about the image" });
    this.imageDroppedContainer.classList.add("visible");
  }

  toRemoveImage() {
    this.imageDroppedContainer.classList.remove("visible");

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
