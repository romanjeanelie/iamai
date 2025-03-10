import anim from "../../utils/anim";

export default class VoiceConvHomeAnimations {
  constructor({ mainContainer }) {
    this.mainContainer = mainContainer;
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

  newInfoText(text) {
    const activeText = this.mainContainer?.querySelector(".input__info.active");

    if (!activeText) return;
    if (this.isIOSSafari) {
      activeText.textContent = text;
      return;
    }
    const notActiveText = this.mainContainer?.querySelector(".input__info:not(.active)");

    const animations = {
      hide: [
        { opacity: 1, transform: "translateY(0px)" },
        { opacity: 0, transform: "translateY(-100%)" },
      ],
      show: [
        { opacity: 0, transform: "translateY(100%)" },
        { opacity: 1, transform: "translateY(0px)" },
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
