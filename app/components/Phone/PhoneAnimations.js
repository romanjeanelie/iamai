import anim from "../../utils/anim";
import { isSafari } from "../../utils/detectNavigators";
import isMobile from "../../utils/isMobile";

export default class PhoneAnimations {
  constructor({ pageEl }) {
    this.pageEl = pageEl;

    this.phoneContainer = this.pageEl.querySelector(".phone__container");
    this.phoneBarContainer = this.phoneContainer.querySelector(".phone-bar__container");
    // User
    this.phoneBarOne = this.phoneBarContainer.querySelector(".phone-bar__one");
    this.phoneBarOneDots = this.phoneBarOne.querySelectorAll(".dot");
    // Processing
    this.phoneBarProcessing = this.phoneBarContainer.querySelector(".phone-bar__processing");
    this.phoneBarProcessingDots = this.phoneBarProcessing.querySelectorAll(".dot");
    // AI
    this.phoneBarAI = this.phoneBarContainer.querySelector(".phone-bar__AI");
    // Pause
    this.phoneBarPause = this.phoneBarContainer.querySelector(".phone-bar__pause");

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
    const activeText = this.phoneContainer.querySelector(".phone__info.active");
    if (this.isIOSSafari) {
      activeText.textContent = text;
      return;
    }
    const notActiveText = this.phoneContainer.querySelector(".phone__info:not(.active)");

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
    if (this.isIOSSafari) return;
    this.dotsYoyoAnimations = this.createAnimation(
      [this.phoneBarOneDots[0], this.phoneBarOneDots[1]],
      [{ width: "30px" }, { width: "8px" }, { width: "30px" }],
      {
        duration: 900,
        ease: "ease-out",
        iterations: Infinity,
      }
    );
  }

  toConnected() {
    this.isConnected = true;
    if (this.isIOSSafari) return;
    this.dotsYoyoAnimations.forEach((anim) => anim.cancel());
    this.phoneBarOneDots.forEach((dot) => dot.classList.add("expand"));
    this.phoneBarOne.classList.add("active");
    this.createAnimation([this.phoneBarOneDots[0], this.phoneBarOneDots[1]], [{ opacity: 1 }, { opacity: 0 }], {
      duration: 100,
      ease: "ease-out",
      fill: "forwards",
    });
  }

  toTalkToMe() {
    if (!this.isConnected) {
      this.toConnected();
    }

    if (this.isIOSSafari) return;

    // Remove AI
    if (this.phoneBarAIYoyoAnimations) {
      this.phoneBarAIYoyoAnimations.cancel();
      const fadeOutPhoneBarAI = this.createAnimation(this.phoneBarAI, this.keyframes.fadeOutPhoneBarAI, {
        duration: 300,
        ease: "ease-out",
        fill: "forwards",
      });

      this.phoneBarOne.classList.add("active");
      this.phoneBarOne.classList.add("talkToMe");
      const fadeInPhoneBarUser = this.createAnimation(this.phoneBarOne, this.keyframes.fadeInPhoneBarUser, {
        duration: 300,
        ease: "ease-out",
        fill: "forwards",
      });

      fadeInPhoneBarUser.onfinish = () => {
        this.expandPhoneBarAI.cancel();
        this.phoneBarAI.classList.remove("active");
        fadeOutPhoneBarAI.cancel();
      };
    }

    this.phoneBarOne.classList.add("talkToMe");
    this.phoneBarUserYoyoAnimations = this.createAnimation(this.phoneBarOne, this.keyframes.phoneBarYoyo, {
      duration: 900,
      ease: "ease-out",
      iterations: Infinity,
    });
  }

  toListening() {
    if (this.isIOSSafari) return;

    this.phoneBarUserYoyoAnimations?.cancel();
    this.phoneBarUserYoyoAnimations = this.createAnimation(this.phoneBarOne, this.keyframes.phoneBarListeningYoyo, {
      duration: 900,
      ease: "ease-out",
      iterations: Infinity,
    });
  }

  resetUserBar() {
    if (this.isIOSSafari) return;

    this.phoneBarOne.classList.remove("active");
    this.phoneBarOne.classList.remove("talkToMe");
    this.phoneBarOneDots.forEach((dot) => dot.classList.remove("expand"));
  }

  /**
   * Processing bar
   */
  toProcessing() {
    if (this.isIOSSafari) return;

    const isPhoneBarUserActive =
      this.phoneBarOne.classList.contains("active") || this.phoneBarOne.classList.contains("talkToMe");
    const fadeOutDuration = 400;
    // Remove User
    if (isPhoneBarUserActive) {
      this.phoneBarUserYoyoAnimations.cancel();
      this.createAnimation(this.phoneBarOne, this.keyframes.reducePhoneBarOne, {
        duration: fadeOutDuration,
        ease: "ease-out",
        fill: "forwards",
      });
      this.phoneBarOne.classList.remove("active");
      // Remove AI
    } else {
      this.expandPhoneBarAI.cancel();
      this.phoneBarAIYoyoAnimations.cancel();
      const fadeOutPhoneBarAI = this.createAnimation(this.phoneBarAI, this.keyframes.fadeOutPhoneBarAI, {
        duration: fadeOutDuration,
        ease: "ease-out",
        fill: "forwards",
      });

      this.phoneBarAI.classList.remove("active");

      fadeOutPhoneBarAI.onfinish = () => {
        fadeOutPhoneBarAI.cancel();
      };
    }

    setTimeout(() => {
      if (isPhoneBarUserActive) {
        this.phoneBarOne.classList.remove("active");
        this.phoneBarOne.classList.remove("talkToMe");
      }
      this.phoneBarProcessing.classList.add("active");

      const expandPhoneBarProcessing = this.createAnimation(
        this.phoneBarProcessing,
        this.keyframes.expandPhoneBarProcessing,
        {
          duration: 400,
          ease: "ease-out",
          fill: "forwards",
        }
      );

      this.dotsYoyoAnimations = Array.from(this.phoneBarProcessingDots).map((dot) =>
        this.createAnimation(dot, this.keyframes.dotsYoyo, {
          delay: 500,
          duration: 1500,
          ease: "ease-out",
          iterations: Infinity,
        })
      );

      this.backgroundBarProcessingYoyo = this.createAnimation(
        this.phoneBarProcessing,
        this.keyframes.backgroundBarProcessingYoyo,
        {
          delay: 500,
          duration: 1500,
          ease: "ease-out",
          iterations: Infinity,
        }
      );
    }, fadeOutDuration);
  }

  resetProcessingBar() {
    if (this.isIOSSafari) return;

    this.phoneBarProcessing.classList.remove("active");
    this.phoneBarProcessingDots.forEach((dot) => dot.classList.remove("expand"));
  }

  /**
   * AI bar
   */
  toAITalking() {
    if (this.isIOSSafari) return;

    this.dotsYoyoAnimations.forEach((anim) => anim.cancel());
    this.backgroundBarProcessingYoyo?.cancel();
    const reducePhoneBarProcessing = this.createAnimation(
      this.phoneBarProcessing,
      this.keyframes.reducePhoneBarProcessing,
      {
        duration: 400,
        ease: "ease-out",
        fill: "forwards",
      }
    );

    reducePhoneBarProcessing.onfinish = () => {
      this.phoneBarProcessing.classList.remove("active");
      this.phoneBarAI.classList.add("active");

      this.expandPhoneBarAI = this.createAnimation(this.phoneBarAI, this.keyframes.expandPhoneBarAI, {
        delay: 300,
        duration: 400,
        ease: "ease-out",
        fill: "forwards",
      });

      this.phoneBarAIYoyoAnimations = this.createAnimation(this.phoneBarAI, this.keyframes.phoneBarAIYoyo, {
        delay: 300 + this.expandPhoneBarAI.effect.getComputedTiming().duration,
        duration: 900,
        ease: "ease-out",
        iterations: Infinity,
      });
    };
  }

  resetAIBar() {
    if (this.isIOSSafari) return;

    this.phoneBarAI.classList.remove("active");
    this.phoneBarAIYoyoAnimations?.cancel();
    this.phoneBarAIYoyoAnimations = null;
  }

  /**
   * Pause bar
   */
  toPause(type) {
    if (this.isIOSSafari) return;

    this.phoneBarPause.classList.add("active");

    if (type === "user") {
      this.phoneBarOne.classList.remove("active");
      this.phoneBarOne.classList.remove("talkToMe");
    }

    if (type === "AI") {
      this.phoneBarAI.classList.remove("active");
      //   this.phoneBarAIYoyoAnimations?.cancel();
      //   this.phoneBarAIYoyoAnimations = null;
    }
  }

  toResume(type) {
    if (this.isIOSSafari) return;

    this.phoneBarPause.classList.remove("active");

    if (type === "user") {
      this.phoneBarOne.classList.add("active");
      this.phoneBarOne.classList.add("talkToMe");
    }

    if (type === "AI") {
      this.phoneBarAI.classList.add("active");
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
    fadeOutPhoneBarAI: [
      { transform: "translateY(0px)", opacity: 1 },
      { transform: "translateY(-100%)", opacity: 0 },
    ],
    fadeOutPhoneContainer: [
      { transform: "translateY(0px)", opacity: 1 },
      { transform: "translateY(-100%)", opacity: 0 },
    ],
    fadeInPhoneBarUser: [
      { transform: "translateY(200%)", opacity: 0 },
      { transform: "translateY(0px)", opacity: 1 },
    ],
    phoneBarYoyo: [{ width: "32px" }, { width: "8px" }, { width: "32px" }],
    phoneBarListeningYoyo: [{ width: "32px" }, { width: "132px" }, { width: "32px" }],
    reducePhoneBarOne: [{ width: "32px" }, { width: "8px" }],
    expandPhoneBarProcessing: [{ width: "8px" }, { width: "132px" }],
    dotsYoyo: [
      { width: "8px", offset: 0 },
      { width: "8px", offset: 0.1 },
      { width: "34px", offset: 0.3 },
      { width: "34px", offset: 0.7 },
      { width: "8px", offset: 1 },
    ],
    backgroundBarProcessingYoyo: [
      { background: "unset", offset: 0 },
      { background: "unset", offset: 0.29 },
      { background: "unset", offset: 0.3 },
      { background: "unset", offset: 0.7 },
      { background: "unset", offset: 0.71 },
      { background: "unset", offset: 1 },
    ],
    reducePhoneBarProcessing: [{ width: "132px" }, { width: "8px" }],
    expandPhoneBarAI: [{ width: "8px" }, { width: "132px" }],
    phoneBarAIYoyo: [{ width: "132px" }, { width: "32px" }, { width: "132px" }],
  };
}
