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
    this.logo = document.createElement("div");
    const imgEl = document.createElement('img');

    imgEl.setAttribute("src", "./images/asterizk_pink.svg" );
    this.logo.appendChild(imgEl);
    
    this.skeletonContainer = document.createElement("div");
    this.skeletonContainer.classList.add("typing__skeleton-container");
    this.skeletons = [];

    for (let i = 0; i < 4; i++) {
      let skeleton = document.createElement("div");
      skeleton.classList.add("typing__skeleton");
      skeleton.classList.add(`typing__skeleton-${i}`)
      this.skeletons.push(skeleton);
    }   
    
    this.textEl = document.createElement("p");
    this.typingContainer.classList.add("typing__container");
    this.maskEl.classList.add("typing__mask");
    this.logo.classList.add("typing__logo");
    this.textEl.classList.add("typing__text");

    this.textEl.textContent = this.text;
    this.maskEl.style.backgroundColor = this.backgroundColor;
    this.typingContainer.style.left = `${this.marginLeft}px`;

    this.maskEl.appendChild(this.logo);
    this.textEl.appendChild(this.maskEl);
    this.typingContainer.appendChild(this.textEl);
    this.typingContainer.appendChild(this.skeletonContainer);
    this.skeletons.forEach(skeleton => this.skeletonContainer.appendChild(skeleton));
    this.container.appendChild(this.typingContainer);

    this.translateCursor = null;
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
    this.skeletons.forEach((skeleton,idx)=> {
      anim(skeleton, [
        { transform:"scaleX(0)" },
        { transform: "scaleX(1)" },
      ], {
        duration: 500,
        delay: 50 * idx,
        fill: "forwards",
        ease: "ease-out",
      })
    })
  }


  displayImageSkeleton() {
    this.logo.style.display = "none";
    this.skeletonContainer.classList.add("skeleton__image");

    this.skeletons.forEach((skeleton,idx)=> {
      anim(skeleton, [
        { transform:"scaleY(0)" },
        { transform: "scaleY(1)" },
      ], {
        duration: 250,
        delay: 10 * idx,
        fill: "forwards",
        ease: "ease-out",
      })
    })
  }

  fadeOut() {
    this.logo.classList.add("hidden");
    this.skeletonContainer.classList.add("hidden");
    this.skeletonContainer.classList.remove("skeleton__image");
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
