import anim from "../../utils/anim";

export default class PhoneHomeAnimations {
  constructor({ pageEl }) {
    this.pageEl = pageEl;

    this.phoneWrapper = this.pageEl.querySelector(".phone__wrapper");

    this.isConnected = false;
    this.colors = {
      talkToMe: "#2B41EE",
    };

    this.animations = [];

    // Remove animations for iOS Safari
    // this.isIOSSafari = isMobile() && isSafari();
    this.isIOSSafari = false;

    if (this.isIOSSafari) {
      this.phoneBarOne.style.display = "none";
      this.phoneBarProcessing.style.display = "none";
      this.phoneBarAI.style.display = "none";
      this.phoneBarPause.style.display = "none";
    }
  }

  animateTextTransition(text, activeText, notActiveText, animations) {
    notActiveText.textContent = text;

    const hideActiveText = anim(activeText, animations.hide, {
      duration: 300,
      ease: "ease-in-out",
      fill: "forwards",
    });

    const showNotActiveText = anim(notActiveText, animations.show, {
      duration: 300,
      ease: "ease-in-out",
      fill: "forwards",
    });

    hideActiveText.onfinish = () => activeText.classList.remove("active");
    showNotActiveText.onfinish = () => notActiveText.classList.add("active");
  }

  createAnimation(target, keyframes, options) {
    if (this.isIOSSafari) return null;
    const animation = anim(target, keyframes, options);
    this.animations.push(animation);
    return animation;
  }

  cancelAllAnimations() {
    this.isConnected = false;
    const flatAnimations = this.animations.flat();
    flatAnimations.forEach((animation) => {
      animation.cancel();
    });
    this.animations = []; // Reset the list of animations
  }

  newInfoText(text) {
    const activeText = this.phoneWrapper.querySelector(".phone__info.active");
    if (this.isIOSSafari) {
      activeText.textContent = text;
      return;
    }
    const notActiveText = this.phoneWrapper.querySelector(".phone__info:not(.active)");

    const animations = {
      hide: [
        { opacity: 1, transform: "translateX(-50%) translateY(0px)" },
        { opacity: 0, transform: "translateX(-50%) translateY(-100%)" },
      ],
      show: [
        { opacity: 0, transform: "translateX(-50%) translateY(100%)" },
        { opacity: 1, transform: " translateX(-50%)translateY(0px)" },
      ],
    };

    this.animateTextTransition(text, activeText, notActiveText, animations);
  }

  /**
   * User bar
   */
  toConnecting() {
    // TODO
  }

  toConnected() {
    this.isConnected = true;
    if (this.isIOSSafari) return;
  }

  toTalkToMe() {
    if (!this.isConnected) {
      this.toConnected();
    }

    if (this.isIOSSafari) return;

    // Remove AI
  }

  toListening() {
    if (this.isIOSSafari) return;
  }

  resetUserBar() {
    if (this.isIOSSafari) return;
  }

  /**
   * Processing bar
   */
  toProcessing() {
    if (this.isIOSSafari) return;
  }

  resetProcessingBar() {
    if (this.isIOSSafari) return;
  }

  /**
   * AI bar
   */
  toAITalking() {
    if (this.isIOSSafari) return;
  }

  resetAIBar() {
    if (this.isIOSSafari) return;
  }

  /**
   * Pause bar
   */
  toPause(type) {
    if (this.isIOSSafari) return;

    if (type === "user") {
    }

    if (type === "AI") {
    }
  }

  toResume(type) {
    if (this.isIOSSafari) return;

    if (type === "user") {
    }

    if (type === "AI") {
    }
  }

  leave() {
    if (this.isIOSSafari) return;

    this.cancelAllAnimations();
    this.resetUserBar();
    this.resetProcessingBar();
    this.resetAIBar();
  }

  keyframes = {
    fadeOutphoneWrapper: [
      { transform: "translateY(0px)", opacity: 1 },
      { transform: "translateY(-100%)", opacity: 0 },
    ],
    fadeInPhoneBarUser: [
      { transform: "translateY(200%)", opacity: 0 },
      { transform: "translateY(0px)", opacity: 1 },
    ],
  };
}
