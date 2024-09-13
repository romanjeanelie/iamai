import gsap from "gsap";
import { Flip } from "gsap/Flip";

export default class TaskCardAnimations {
  constructor(card, index) {
    this.card = card;
    this.index = index;

    this.cardState = this.card.querySelector(".card-state");
    this.fullscreenState = this.card.querySelector(".fullscreen-state");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
  }

  cardToFullScreen(callback) {
    const taskCards = document.querySelectorAll(".task-manager__task-card");
    const cardState = this.card.querySelector(".card-state");
    const fullscreenState = this.card.querySelector(".fullscreen-state");
    const tl = gsap.timeline();

    this.remainingCards = Array.from(taskCards).filter((card) => card.getAttribute("index") != this.index);
    this.beforeCards = this.remainingCards.filter((card) => card.getAttribute("index") < this.index);
    this.afterCards = this.remainingCards.filter((card) => card.getAttribute("index") > this.index);

    tl.to(cardState, {
      opacity: 0,
      duration: 0.2,
    });
    tl.add(() => {
      const state = Flip.getState(this.card);
      this.fullscreenContainer.appendChild(this.card);
      fullscreenState.style.display = "flex";
      cardState.style.display = "none";
      Flip.from(state, {
        duration: 0.5,
        absolute: true,
        onComplete: callback,
      });
    });
    tl.to(
      this.beforeCards,
      {
        y: -100,
        opacity: 0,
        duration: 0.2,
      },
      "<"
    );
    tl.to(
      this.afterCards,
      {
        y: 100,
        opacity: 0,
        duration: 0.2,
      },
      "<"
    );
    tl.to(
      fullscreenState,
      {
        autoAlpha: 1,
        duration: 0.5,
      },
      "<0.5"
    );

    return tl;
  }

  fullscreenToCard() {
    const tasks = document.querySelectorAll(".task-manager__task-card-container");

    const cardState = this.card.querySelector(".card-state");
    const fullscreenState = this.card.querySelector(".fullscreen-state");

    const tl = gsap.timeline();

    tl.to(fullscreenState, {
      opacity: 0,
    });
    tl.add(() => {
      const state = Flip.getState(this.card);
      tasks[this.index].appendChild(this.card);
      fullscreenState.style.display = "none";
      cardState.style.display = "flex";

      Flip.from(state, {
        duration: 0.5,
        delay: 0.5,
        onComplete: () => {
          gsap.to(cardState, {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          });
        },
      });
    });
    tl.to(this.remainingCards, {
      y: 0,
      opacity: 1,
      duration: 0.2,
      delay: 1,
    });
  }
}
