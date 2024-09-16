import anim, { asyncAnim } from "./utils/anim.js";

export default class TypingText {
  constructor({ text, container, backgroundColor, marginLeft }) {
    this.text = text;
    this.container = container;
    this.backgroundColor = backgroundColor;
    this.marginLeft = marginLeft;
    this.init();
  }

  init() {
    let textContainer = this.container.querySelector(".text__container");

    if (!textContainer) {
      textContainer = document.createElement("div");
      textContainer.className = "text__container";
      this.container.appendChild(textContainer);
    }

    this.typingContainer = document.createElement("div");

    this.maskEl = document.createElement("div");
    this.logo = document.createElement("div");
    const imgEl = document.createElement("img");
    imgEl.setAttribute("src", "./images/asterizk_blue.svg");
    this.logo.appendChild(imgEl);

    this.skeletonContainer = document.createElement("div");
    this.skeletonContainer.classList.add("typing__skeleton-container");
    this.skeletons = [];

    for (let i = 0; i < 4; i++) {
      let skeleton = document.createElement("div");
      skeleton.classList.add("typing__skeleton");
      skeleton.classList.add(`typing__skeleton-${i}`);
      this.skeletons.push(skeleton);
    }

    this.textEl = document.createElement("p");

    this.maskEl.classList.add("typing__mask");
    this.logo.classList.add("typing__logo");
    this.textEl.classList.add("typing__text");

    this.textEl.textContent = this.text;

    this.typingContainer.style.left = `${this.marginLeft}px`;

    this.maskEl.appendChild(this.logo);
    this.textEl.appendChild(this.maskEl);
    this.typingContainer.appendChild(this.textEl);
    this.typingContainer.appendChild(this.skeletonContainer);
    this.skeletons.forEach((skeleton) => this.skeletonContainer.appendChild(skeleton));
    textContainer.appendChild(this.typingContainer);
  }

  updateText(text) {
    this.textEl.textContent = text;
    this.textEl.appendChild(this.maskEl);
  }

  fadeIn() {
    this.typingContainer.style.visibility = "visible";
    this.typingContainer.style.opacity = 1;
  }

  displayTextSkeleton() {
    this.skeletons.forEach((skeleton, idx) => {
      anim(skeleton, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
        duration: 500,
        delay: 50 * idx,
        fill: "forwards",
        ease: "ease-out",
      });
    });
  }

  async fadeOut() {
    await asyncAnim(this.typingContainer, [{ opacity: 1 }, { opacity: 0 }]);
    this.typingContainer.style.display = "none";
  }
}
