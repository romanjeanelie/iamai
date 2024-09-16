import gsap from "gsap";

export default class HeroBentoAnimations {
  constructor() {
    // DOM Elements
    this.header = document.querySelector(".heroBentoGrid__header");
    this.bentoCards = document.querySelectorAll(".heroBentoGrid__grid-item");
    this.initHiddenBentoCards();
  }

  initHiddenBentoCards() {
    gsap.set(this.header, { opacity: 0, yPercent: 5 });
    gsap.set(this.bentoCards, { opacity: 0, yPercent: 10 });
  }

  showBentoCards() {
    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.4 } });
    tl.to(this.header, { opacity: 1, yPercent: 0, delay: 1 });

    tl.to(
      this.bentoCards,
      {
        opacity: 1,
        yPercent: 0,
        stagger: {
          amount: 0.2,
          grid: "auto",
        },
        duration: 0.4,
      },
      "<+=0.2"
    );
  }
}
