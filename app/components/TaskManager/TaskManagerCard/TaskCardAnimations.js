import gsap from "gsap";
import { Flip } from "gsap/Flip";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollToPlugin);

export default class TaskCardAnimations {
  constructor(card) {
    this.card = card;

    this.container = document.querySelector(".task-manager__container");
    this.cardState = this.card.querySelector(".card-state");
    this.fullscreenState = this.card.querySelector(".fullscreen-state");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");
    this.taskGrid = document.querySelector(".task-manager__tasks-grid");
  }

  cardToFullScreen(index, callback) {
    const cardState = this.card.querySelector(".card-state");
    const fullscreenState = this.card.querySelector(".fullscreen-state");
    const tl = gsap.timeline();
    const remainingCards = this.hideRemainingCards(index);

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
      this.container,
      {
        scrollTo: { y: 0 },
        duration: 0.4, // Duration in seconds
        ease: "power2.Out", // Easing function
      },
      "<"
    );
    tl.add(remainingCards, "<");
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

  fullscreenToCard(index) {
    const tasks = document.querySelectorAll(".task-manager__task-card-container");

    const cardState = this.card.querySelector(".card-state");
    const fullscreenState = this.card.querySelector(".fullscreen-state");

    const tl = gsap.timeline();

    tl.to(fullscreenState, {
      opacity: 0,
    });
    tl.add(() => {
      const state = Flip.getState(this.card);
      tasks[index].appendChild(this.card);
      fullscreenState.style.display = "none";
      cardState.style.display = "flex";

      Flip.from(state, {
        duration: 0.5,
        absolute: true,
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
    tl.to(this.remainingCards.all, {
      y: 0,
      opacity: 1,
      duration: 0.2,
      stagger: 0.04,
      delay: 1,
      ease: "power3.easeOut",
    });
  }

  hideRemainingCards = (index) => {
    const tl = gsap.timeline();
    const taskCards = document.querySelectorAll(".task-manager__task-card");
    console.log(index);

    // Get the cards before and after the current card
    // using reduce to filter out the current card
    this.remainingCards = Array.from(taskCards).reduce(
      (acc, card) => {
        const cardIndex = parseInt(card.getAttribute("index"));
        console.log(cardIndex);
        // Skip if the current card is the one we're focusing on
        if (cardIndex === index) return acc;
        // Add the card to the remaining cards
        acc.all.push(card);
        // Categorize the card into beforeCards or afterCards
        if (cardIndex < index) {
          acc.beforeCards.push(card);
        } else {
          acc.afterCards.push(card);
        }
        return acc;
      },
      { beforeCards: [], afterCards: [], all: [] }
    );

    tl.to(this.remainingCards.beforeCards, {
      y: -100,
      opacity: 0,
      duration: 0.2,
    });
    tl.to(
      this.remainingCards.afterCards,
      {
        y: 100,
        opacity: 0,
        duration: 0.2,
      },
      "<"
    );

    return tl;
  };
}
