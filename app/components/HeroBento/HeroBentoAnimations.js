import gsap from "gsap";

export default class HeroBentoAnimations {
  constructor() {
    // DOM Elements
    this.bentoCards = document.querySelectorAll(".heroBentoGrid__grid-item");
    this.initHiddenBentoCards();
  }

  initHiddenBentoCards() {
    gsap.set(this.bentoCards, { opacity: 0 });
  }

  showBentoCards() {
    gsap.to(this.bentoCards, {
      opacity: 1,
      stagger: {
        amount: 0.5,
        grid: "auto",
      },
      duration: 0.5,
      delay: 1.2,
    });
  }
}
