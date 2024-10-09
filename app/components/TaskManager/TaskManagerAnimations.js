import gsap from "gsap";
import { Flip } from "gsap/Flip";

export default class TaskManagerAnimations {
  constructor(emitter) {
    this.emitter = emitter;
    this.container = document.querySelector(".task-manager__container");

    // Bindings
    this.showCards = this.showCards.bind(this);
    this.hideCards = this.hideCards.bind(this);

    // Init Methods
    this.initAnimations();
  }

  updateCards(newCards) {
    this.cards = newCards;
    this.initAnimations();
    this.initIntersectionObserver();
  }

  hideCards() {
    const cards = document.querySelectorAll(".task-manager__task-card-container");
    gsap.to(cards, { opacity: 0, y: 50, duration: 0.1, stagger: 0.05 });
  }

  showCards() {
    const cards = document.querySelectorAll(".task-manager__task-card-container");
    gsap.killTweensOf(cards);
    gsap.set(cards, { opacity: 0, y: 50 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.2,
      stagger: 0.05,
      delay: 0.3,
    });
  }

  cardInOutAnimation(newCard, initialState) {
    Flip.from(initialState, {
      duration: 0.3,
      ease: "power1.inOut",
      onStart: () => {
        return gsap.fromTo(
          newCard.cardContainer,
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            delay: 0.2,
            duration: 0.3,
          }
        );
      },
    });
  }

  initAnimations() {
    gsap.set(this.cards, { opacity: 0, y: 50 }); // Set initial state for all cards

    this.emitter.on("Navigation:openTasks", this.showCards);
    this.emitter.on("Navigation:closeTasks", this.hideCards);
  }
}
