import anim from "./utils/anim";

export default class TypingText {
  constructor({ text, container, backgroundColor, marginLeft }) {
    this.text = text;
    this.container = container;
    this.backgroundColor = backgroundColor;
    this.marginLeft = marginLeft;

    this.init();
  }

  init() {
    this.typingContainer = document.createElement("div");
    this.maskEl = document.createElement("div");
    this.cursorEl = document.createElement("span");
    this.textEl = document.createElement("p");
    this.typingContainer.classList.add("typing__container");
    this.maskEl.classList.add("typing__mask");
    this.cursorEl.classList.add("typing__cursor");
    this.textEl.classList.add("typing__text");

    this.textEl.textContent = this.text;
    this.maskEl.style.backgroundColor = this.backgroundColor;
    this.typingContainer.style.left = `${this.marginLeft}px`;

    this.maskEl.appendChild(this.cursorEl);
    this.textEl.appendChild(this.maskEl);
    this.typingContainer.appendChild(this.textEl);

    this.container.appendChild(this.typingContainer);

    this.translateCursor = null;
  }

  updateText(text) {
    this.textEl.textContent = text;
    this.textEl.appendChild(this.maskEl);
  }

  blink() {
    this.typingContainer.style.visibility = "visible";
    this.typingContainer.style.opacity = 1;

    this.blinkCursor = anim(this.cursorEl, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
      //   delay:
      duration: 500,
      iterations: Infinity,
      ease: "ease-in-out",
    });
  }

  fadeOut() {
    if (this.blinkCursor) this.blinkCursor.cancel();
    this.cursorEl.classList.add("hidden");
  }

  writing() {
    return new Promise((resolve) => {
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

      this.translateCursor = anim(this.maskEl, [{ transform: "translateX(0%)" }, { transform: "translateX(105%)" }], {
        delay: this.animShowtyping.effect.getComputedTiming().duration,
        duration: 200,
        fill: "forwards",
        ease: "ease-in-out",
      });

      this.translateCursor.onfinish = () => {
        resolve();
      };
    });
  }

  reverse() {
    return new Promise((resolve) => {
      this.translateCursor.reverse();

      anim(
        this.typingContainer,
        [
          { opacity: 1, visibility: "visible" },
          { opacity: 0, visibility: "hidden" },
        ],
        {
          delay: 200,
          duration: 1,
          fill: "forwards",
          ease: "ease-in-out",
        }
      ).onfinish = () => {
        resolve();
      };
    });
  }
}
