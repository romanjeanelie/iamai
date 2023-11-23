import anim from "./utils/anim";

export default class TypingText {
  constructor({ text, container }) {
    this.text = text;
    this.container = container;

    this.init();
  }

  init() {
    console.log("init");

    this.typingContainer = document.createElement("div");
    this.cursorEl = document.createElement("span");
    const textEl = document.createElement("p");
    this.typingContainer.classList.add("typing__container");
    this.cursorEl.classList.add("typing__cursor");
    textEl.classList.add("typing__text");
    textEl.textContent = this.text;

    textEl.appendChild(this.cursorEl);
    this.typingContainer.appendChild(textEl);

    this.container.appendChild(this.typingContainer);
  }

  blink() {
    console.log("blink");
    this.typingContainer.style.visibility = "visible";
    this.typingContainer.style.opacity = 1;

    this.blinkCursor = anim(this.cursorEl, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
      //   delay:
      duration: 500,
      iterations: Infinity,
      ease: "ease-in-out",
    });
  }

  writing(callback) {
    console.log("writing");
    if (this.blinkCursor) this.blinkCursor.cancel();

    this.animShowtyping = anim(
      this.typingContainer,
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

    this.translateCursor = anim(this.cursorEl, [{ transform: "translateX(0%)" }, { transform: "translateX(105%)" }], {
      delay: this.animShowtyping.effect.getComputedTiming().duration,
      duration: 400,
      fill: "forwards",
      ease: "ease-in-out",
    });

    if (callback?.onComplete) {
      this.translateCursor.onfinish = callback.onComplete.bind(this);
    }
  }

  reverse() {
    if (this.blinkCursor) this.blinkCursor.cancel();
    this.translateCursor.reverse();

    anim(
      this.typingContainer,
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
  }
}
