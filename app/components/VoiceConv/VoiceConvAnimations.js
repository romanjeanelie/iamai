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
}
